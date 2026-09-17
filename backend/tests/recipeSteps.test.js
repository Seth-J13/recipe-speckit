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
  return { user, token, recipe };
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

  describe("US-5.12 — Add a Step to the recipe", () => {
    it("User inputs correct values into `Number` input text", async () => {
      const { token, recipe } = await seedRecipe("step-add-ok@test.com");

      const res = await request(app)
        .post(`/recipeapi/recipes/${recipe.id}/recipeSteps/`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          stepNumber: 1,
          instruction: "Mix dry ingredients",
          recipeId: recipe.id,
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          stepNumber: 1,
          instruction: "Mix dry ingredients",
          recipeId: recipe.id,
        })
      );
      expect(res.body.id).toBeDefined();
    });

    it("User inputs incorrect values into `Number` input text", async () => {
      const { token, recipe } = await seedRecipe("step-add-bad@test.com");

      const unauthenticated = await request(app)
        .post(`/recipeapi/recipes/${recipe.id}/recipeSteps/`)
        .send({
          stepNumber: 1,
          instruction: "Mix",
          recipeId: recipe.id,
        });
      expect(unauthenticated.status).toBe(401);

      const missingNumber = await request(app)
        .post(`/recipeapi/recipes/${recipe.id}/recipeSteps/`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          instruction: "Mix",
          recipeId: recipe.id,
        });
      expect(missingNumber.status).toBeGreaterThanOrEqual(400);
      expect(missingNumber.status).not.toBe(200);
    });
  });

  describe("US-5.13 — Edit a Step to the recipe", () => {
    it("User inputs correct values into `Number` input text", async () => {
      const { token, recipe } = await seedRecipe("step-edit-ok@test.com");
      const step = await db.recipeStep.create({
        stepNumber: 1,
        instruction: "Mix",
        recipeId: recipe.id,
      });

      const res = await request(app)
        .put(`/recipeapi/recipes/${recipe.id}/recipeSteps/${step.id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          stepNumber: 3,
          instruction: "Pour batter",
          recipeId: recipe.id,
        });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          message: "RecipeStep was updated successfully.",
        })
      );

      const stored = await db.recipeStep.findByPk(step.id);
      expect(stored.stepNumber).toBe(3);
      expect(stored.instruction).toBe("Pour batter");
    });

    it("User inputs incorrect values into `Number` input text", async () => {
      const { token, recipe } = await seedRecipe("step-edit-bad@test.com");
      const step = await db.recipeStep.create({
        stepNumber: 1,
        instruction: "Mix",
        recipeId: recipe.id,
      });

      const unauthenticated = await request(app)
        .put(`/recipeapi/recipes/${recipe.id}/recipeSteps/${step.id}`)
        .send({ stepNumber: 2, instruction: "Wait", recipeId: recipe.id });
      expect(unauthenticated.status).toBe(401);

      const missing = await request(app)
        .put(`/recipeapi/recipes/${recipe.id}/recipeSteps/999999`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          stepNumber: 2,
          instruction: "Wait",
          recipeId: recipe.id,
        });
      expect(missing.status).toBe(200);
      expect(missing.body.message).toMatch(/Cannot update RecipeStep/i);
    });
  });
});
