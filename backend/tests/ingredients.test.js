/**
 * Feature 3 — Ingredients Management
 * Spec: features/feature-3-Ingredients-Management.md
 */

const request = require("supertest");
const app = require("../server");
const db = require("../app/models");

async function createSignedInUser(email) {
  const response = await request(app).post("/recipeapi/users/").send({
    firstName: "Test",
    lastName: "Cook",
    email,
    password: "password123",
  });
  expect(response.status).toBe(200);
  expect(response.body.token).toBeDefined();
  return response.body;
}

function authHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

describe("Feature 3 — Ingredients Management", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await db.sequelize.close();
  });

  beforeEach(async () => {
    await db.ingredient.destroy({ where: {} });
  });

  describe("US-3.1 — view ingredients list", () => {
    it("view ingredients list", async () => {
      const cookA = await createSignedInUser(`cook-a-${Date.now()}@example.com`);
      const cookB = await createSignedInUser(`cook-b-${Date.now()}@example.com`);

      const fromA = await request(app)
        .post("/recipeapi/ingredients/")
        .set(authHeader(cookA.token))
        .send({ name: "Flour", unit: "Cup", pricePerUnit: 1.5 });
      const fromB = await request(app)
        .post("/recipeapi/ingredients/")
        .set(authHeader(cookB.token))
        .send({ name: "Sugar", unit: "Pound", pricePerUnit: 0.8 });

      expect(fromA.status).toBe(200);
      expect(fromB.status).toBe(200);

      const list = await request(app).get("/recipeapi/ingredients/");
      expect(list.status).toBe(200);
      const names = list.body.map((row) => row.name).sort();
      expect(names).toEqual(["Flour", "Sugar"]);
    });
  });

  describe("US-3.6 — add ingredient with POST", () => {
    it("add ingredient with POST", async () => {
      const cook = await createSignedInUser(`cook-add-${Date.now()}@example.com`);

      const created = await request(app)
        .post("/recipeapi/ingredients/")
        .set(authHeader(cook.token))
        .send({ name: "Salt", unit: "Cup", pricePerUnit: 0.4 });

      expect(created.status).toBe(200);
      expect(created.body.name).toBe("Salt");
      expect(created.body.unit).toBe("Cup");
      expect(Number(created.body.pricePerUnit)).toBeCloseTo(0.4);

      const list = await request(app).get("/recipeapi/ingredients/");
      expect(list.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Salt",
            unit: "Cup",
          }),
        ])
      );
    });
  });

  describe("US-3.8 — update ingredient with PUT", () => {
    it("update ingredient with PUT", async () => {
      const cook = await createSignedInUser(`cook-edit-${Date.now()}@example.com`);

      const created = await request(app)
        .post("/recipeapi/ingredients/")
        .set(authHeader(cook.token))
        .send({ name: "Flour", unit: "Cup", pricePerUnit: 1.5 });
      expect(created.status).toBe(200);
      const ingredientId = created.body.id;

      const updated = await request(app)
        .put(`/recipeapi/ingredients/${ingredientId}`)
        .set(authHeader(cook.token))
        .send({
          name: "Bread Flour",
          unit: "Pound",
          pricePerUnit: 2.1,
        });

      expect(updated.status).toBe(200);

      const list = await request(app).get("/recipeapi/ingredients/");
      expect(list.body).toHaveLength(1);
      expect(list.body[0]).toEqual(
        expect.objectContaining({
          id: ingredientId,
          name: "Bread Flour",
          unit: "Pound",
        })
      );
      expect(Number(list.body[0].pricePerUnit)).toBeCloseTo(2.1);
    });
  });
});
