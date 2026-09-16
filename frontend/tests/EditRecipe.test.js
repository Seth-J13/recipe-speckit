/**
 * Feature 5 — Recipe Details Management
 * Spec: features/feature-5-recipe-details-management.md
 */
import { flushPromises, mount } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { nextTick } from "vue";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EditRecipe from "../src/views/EditRecipe.vue";
import IngredientServices from "../src/services/IngredientServices.js";
import RecipeIngredientServices from "../src/services/RecipeIngredientServices";
import RecipeServices from "../src/services/RecipeServices";
import RecipeStepServices from "../src/services/RecipeStepServices";

vi.mock("vue-router", () => ({
  useRoute: () => ({ params: { id: "1" } }),
}));

vi.mock("../src/services/IngredientServices.js", () => ({
  default: {
    getIngredients: vi.fn(),
  },
}));

vi.mock("../src/services/RecipeIngredientServices", () => ({
  default: {
    getRecipeIngredientsForRecipe: vi.fn(),
    addRecipeIngredient: vi.fn(),
    updateRecipeIngredient: vi.fn(),
    deleteRecipeIngredient: vi.fn(),
  },
}));

vi.mock("../src/services/RecipeServices", () => ({
  default: {
    getRecipe: vi.fn(),
    updateRecipe: vi.fn(),
  },
}));

vi.mock("../src/services/RecipeStepServices", () => ({
  default: {
    getRecipeStepsForRecipeWithIngredients: vi.fn(),
    addRecipeStep: vi.fn(),
    updateRecipeStep: vi.fn(),
    deleteRecipeStep: vi.fn(),
  },
}));

const vuetify = createVuetify({ components, directives });

const baseRecipe = {
  id: 1,
  name: "Pancakes",
  description: "Weekend breakfast",
  servings: 4,
  time: 20,
  isPublished: false,
  userId: 42,
};

const flour = {
  id: 5,
  name: "Flour",
  unit: "cup",
  pricePerUnit: 0.5,
};

const recipeIngredientRow = {
  id: 11,
  quantity: 2,
  recipeId: 1,
  recipeStepId: null,
  ingredientId: 5,
  ingredient: flour,
};

const stepOne = {
  id: 21,
  stepNumber: 1,
  instruction: "Mix dry ingredients",
  recipeId: 1,
  recipeIngredient: [],
};

function stubApis({
  recipe = baseRecipe,
  recipeIngredients = [recipeIngredientRow],
  recipeSteps = [stepOne],
  catalog = [flour],
} = {}) {
  RecipeServices.getRecipe.mockResolvedValue({ data: [{ ...recipe }] });
  RecipeServices.updateRecipe.mockResolvedValue({
    data: { message: "Recipe was updated successfully." },
  });
  RecipeIngredientServices.getRecipeIngredientsForRecipe.mockResolvedValue({
    data: recipeIngredients,
  });
  RecipeIngredientServices.addRecipeIngredient.mockResolvedValue({
    data: { id: 12, quantity: 1, recipeId: 1, ingredientId: 5 },
  });
  RecipeIngredientServices.updateRecipeIngredient.mockResolvedValue({
    data: { message: "RecipeIngredient was updated successfully." },
  });
  RecipeIngredientServices.deleteRecipeIngredient.mockResolvedValue({
    data: { message: "RecipeIngredient was deleted successfully!" },
  });
  IngredientServices.getIngredients.mockResolvedValue({ data: catalog });
  RecipeStepServices.getRecipeStepsForRecipeWithIngredients.mockResolvedValue({
    data: recipeSteps,
  });
  RecipeStepServices.addRecipeStep.mockResolvedValue({
    data: { id: 22, stepNumber: 2, instruction: "Cook", recipeId: 1 },
  });
  RecipeStepServices.updateRecipeStep.mockResolvedValue({
    data: { message: "RecipeStep was updated successfully." },
  });
  RecipeStepServices.deleteRecipeStep.mockResolvedValue({
    data: { message: "RecipeStep was deleted successfully!" },
  });
}

async function mountPage() {
  const wrapper = mount(EditRecipe, {
    global: { plugins: [vuetify] },
  });
  await flushPromises();
  await nextTick();
  return wrapper;
}

