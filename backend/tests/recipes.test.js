/**
 * Feature 5 — Recipe Details Management
 * Spec: features/feature-5-recipe-details-management.md
 */
const request = require("supertest");
const db = require("../app/models");
const { getSalt, hashPassword, encrypt } = require("../app/authentication/crypto");
const app = require("../server");

async function createUser(email) {
  const salt = await getSalt();
  const password = await hashPassword("password123", salt);
  return db.user.create({
    firstName: "Test",
    lastName: "Owner",
    email,
    password,
    salt,
  });
}

async function tokenFor(user) {
  const session = await db.session.create({
    email: user.email,
    userId: user.id,
    expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  return encrypt(session.id);
}

async function createRecipe(user, overrides = {}) {
  return db.recipe.create({
    name: "Pancakes",
    description: "Weekend breakfast",
    servings: 4,
    time: 20,
    isPublished: false,
    userId: user.id,
    ...overrides,
  });
}

describe("Feature 5 — Recipe Details Management", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await db.recipeIngredient.destroy({ where: {}, force: true });
    await db.recipeStep.destroy({ where: {}, force: true });
    await db.recipe.destroy({ where: {}, force: true });
    await db.session.destroy({ where: {}, force: true });
    await db.user.destroy({ where: {}, force: true });
  });

  describe("US-5.7 — Finalize Changes", () => {
    it("User clicks the `Update Recipe` button with correct values", async () => {
      const user = await createUser("owner@test.com");
      const token = await tokenFor(user);
      const recipe = await createRecipe(user);

      const res = await request(app)
        .put(`/recipeapi/recipes/${recipe.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Fluffy Pancakes",
          description: "Updated description",
          servings: 6,
          time: 25,
          isPublished: true,
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          message: "Recipe was updated successfully.",
        })
      );

      const stored = await db.recipe.findByPk(recipe.id);
      expect(stored.name).toBe("Fluffy Pancakes");
      expect(stored.description).toBe("Updated description");
      expect(stored.servings).toBe(6);
      expect(stored.time).toBe(25);
      expect(stored.isPublished).toBe(true);
    });

    it("User clicks the `Update Recipe` button with incorrect values", async () => {
      const owner = await createUser("owner@test.com");
      const other = await createUser("other@test.com");
      const token = await tokenFor(other);
      const recipe = await createRecipe(owner);

      const unauthenticated = await request(app)
        .put(`/recipeapi/recipes/${recipe.id}`)
        .send({ name: "Hacked" });
      expect(unauthenticated.status).toBe(401);
      expect(unauthenticated.body).toEqual(
        expect.objectContaining({ message: expect.any(String) })
      );

      const notOwned = await request(app)
        .put(`/recipeapi/recipes/${recipe.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Hacked",
          description: "nope",
          servings: 1,
          time: 1,
          isPublished: true,
        });
      expect(notOwned.status).toBe(404);
      expect(notOwned.body).toEqual(
        expect.objectContaining({
          message: `Cannot find Recipe with id=${recipe.id}.`,
        })
      );

      const missing = await request(app)
        .put("/recipeapi/recipes/999999")
        .set("Authorization", `Bearer ${token}`)
        .send({
          name: "Ghost",
          description: "missing",
          servings: 1,
          time: 1,
          isPublished: false,
        });
      expect(missing.status).toBe(404);
      expect(missing.body).toEqual(
        expect.objectContaining({ message: expect.any(String) })
      );
    });
  });
});
