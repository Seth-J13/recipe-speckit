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

async function seedRecipe(email) {
  const user = await createUser(email);
  const token = await tokenFor(user);
  const recipe = await db.recipe.create({
    name: "Pancakes",
    description: "Weekend breakfast",
    servings: 4,
    time: 20,
    isPublished: false,
    userId: user.id,
  });
  const ingredient = await db.ingredient.create({
    name: "Flour",
    unit: "cup",
    pricePerUnit: 0.5,
  });
  return { user, token, recipe, ingredient };
}

describe("Feature 5 — Recipe Details Management", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await db.recipeIngredient.destroy({ where: {}, force: true });
    await db.recipeStep.destroy({ where: {}, force: true });
    await db.recipe.destroy({ where: {}, force: true });
    await db.ingredient.destroy({ where: {}, force: true });
    await db.session.destroy({ where: {}, force: true });
    await db.user.destroy({ where: {}, force: true });
  });

  describe("US-5.9 — Add New Ingredient", () => {
    it("User inputs correct values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown", async () => {
      const { token, recipe, ingredient } = await seedRecipe("add-ok@test.com");

      const res = await request(app)
        .post(`/recipeapi/recipes/${recipe.id}/recipeIngredients/`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          quantity: 2,
          recipeId: recipe.id,
          recipeStepId: null,
          ingredientId: ingredient.id,
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          quantity: 2,
          recipeId: recipe.id,
          ingredientId: ingredient.id,
        })
      );
      expect(res.body.id).toBeDefined();
    });

    it("User inputs incorrect values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown", async () => {
      const { token, recipe, ingredient } = await seedRecipe("add-bad@test.com");

      const unauthenticated = await request(app)
        .post(`/recipeapi/recipes/${recipe.id}/recipeIngredients/`)
        .send({
          quantity: 2,
          recipeId: recipe.id,
          ingredientId: ingredient.id,
        });
      expect(unauthenticated.status).toBe(401);

      const notOwned = await request(app)
        .post(`/recipeapi/recipes/${recipe.id}/recipeIngredients/`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          quantity: 2,
          recipeId: 999999,
          ingredientId: ingredient.id,
        });
      expect(notOwned.status).toBe(404);
      expect(notOwned.body).toEqual(
        expect.objectContaining({ message: expect.any(String) })
      );
    });
  });

  describe("US-5.10 — Edit Ingredient", () => {
    it("User inputs correct values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown", async () => {
      const { token, recipe, ingredient } = await seedRecipe("edit-ok@test.com");
      const row = await db.recipeIngredient.create({
        quantity: 1,
        recipeId: recipe.id,
        ingredientId: ingredient.id,
      });
      const sugar = await db.ingredient.create({
        name: "Sugar",
        unit: "tbsp",
        pricePerUnit: 0.2,
      });

      const res = await request(app)
        .put(`/recipeapi/recipes/${recipe.id}/recipeIngredients/${row.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          quantity: 3,
          recipeId: recipe.id,
          ingredientId: sugar.id,
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          message: "RecipeIngredient was updated successfully.",
        })
      );

      const stored = await db.recipeIngredient.findByPk(row.id);
      expect(stored.quantity).toBe(3);
      expect(stored.ingredientId).toBe(sugar.id);
    });

    it("User inputs incorrect values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown", async () => {
      const { token, recipe, ingredient } = await seedRecipe(
        "edit-bad@test.com"
      );
      const row = await db.recipeIngredient.create({
        quantity: 1,
        recipeId: recipe.id,
        ingredientId: ingredient.id,
      });

      const unauthenticated = await request(app)
        .put(`/recipeapi/recipes/${recipe.id}/recipeIngredients/${row.id}`)
        .send({ quantity: 9, recipeId: recipe.id, ingredientId: ingredient.id });
      expect(unauthenticated.status).toBe(401);

      const missing = await request(app)
        .put(`/recipeapi/recipes/${recipe.id}/recipeIngredients/999999`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          quantity: 9,
          recipeId: recipe.id,
          ingredientId: ingredient.id,
        });
      expect(missing.status).toBe(200);
      expect(missing.body.message).toMatch(/Cannot update RecipeIngredient/i);
    });
  });

  describe("US-5.11 — Delete Ingredient", () => {
    it("User clicks delete icon button and successfully deletes the ingredient", async () => {
      const { token, recipe, ingredient } = await seedRecipe(
        "del-ok@test.com"
      );
      const row = await db.recipeIngredient.create({
        quantity: 1,
        recipeId: recipe.id,
        ingredientId: ingredient.id,
      });

      const res = await request(app)
        .delete(`/recipeapi/recipes/${recipe.id}/recipeIngredients/${row.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          message: "RecipeIngredient was deleted successfully!",
        })
      );
      expect(await db.recipeIngredient.findByPk(row.id)).toBeNull();
    });

    it("User clicks delete icon button and something goes wrong removing ingredient", async () => {
      const { token, recipe, ingredient } = await seedRecipe(
        "del-bad@test.com"
      );
      const row = await db.recipeIngredient.create({
        quantity: 1,
        recipeId: recipe.id,
        ingredientId: ingredient.id,
      });

      const spy = jest
        .spyOn(db.recipeIngredient, "destroy")
        .mockRejectedValueOnce(new Error("Could not remove Flour from Pancakes"));

      const res = await request(app)
        .delete(`/recipeapi/recipes/${recipe.id}/recipeIngredients/${row.id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(500);
      expect(res.body).toEqual(
        expect.objectContaining({ message: expect.any(String) })
      );

      spy.mockRestore();
    });
  });
});
