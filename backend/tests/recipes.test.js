/**
 * Feature 4 — Create, Read, and Delete Recipes
 * Spec: features/feature-4-CR-recipes.md
 */

const request = require("supertest");
const mysql = require("mysql2/promise");
const app = require("../server");
const db = require("../app/models");
const { getSalt, hashPassword } = require("../app/authentication/crypto");

async function ensureTestDatabase() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
  });
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``
  );
  await conn.end();
}

async function createUser({ firstName, lastName, email, password }) {
  const salt = await getSalt();
  const hash = await hashPassword(password, salt);
  return db.user.create({
    firstName,
    lastName,
    email,
    password: hash,
    salt,
  });
}

async function login(email, password) {
  const basic = Buffer.from(`${email}:${password}`).toString("base64");
  const res = await request(app)
    .post("/recipeapi/login")
    .set("Authorization", `Basic ${basic}`);
  if (res.status !== 200 || !res.body.token) {
    throw new Error(`Login failed: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return res.body;
}

function recipeBody(overrides = {}) {
  return {
    name: "Dave's Hot Chicken",
    description: "Spicy fried chicken",
    servings: 2,
    time: 30,
    isPublished: false,
    ...overrides,
  };
}

describe("Feature 4 — Create, Read, and Delete Recipes", () => {
  let userA;
  let userB;
  let tokenA;
  let ownedPublished;
  let ownedUnpublished;
  let otherPublished;
  let otherUnpublished;

  beforeAll(async () => {
    await ensureTestDatabase();
    await db.sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await db.recipeIngredient.destroy({ where: {} });
    await db.recipeStep.destroy({ where: {} });
    await db.recipe.destroy({ where: {} });
    await db.session.destroy({ where: {} });
    await db.user.destroy({ where: {} });

    userA = await createUser({
      firstName: "Alex",
      lastName: "Owner",
      email: "owner@example.com",
      password: "password123",
    });
    userB = await createUser({
      firstName: "Blair",
      lastName: "Other",
      email: "other@example.com",
      password: "password123",
    });

    tokenA = (await login("owner@example.com", "password123")).token;

    ownedPublished = await db.recipe.create(
      recipeBody({
        name: "Owner Published",
        isPublished: true,
        userId: userA.id,
      })
    );
    ownedUnpublished = await db.recipe.create(
      recipeBody({
        name: "Owner Draft",
        isPublished: false,
        userId: userA.id,
      })
    );
    otherPublished = await db.recipe.create(
      recipeBody({
        name: "Other Published",
        isPublished: true,
        userId: userB.id,
      })
    );
    otherUnpublished = await db.recipe.create(
      recipeBody({
        name: "Other Draft",
        isPublished: false,
        userId: userB.id,
      })
    );
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  describe("US-4.1 — Add Recipe", () => {
    it("Add button confirms operation", async () => {
      const payload = recipeBody({
        name: "  New Owned Recipe  ",
        description: "From the add modal",
        servings: 4,
        time: 45,
        isPublished: true,
        userId: userB.id,
      });

      const res = await request(app)
        .post("/recipeapi/recipes/")
        .set("Authorization", `Bearer ${tokenA}`)
        .send(payload);

      expect([200, 201]).toContain(res.status);
      expect(res.body.name).toBe("New Owned Recipe");
      expect(res.body.description).toBe("From the add modal");
      expect(res.body.servings).toBe(4);
      expect(res.body.time).toBe(45);
      expect(Boolean(res.body.isPublished)).toBe(true);
      expect(res.body.userId).toBe(userA.id);

      const unauthenticated = await request(app)
        .post("/recipeapi/recipes/")
        .send(payload);
      expect(unauthenticated.status).toBe(401);
    });
  });

  describe("US-4.2 — View Recipes", () => {
    it("See list (signed in)", async () => {
      const unauthorized = await request(app).get(
        `/recipeapi/recipes/user/${userA.id}`
      );
      expect(unauthorized.status).toBe(401);

      const res = await request(app)
        .get(`/recipeapi/recipes/user/${userA.id}`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      const names = res.body.map((recipe) => recipe.name);
      expect(names).toEqual(["Owner Draft", "Owner Published"]);
      expect(res.body.every((recipe) => recipe.userId === userA.id)).toBe(
        true
      );
    });

    it("See list (signed out)", async () => {
      const res = await request(app).get("/recipeapi/recipes");

      expect(res.status).toBe(200);
      const names = res.body.map((recipe) => recipe.name);
      expect(names).toEqual(["Other Published", "Owner Published"]);
      expect(names).not.toContain("Owner Draft");
      expect(names).not.toContain("Other Draft");
      expect(res.body.every((recipe) => recipe.isPublished)).toBe(true);

      const published = await request(app).get(
        `/recipeapi/recipes/${otherPublished.id}`
      );
      expect(published.status).toBe(200);
      expect(published.status).not.toBe(403);
    });
  });

  describe("US-4.6 — Delete Recipe", () => {
    it("user (signed-in) selects delete icon", async () => {
      const unauthenticated = await request(app).delete(
        `/recipeapi/recipes/${ownedPublished.id}`
      );
      expect(unauthenticated.status).toBe(401);

      const missing = await request(app)
        .delete("/recipeapi/recipes/999999")
        .set("Authorization", `Bearer ${tokenA}`);
      expect(missing.status).not.toBe(403);
      expect(missing.body.message).toMatch(/not found/i);
    });

    it("user (signed-in) confirm delete action", async () => {
      const res = await request(app)
        .delete(`/recipeapi/recipes/${ownedUnpublished.id}`)
        .set("Authorization", `Bearer ${tokenA}`);

      expect(res.status).toBe(200);
      const remaining = await db.recipe.findByPk(ownedUnpublished.id);
      expect(remaining).toBeNull();

      const stillOwned = await db.recipe.findByPk(ownedPublished.id);
      expect(stillOwned).not.toBeNull();

      const crossUser = await request(app)
        .delete(`/recipeapi/recipes/${otherPublished.id}`)
        .set("Authorization", `Bearer ${tokenA}`);
      expect(crossUser.status).toBe(404);
      expect(crossUser.status).not.toBe(403);
      const stillOther = await db.recipe.findByPk(otherPublished.id);
      expect(stillOther).not.toBeNull();
    });
  });
});