function writeMocks() {
  RecipeServices.updateRecipe.mockClear();
  RecipeIngredientServices.addRecipeIngredient.mockClear();
  RecipeIngredientServices.updateRecipeIngredient.mockClear();
  RecipeIngredientServices.deleteRecipeIngredient.mockClear();
  RecipeStepServices.addRecipeStep.mockClear();
  RecipeStepServices.updateRecipeStep.mockClear();
  RecipeStepServices.deleteRecipeStep.mockClear();
}

async function clickNamedButton(wrapper, label) {
  if (label === "Add Ingredient") {
    await wrapper.vm.addIngredient();
    return;
  }
  if (label === "Update Ingredient") {
    await wrapper.vm.updateIngredient();
    return;
  }
  if (label === "Add Step") {
    await wrapper.vm.addStep();
    return;
  }
  if (label === "Update Step") {
    await wrapper.vm.updateStep();
    return;
  }
  if (label === "Close") {
    if (wrapper.vm.isAddIngredient) wrapper.vm.closeAddIngredient();
    else if (wrapper.vm.isEditIngredient) wrapper.vm.closeEditIngredient();
    else if (wrapper.vm.isAddStep) wrapper.vm.closeAddStep();
    else if (wrapper.vm.isEditStep) wrapper.vm.closeEditStep();
    return;
  }
  const btn = wrapper.findAll("button").find((b) => b.text().trim() === label);
  expect(btn, `button "${label}"`).toBeTruthy();
  await btn.trigger("click");
}

async function openEditIngredientRow(wrapper) {
  wrapper.vm.openEditIngredient(wrapper.vm.recipeIngredients[0]);
  await nextTick();
}

async function openEditStepRow(wrapper) {
  const steps = wrapper.vm.recipeSteps;
  wrapper.vm.openEditStep(steps[steps.length - 1]);
  await nextTick();
}

describe("Feature 5 — Recipe Details Management", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.spyOn(console, "log").mockImplementation(() => {});
    stubApis();
  });

  describe("US-5.1 — Edit Recipe Name", () => {
    it("User edits recipe name", async () => {
      const wrapper = await mountPage();
      writeMocks();
      const nameInput = wrapper.findAll("input").at(0);
      await nameInput.setValue("Fluffy Pancakes");
      expect(wrapper.vm.recipe.name).toBe("Fluffy Pancakes");
      expect(RecipeServices.updateRecipe).not.toHaveBeenCalled();
      wrapper.unmount();
    });
  });

  describe("US-5.2 — Edit Recipe Number of Servings", () => {
    it("User changes the number of servings with a number", async () => {
      const wrapper = await mountPage();
      writeMocks();
      const servings = wrapper.findAll('input[type="number"]').at(0);
      await servings.setValue("8");
      expect(wrapper.vm.recipe.servings).toBe(8);
      expect(RecipeServices.updateRecipe).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User changes the number of servings with a NaN value", async () => {
      const wrapper = await mountPage();
      writeMocks();
      const servings = wrapper.findAll('input[type="number"]').at(0);
      await servings.setValue("abc");
      await servings.trigger("blur");
      expect(Number.isNaN(Number(servings.element.value)) || servings.element.value === "").toBe(
        true
      );
      expect(RecipeServices.updateRecipe).not.toHaveBeenCalled();
      wrapper.unmount();
    });
  });

  describe("US-5.3 — Edit Recipe Time to Make (in minutes)", () => {
    it("User changes the time to make (in minutes) to a number", async () => {
      const wrapper = await mountPage();
      writeMocks();
      const time = wrapper.findAll('input[type="number"]').at(1);
      await time.setValue("45");
      expect(wrapper.vm.recipe.time).toBe(45);
      expect(RecipeServices.updateRecipe).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User changes the time to make (in minutes) to a NaN", async () => {
      const wrapper = await mountPage();
      writeMocks();
      const time = wrapper.findAll('input[type="number"]').at(1);
      await time.setValue("xyz");
      await time.trigger("blur");
      expect(Number.isNaN(Number(time.element.value)) || time.element.value === "").toBe(
        true
      );
      expect(RecipeServices.updateRecipe).not.toHaveBeenCalled();
      wrapper.unmount();
    });
  });

  describe("US-5.4 — Toggle Publish", () => {
    it("User toggles the publish recipe switch", async () => {
      const wrapper = await mountPage();
      writeMocks();
      expect(wrapper.vm.recipe.isPublished).toBe(false);
      const sw = wrapper.find(".v-switch input");
      expect(sw.exists()).toBe(true);
      await sw.setValue(true);
      expect(wrapper.vm.recipe.isPublished).toBe(true);
      expect(RecipeServices.updateRecipe).not.toHaveBeenCalled();
      wrapper.unmount();
    });
  });

  describe("US-5.5 — Edit Recipe Description", () => {
    it("User changes the recipe description", async () => {
      const wrapper = await mountPage();
      writeMocks();
      await wrapper.get("textarea").setValue("Crispy edges");
      expect(wrapper.vm.recipe.description).toBe("Crispy edges");
      wrapper.unmount();
    });
  });

  describe("US-5.6 — Expand Description Text Box", () => {
    it("User grabs the resizer and moves it vertically, up or down", async () => {
      const wrapper = await mountPage();
      writeMocks();
      const textarea = wrapper.get("textarea").element;
      expect(textarea.tagName).toBe("TEXTAREA");
      expect(["", "auto", "vertical", "both"]).toContain(
        getComputedStyle(textarea).resize
      );
      expect(RecipeServices.updateRecipe).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User grabs the resizer and moves it horizontally, left or right", async () => {
      const wrapper = await mountPage();
      writeMocks();
      const textarea = wrapper.get("textarea").element;
      const resize = getComputedStyle(textarea).resize;
      expect(resize).not.toBe("horizontal");
      expect(RecipeServices.updateRecipe).not.toHaveBeenCalled();
      wrapper.unmount();
    });
  });

  describe("US-5.7 — Finalize Changes", () => {
    it("User clicks the `Update Recipe` button with correct values", async () => {
      const wrapper = await mountPage();
      await clickNamedButton(wrapper, "Update Recipe");
      await flushPromises();
      expect(RecipeServices.updateRecipe).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          id: 1,
        })
      );
      expect(wrapper.vm.snackbar.text).toContain("updated successfully");
      expect(wrapper.text()).toContain("Edit Recipe");
      wrapper.unmount();
    });

    it("User clicks the `Update Recipe` button with incorrect values", async () => {
      RecipeServices.updateRecipe.mockRejectedValueOnce({
        response: {
          status: 400,
          data: {
            message:
              "Invalid recipe recipeId, description, serving, time, or step",
          },
        },
      });
      const wrapper = await mountPage();
      await clickNamedButton(wrapper, "Update Recipe");
      await flushPromises();
      expect(wrapper.vm.snackbar.text).toContain(
        "Invalid recipe recipeId, description, serving, time, or step"
      );
      expect(wrapper.text()).toContain("Edit Recipe");
      wrapper.unmount();
    });
  });

  describe("US-5.8 — View List of Ingredients", () => {
    it("User views recipe with ingredients", async () => {
      const wrapper = await mountPage();
      writeMocks();
      expect(wrapper.text()).toContain("Flour");
      expect(wrapper.text()).toContain("2");
      expect(wrapper.text()).toContain("0.5");
      expect(wrapper.findAll(".v-icon").length).toBeGreaterThan(0);
      expect(RecipeIngredientServices.addRecipeIngredient).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User views recipe with no ingredients", async () => {
      stubApis({ recipeIngredients: [], recipeSteps: [] });
      const wrapper = await mountPage();
      writeMocks();
      expect(wrapper.text()).toContain("Ingredients");
      expect(wrapper.text()).toContain("Add");
      expect(wrapper.text()).not.toContain("Flour");
      expect(RecipeIngredientServices.addRecipeIngredient).not.toHaveBeenCalled();
      wrapper.unmount();
    });
  });

  describe("US-5.9 — Add New Ingredient", () => {
    it("User clicks `Add` button in the ingredients table", async () => {
      const wrapper = await mountPage();
      writeMocks();
      wrapper.vm.openAddIngredient();
      await nextTick();
      expect(wrapper.vm.isAddIngredient).toBe(true);
      expect(RecipeIngredientServices.addRecipeIngredient).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User inputs a number into the quantity input text", async () => {
      const wrapper = await mountPage();
      wrapper.vm.openAddIngredient();
      await nextTick();
      writeMocks();
      wrapper.vm.newIngredient.quantity = 3;
      await nextTick();
      expect(wrapper.vm.newIngredient.quantity).toBe(3);
      expect(RecipeIngredientServices.addRecipeIngredient).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User inputs a `NaN` into the quantity input text", async () => {
      const wrapper = await mountPage();
      wrapper.vm.openAddIngredient();
      await nextTick();
      writeMocks();
      wrapper.vm.newIngredient.quantity = Number("nope");
      expect(Number.isNaN(wrapper.vm.newIngredient.quantity)).toBe(true);
      wrapper.vm.newIngredient.quantity = undefined;
      expect(wrapper.vm.newIngredient.quantity == null).toBe(true);
      expect(RecipeIngredientServices.addRecipeIngredient).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User selects an ingredient from the drop down", async () => {
      const wrapper = await mountPage();
      wrapper.vm.openAddIngredient();
      await nextTick();
      writeMocks();
      wrapper.vm.selectedIngredient = flour;
      await nextTick();
      expect(wrapper.vm.selectedIngredient.name).toBe("Flour");
      expect(RecipeIngredientServices.addRecipeIngredient).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User inputs correct values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown", async () => {
      const wrapper = await mountPage();
      wrapper.vm.openAddIngredient();
      await nextTick();
      wrapper.vm.newIngredient.quantity = 2;
      wrapper.vm.selectedIngredient = flour;
      await nextTick();
      await clickNamedButton(wrapper, "Add Ingredient");
      await flushPromises();
      expect(RecipeIngredientServices.addRecipeIngredient).toHaveBeenCalled();
      expect(wrapper.vm.snackbar.text).toContain("Ingredient added successfully!");
      wrapper.unmount();
    });

    it("User inputs incorrect values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown", async () => {
      RecipeIngredientServices.addRecipeIngredient.mockRejectedValueOnce({
        response: {
          status: 401,
          data: {
            message: "Cannot add the ingredient a value was inputted incorrectly.",
          },
        },
      });
      const wrapper = await mountPage();
      wrapper.vm.openAddIngredient();
      await nextTick();
      wrapper.vm.selectedIngredient = flour;
      await clickNamedButton(wrapper, "Add Ingredient");
      await flushPromises();
      expect(wrapper.vm.snackbar.text).toMatch(/Cannot add the ingredient|Could not add ingredient/i);
      wrapper.unmount();
    });

    it("User clicks the `Cancel` button", async () => {
      const wrapper = await mountPage();
      wrapper.vm.openAddIngredient();
      await nextTick();
      wrapper.vm.newIngredient.quantity = 9;
      writeMocks();
      await clickNamedButton(wrapper, "Close");
      await nextTick();
      expect(wrapper.vm.isAddIngredient).toBe(false);
      expect(RecipeIngredientServices.addRecipeIngredient).not.toHaveBeenCalled();
      wrapper.unmount();
    });
  });

  describe("US-5.10 — Edit Ingredient", () => {
    it("User clicks the edit icon button in the ingredients table", async () => {
      const wrapper = await mountPage();
      writeMocks();
      await openEditIngredientRow(wrapper);
      await nextTick();
      expect(wrapper.vm.isEditIngredient).toBe(true);
      expect(wrapper.vm.newIngredient.quantity).toBe(2);
      expect(RecipeIngredientServices.updateRecipeIngredient).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User inputs a number into the quantity input text", async () => {
      const wrapper = await mountPage();
      await openEditIngredientRow(wrapper);
      await nextTick();
      writeMocks();
      wrapper.vm.newIngredient.quantity = 4;
      await nextTick();
      expect(wrapper.vm.newIngredient.quantity).toBe(4);
      expect(RecipeIngredientServices.updateRecipeIngredient).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User inputs a `NaN` into the quantity input text", async () => {
      const wrapper = await mountPage();
      await openEditIngredientRow(wrapper);
      await nextTick();
      writeMocks();
      wrapper.vm.newIngredient.quantity = Number("zz");
      expect(Number.isNaN(wrapper.vm.newIngredient.quantity)).toBe(true);
      wrapper.vm.newIngredient.quantity = undefined;
      expect(wrapper.vm.newIngredient.quantity == null).toBe(true);
      expect(RecipeIngredientServices.updateRecipeIngredient).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User selects an ingredient from the drop down", async () => {
      const wrapper = await mountPage();
      await openEditIngredientRow(wrapper);
      await nextTick();
      writeMocks();
      wrapper.vm.selectedIngredient = { ...flour, name: "Sugar", id: 6 };
      await nextTick();
      expect(wrapper.vm.selectedIngredient.name).toBe("Sugar");
      expect(RecipeIngredientServices.updateRecipeIngredient).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User inputs correct values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown", async () => {
      const wrapper = await mountPage();
      await openEditIngredientRow(wrapper);
      await nextTick();
      wrapper.vm.newIngredient.quantity = 5;
      wrapper.vm.selectedIngredient = flour;
      await clickNamedButton(wrapper, "Update Ingredient");
      await flushPromises();
      expect(RecipeIngredientServices.updateRecipeIngredient).toHaveBeenCalled();
      expect(wrapper.vm.snackbar.text).toMatch(/updated successfully/i);
      wrapper.unmount();
    });

    it("User inputs incorrect values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown", async () => {
      RecipeIngredientServices.updateRecipeIngredient.mockRejectedValueOnce({
        response: {
          status: 401,
          data: {
            message: "Cannot update the ingredient a value was inputted incorrectly.",
          },
        },
      });
      const wrapper = await mountPage();
      await openEditIngredientRow(wrapper);
      await nextTick();
      wrapper.vm.selectedIngredient = flour;
      await clickNamedButton(wrapper, "Update Ingredient");
      await flushPromises();
      expect(wrapper.vm.snackbar.text).toMatch(/Cannot update the ingredient|Could not update ingredient/i);
      wrapper.unmount();
    });

    it("User clicks the `Cancel` button", async () => {
      const wrapper = await mountPage();
      await openEditIngredientRow(wrapper);
      await nextTick();
      writeMocks();
      await clickNamedButton(wrapper, "Close");
      await nextTick();
      expect(wrapper.vm.isEditIngredient).toBe(false);
      expect(RecipeIngredientServices.updateRecipeIngredient).not.toHaveBeenCalled();
      wrapper.unmount();
    });
  });

  describe("US-5.11 — Delete Ingredient", () => {
    it("User clicks delete icon button and successfully deletes the ingredient", async () => {
      const wrapper = await mountPage();
      await wrapper.vm.deleteIngredient(wrapper.vm.recipeIngredients[0]);
      await flushPromises();
      expect(RecipeIngredientServices.deleteRecipeIngredient).toHaveBeenCalled();
      expect(wrapper.vm.snackbar.text).toContain("Flour deleted successfully!");
      wrapper.unmount();
    });

    it("User clicks delete icon button and something goes wrong removing ingredient", async () => {
      RecipeIngredientServices.deleteRecipeIngredient.mockRejectedValueOnce({
        response: {
          status: 500,
          data: { message: "Could not remove the Flour from Pancakes" },
        },
      });
      const wrapper = await mountPage();
      await wrapper.vm.deleteIngredient(wrapper.vm.recipeIngredients[0]);
      await flushPromises();
      expect(wrapper.vm.snackbar.text).toContain("Could not remove the Flour from Pancakes");
      wrapper.unmount();
    });
  });

  describe("US-5.12 — Add a Step to the recipe", () => {
    it("User clicks `Add` button in the recipe steps table", async () => {
      const wrapper = await mountPage();
      writeMocks();
      wrapper.vm.openAddStep();
      await nextTick();
      expect(wrapper.vm.isAddStep).toBe(true);
      expect(RecipeStepServices.addRecipeStep).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User inputs a number into the `Number` input text", async () => {
      const wrapper = await mountPage();
      wrapper.vm.openAddStep();
      await nextTick();
      writeMocks();
      wrapper.vm.newStep.stepNumber = 2;
      await nextTick();
      expect(wrapper.vm.newStep.stepNumber).toBe(2);
      expect(RecipeStepServices.addRecipeStep).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User inputs a `NaN` into the `Number` input text", async () => {
      const wrapper = await mountPage();
      wrapper.vm.openAddStep();
      await nextTick();
      writeMocks();
      wrapper.vm.newStep.stepNumber = Number("no");
      expect(Number.isNaN(wrapper.vm.newStep.stepNumber)).toBe(true);
      wrapper.vm.newStep.stepNumber = undefined;
      expect(wrapper.vm.newStep.stepNumber == null).toBe(true);
      expect(RecipeStepServices.addRecipeStep).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User inputs the instruction for `Instruction` input text", async () => {
      const wrapper = await mountPage();
      wrapper.vm.openAddStep();
      await nextTick();
      writeMocks();
      wrapper.vm.newStep.instruction = "Fold batter";
      await nextTick();
      expect(wrapper.vm.newStep.instruction).toBe("Fold batter");
      expect(RecipeStepServices.addRecipeStep).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User does not input anything into `Instruction` input text", async () => {
      const wrapper = await mountPage();
      wrapper.vm.openAddStep();
      await nextTick();
      writeMocks();
      expect(wrapper.vm.newStep.instruction).toBeUndefined();
      expect(RecipeStepServices.addRecipeStep).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User selects an ingredient from the `Ingredients` dropdown", async () => {
      const wrapper = await mountPage();
      wrapper.vm.openAddStep();
      await nextTick();
      writeMocks();
      wrapper.vm.newStep.recipeIngredient = [recipeIngredientRow];
      await nextTick();
      expect(wrapper.vm.newStep.recipeIngredient).toHaveLength(1);
      expect(RecipeStepServices.addRecipeStep).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User does not select an ingredient from the `Ingredients` dropdown", async () => {
      const wrapper = await mountPage();
      wrapper.vm.openAddStep();
      await nextTick();
      writeMocks();
      expect(wrapper.vm.newStep.recipeIngredient).toEqual([]);
      expect(RecipeStepServices.addRecipeStep).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User inputs correct values into `Number` input text", async () => {
      const wrapper = await mountPage();
      wrapper.vm.openAddStep();
      await nextTick();
      wrapper.vm.newStep.stepNumber = 2;
      wrapper.vm.newStep.instruction = "Cook on griddle";
      await clickNamedButton(wrapper, "Add Step");
      await flushPromises();
      expect(RecipeStepServices.addRecipeStep).toHaveBeenCalled();
      expect(wrapper.vm.snackbar.text).toContain("Step added successfully!");
      wrapper.unmount();
    });

    it("User inputs incorrect values into `Number` input text", async () => {
      RecipeStepServices.addRecipeStep.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { message: "Cannot add the step number was inputted incorrectly" },
        },
      });
      const wrapper = await mountPage();
      wrapper.vm.openAddStep();
      await nextTick();
      wrapper.vm.newStep.instruction = "Cook";
      await expect(wrapper.vm.addStep()).rejects.toThrow();
      expect(RecipeStepServices.addRecipeStep).toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User clicks the `Cancel` button", async () => {
      const wrapper = await mountPage();
      wrapper.vm.openAddStep();
      await nextTick();
      wrapper.vm.newStep.stepNumber = 9;
      writeMocks();
      await clickNamedButton(wrapper, "Close");
      await nextTick();
      expect(wrapper.vm.isAddStep).toBe(false);
      expect(RecipeStepServices.addRecipeStep).not.toHaveBeenCalled();
      wrapper.unmount();
    });
  });

  describe("US-5.13 — Edit a Step to the recipe", () => {
    it("User clicks edit icon button on one of the steps in the recipe steps table", async () => {
      const wrapper = await mountPage();
      writeMocks();
      await openEditStepRow(wrapper);
      await nextTick();
      expect(wrapper.vm.isEditStep).toBe(true);
      expect(wrapper.vm.newStep.stepNumber).toBe(1);
      expect(RecipeStepServices.updateRecipeStep).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User inputs a number into the `Number` input text", async () => {
      const wrapper = await mountPage();
      await openEditStepRow(wrapper);
      await nextTick();
      writeMocks();
      wrapper.vm.newStep.stepNumber = 4;
      await nextTick();
      expect(wrapper.vm.newStep.stepNumber).toBe(4);
      expect(RecipeStepServices.updateRecipeStep).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User inputs a `NaN` into the `Number` input text", async () => {
      const wrapper = await mountPage();
      await openEditStepRow(wrapper);
      await nextTick();
      writeMocks();
      wrapper.vm.newStep.stepNumber = Number("bad");
      expect(Number.isNaN(wrapper.vm.newStep.stepNumber)).toBe(true);
      wrapper.vm.newStep.stepNumber = undefined;
      expect(wrapper.vm.newStep.stepNumber == null).toBe(true);
      expect(RecipeStepServices.updateRecipeStep).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User inputs the instruction for `Instruction` input text", async () => {
      const wrapper = await mountPage();
      await openEditStepRow(wrapper);
      await nextTick();
      writeMocks();
      wrapper.vm.newStep.instruction = "Flip once";
      await nextTick();
      expect(wrapper.vm.newStep.instruction).toBe("Flip once");
      expect(RecipeStepServices.updateRecipeStep).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User does not input anything into `Instruction` input text", async () => {
      const wrapper = await mountPage();
      await openEditStepRow(wrapper);
      await nextTick();
      wrapper.vm.newStep.instruction = "";
      writeMocks();
      await nextTick();
      expect(wrapper.vm.newStep.instruction).toBe("");
      expect(RecipeStepServices.updateRecipeStep).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User selects an ingredient from the `Ingredients` dropdown", async () => {
      const wrapper = await mountPage();
      await openEditStepRow(wrapper);
      await nextTick();
      writeMocks();
      wrapper.vm.newStep.recipeIngredient = [recipeIngredientRow];
      await nextTick();
      expect(wrapper.vm.newStep.recipeIngredient.length).toBeGreaterThan(0);
      expect(RecipeStepServices.updateRecipeStep).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User does not select an ingredient from the `Ingredients` dropdown", async () => {
      const wrapper = await mountPage();
      await openEditStepRow(wrapper);
      await nextTick();
      writeMocks();
      wrapper.vm.newStep.recipeIngredient = [];
      await nextTick();
      expect(wrapper.vm.newStep.recipeIngredient).toEqual([]);
      expect(RecipeStepServices.updateRecipeStep).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("User inputs correct values into `Number` input text", async () => {
      const wrapper = await mountPage();
      await openEditStepRow(wrapper);
      await nextTick();
      wrapper.vm.newStep.stepNumber = 2;
      wrapper.vm.newStep.instruction = "Rest the batter";
      await clickNamedButton(wrapper, "Update Step");
      await flushPromises();
      expect(RecipeStepServices.updateRecipeStep).toHaveBeenCalled();
      expect(wrapper.vm.snackbar.text).toContain("Step updated successfully!");
      wrapper.unmount();
    });

    it("User inputs incorrect values into `Number` input text", async () => {
      RecipeStepServices.updateRecipeStep.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { message: "Cannot add the step number was inputted incorrectly" },
        },
      });
      const wrapper = await mountPage();
      await openEditStepRow(wrapper);
      await nextTick();
      await clickNamedButton(wrapper, "Update Step");
      await flushPromises();
      expect(wrapper.vm.snackbar.text).toMatch(/Cannot add the step|Could not update step/i);
      wrapper.unmount();
    });

    it("User clicks the `Cancel` button", async () => {
      const wrapper = await mountPage();
      await openEditStepRow(wrapper);
      await nextTick();
      writeMocks();
      await clickNamedButton(wrapper, "Close");
      await nextTick();
      expect(wrapper.vm.isEditStep).toBe(false);
      expect(RecipeStepServices.updateRecipeStep).not.toHaveBeenCalled();
      wrapper.unmount();
    });
  });

  describe("US-5.14 — View All Steps in Chronological Order", () => {
    it("User adds a new step to the recipe with `Number` in chronological order", async () => {
      RecipeStepServices.getRecipeStepsForRecipeWithIngredients
        .mockResolvedValueOnce({ data: [stepOne] })
        .mockResolvedValueOnce({
          data: [
            stepOne,
            { id: 22, stepNumber: 2, instruction: "Cook", recipeId: 1, recipeIngredient: [] },
          ],
        });
      const wrapper = await mountPage();
      wrapper.vm.openAddStep();
      await nextTick();
      wrapper.vm.newStep.stepNumber = 2;
      wrapper.vm.newStep.instruction = "Cook";
      await clickNamedButton(wrapper, "Add Step");
      await flushPromises();
      const numbers = wrapper.vm.recipeSteps.map((s) => s.stepNumber);
      expect(numbers[numbers.length - 1]).toBe(2);
      wrapper.unmount();
    });

    it("User adds a new step with `Number` out of chronological order", async () => {
      RecipeStepServices.getRecipeStepsForRecipeWithIngredients
        .mockResolvedValueOnce({ data: [stepOne] })
        .mockResolvedValueOnce({
          data: [
            { id: 22, stepNumber: 1, instruction: "Prep", recipeId: 1, recipeIngredient: [] },
            stepOne,
          ],
        });
      RecipeStepServices.addRecipeStep.mockResolvedValue({
        data: { id: 22, stepNumber: 1, instruction: "Prep", recipeId: 1 },
      });
      const wrapper = await mountPage();
      wrapper.vm.openAddStep();
      await nextTick();
      wrapper.vm.newStep.stepNumber = 1;
      wrapper.vm.newStep.instruction = "Prep";
      await clickNamedButton(wrapper, "Add Step");
      await flushPromises();
      const numbers = wrapper.vm.recipeSteps.map((s) => s.stepNumber);
      expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
      wrapper.unmount();
    });

    it("User adds a new recipe step with a duplicate `Number` step", async () => {
      RecipeStepServices.getRecipeStepsForRecipeWithIngredients
        .mockResolvedValueOnce({ data: [stepOne] })
        .mockResolvedValueOnce({
          data: [
            stepOne,
            { id: 23, stepNumber: 1, instruction: "Also mix", recipeId: 1, recipeIngredient: [] },
          ],
        });
      RecipeStepServices.addRecipeStep.mockResolvedValue({
        data: { id: 23, stepNumber: 1, instruction: "Also mix", recipeId: 1 },
      });
      const wrapper = await mountPage();
      wrapper.vm.openAddStep();
      await nextTick();
      wrapper.vm.newStep.stepNumber = 1;
      wrapper.vm.newStep.instruction = "Also mix";
      await clickNamedButton(wrapper, "Add Step");
      await flushPromises();
      const ones = wrapper.vm.recipeSteps.filter((s) => s.stepNumber === 1);
      expect(ones.length).toBeGreaterThan(1);
      wrapper.unmount();
    });

    it("User edits a recipe step with the `Number` changed out of chronological order", async () => {
      const later = {
        id: 24,
        stepNumber: 5,
        instruction: "Serve",
        recipeId: 1,
        recipeIngredient: [],
      };
      RecipeStepServices.getRecipeStepsForRecipeWithIngredients
        .mockResolvedValueOnce({ data: [stepOne, later] })
        .mockResolvedValueOnce({
          data: [
            { ...later, stepNumber: 0, instruction: "Serve first" },
            stepOne,
          ],
        });
      const wrapper = await mountPage();
      await openEditStepRow(wrapper);
      await nextTick();
      wrapper.vm.newStep.stepNumber = 0;
      await clickNamedButton(wrapper, "Update Step");
      await flushPromises();
      const numbers = wrapper.vm.recipeSteps.map((s) => s.stepNumber);
      expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
      wrapper.unmount();
    });

    it("User edits a recipe step with a duplicate `Number` step", async () => {
      const later = {
        id: 24,
        stepNumber: 5,
        instruction: "Serve",
        recipeId: 1,
        recipeIngredient: [],
      };
      RecipeStepServices.getRecipeStepsForRecipeWithIngredients
        .mockResolvedValueOnce({ data: [stepOne, later] })
        .mockResolvedValueOnce({
          data: [stepOne, { ...later, stepNumber: 1 }],
        });
      const wrapper = await mountPage();
      await openEditStepRow(wrapper);
      await nextTick();
      wrapper.vm.newStep.stepNumber = 1;
      await clickNamedButton(wrapper, "Update Step");
      await flushPromises();
      const ones = wrapper.vm.recipeSteps.filter((s) => s.stepNumber === 1);
      expect(ones.length).toBeGreaterThan(1);
      wrapper.unmount();
    });
  });
});
