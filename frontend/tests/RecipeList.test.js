/**
 * Feature 4 — Create, Read, and Delete Recipes
 * Spec: features/feature-4-CR-recipes.md
 */

import { mount, flushPromises } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, it, expect, beforeEach, vi } from "vitest";
import RecipeList from "../src/views/RecipeList.vue";
import RecipeServices from "../src/services/RecipeServices.js";
import RecipeIngredientServices from "../src/services/RecipeIngredientServices.js";
import RecipeStepServices from "../src/services/RecipeStepServices.js";
import { mountOptions } from "./mount.js";

vi.mock("../src/services/RecipeServices.js", () => ({
  default: {
    getRecipes: vi.fn(),
    getRecipesByUserId: vi.fn(),
    addRecipe: vi.fn(),
    deleteRecipe: vi.fn(),
  },
}));

vi.mock("../src/services/RecipeIngredientServices.js", () => ({
  default: {
    getRecipeIngredientsForRecipe: vi.fn(),
  },
}));

vi.mock("../src/services/RecipeStepServices.js", () => ({
  default: {
    getRecipeStepsForRecipeWithIngredients: vi.fn(),
  },
}));

vi.mock("../src/reports/RecipeReports.js", () => ({
  default: {
    generateRecipePDF: vi.fn(() => Promise.resolve()),
  },
}));

const owner = { id: 1, token: "owner-token" };

const ownedRecipes = [
  {
    id: 11,
    name: "Owner Published",
    description: "Mine public",
    servings: 2,
    time: 30,
    isPublished: true,
    userId: 1,
  },
  {
    id: 12,
    name: "Owner Draft",
    description: "Mine private",
    servings: 4,
    time: 45,
    isPublished: false,
    userId: 1,
  },
];

const publishedCatalog = [
  {
    id: 11,
    name: "Owner Published",
    description: "Mine public",
    servings: 2,
    time: 30,
    isPublished: true,
    userId: 1,
  },
  {
    id: 21,
    name: "Other Published",
    description: "Theirs public",
    servings: 3,
    time: 20,
    isPublished: true,
    userId: 2,
  },
];

function mockEmptyDetails() {
  RecipeIngredientServices.getRecipeIngredientsForRecipe.mockResolvedValue({
    data: [],
  });
  RecipeStepServices.getRecipeStepsForRecipeWithIngredients.mockResolvedValue({
    data: [],
  });
}

async function mountList() {
  const { options } = await mountOptions();
  const wrapper = mount(RecipeList, options);
  await flushPromises();
  await nextTick();
  return wrapper;
}

function addButton(wrapper) {
  return wrapper
    .findAll("button")
    .find((button) => /^Add$/.test(button.text().trim()));
}

describe("Feature 4 — Create, Read, and Delete Recipes", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    mockEmptyDetails();
    RecipeServices.getRecipes.mockResolvedValue({ data: publishedCatalog });
    RecipeServices.getRecipesByUserId.mockResolvedValue({ data: ownedRecipes });
    RecipeServices.addRecipe.mockResolvedValue({ data: { id: 99 } });
    RecipeServices.deleteRecipe.mockResolvedValue({
      data: { message: "Recipe was deleted successfully!" },
    });
  });

  describe("US-4.1 — Add Recipe", () => {
    beforeEach(() => {
      localStorage.setItem("user", JSON.stringify(owner));
    });

    it("open add modal", async () => {
      const wrapper = await mountList();
      expect(addButton(wrapper)).toBeTruthy();

      await addButton(wrapper).trigger("click");
      await nextTick();

      expect(wrapper.text()).toContain("Add Recipe");
      expect(wrapper.html()).toContain("Name");
      expect(wrapper.html()).toContain("Number of Servings");
      expect(wrapper.html()).toContain("Time to Make (in minutes)");
      expect(wrapper.html()).toContain("Description");
      expect(wrapper.text()).toContain("Publish?");
      expect(wrapper.text()).toContain("No");
      expect(wrapper.text()).toMatch(/CLOSE/i);
      expect(wrapper.text()).toMatch(/ADD RECIPE/i);

      const numberInputs = wrapper
        .findAll("input")
        .filter((input) => input.attributes("type") === "number");
      expect(numberInputs[0].element.value).toBe("2");
      expect(numberInputs[1].element.value).toBe("30");
      wrapper.unmount();
    });

    it("Serving/Time input field details", async () => {
      const wrapper = await mountList();
      await addButton(wrapper).trigger("click");
      await nextTick();

      const numberInputs = wrapper
        .findAll("input")
        .filter((input) => input.attributes("type") === "number");
      expect(numberInputs.length).toBeGreaterThanOrEqual(2);

      await numberInputs[0].setValue(5);
      await numberInputs[1].setValue(12);
      await nextTick();

      expect(numberInputs[0].element.value).toBe("5");
      expect(numberInputs[1].element.value).toBe("12");
      wrapper.unmount();
    });

    it("Publish toggle", async () => {
      const wrapper = await mountList();
      await addButton(wrapper).trigger("click");
      await nextTick();

      const switchInput = wrapper.find(".v-switch input");
      expect(switchInput.exists()).toBe(true);
      expect(wrapper.text()).toContain("Publish? No");

      await switchInput.setValue(true);
      await nextTick();
      expect(wrapper.text()).toContain("Publish? Yes");

      await switchInput.setValue(false);
      await nextTick();
      expect(wrapper.text()).toContain("Publish? No");
      wrapper.unmount();
    });

    it("Close button cancels operation", async () => {
      const wrapper = await mountList();
      await addButton(wrapper).trigger("click");
      await nextTick();

      const nameInput = wrapper
        .findAll("input")
        .find((input) => input.attributes("type") !== "number");
      await nameInput.setValue("Should not save");

      const close = wrapper
        .findAll("button")
        .find((button) => /CLOSE/i.test(button.text()));
      await close.trigger("click");
      await nextTick();

      expect(RecipeServices.addRecipe).not.toHaveBeenCalled();
      expect(wrapper.text()).not.toMatch(/ADD RECIPE/);

      await addButton(wrapper).trigger("click");
      await nextTick();
      const nameAgain = wrapper
        .findAll("input")
        .find((input) => input.attributes("type") !== "number");
      expect(nameAgain.element.value).toBe("");
      wrapper.unmount();
    });

    it("Field validation", async () => {
      const wrapper = await mountList();
      await addButton(wrapper).trigger("click");
      await nextTick();

      const nameInput = wrapper
        .findAll("input")
        .find((input) => input.attributes("type") !== "number");
      await nameInput.setValue("Incomplete recipe");
      const numberInputs = wrapper
        .findAll("input")
        .filter((input) => input.attributes("type") === "number");
      await numberInputs[0].setValue("");
      await nextTick();

      const confirm = wrapper
        .findAll("button")
        .find((button) => /ADD RECIPE/i.test(button.text()));
      await confirm.trigger("click");
      await flushPromises();
      await nextTick();

      expect(RecipeServices.addRecipe).not.toHaveBeenCalled();
      expect(wrapper.text()).not.toMatch(/ADD RECIPE/);

      await addButton(wrapper).trigger("click");
      await nextTick();
      const nameAgain = wrapper
        .findAll("input")
        .find((input) => input.attributes("type") !== "number");
      expect(nameAgain.element.value).toBe("");
      wrapper.unmount();
    });

    it("Add button confirms operation", async () => {
      const wrapper = await mountList();
      await addButton(wrapper).trigger("click");
      await nextTick();

      const textInput = wrapper
        .findAll("input")
        .find((input) => input.attributes("type") !== "number");
      await textInput.setValue("Dave's Hot Chicken");
      const numberInputs = wrapper
        .findAll("input")
        .filter((input) => input.attributes("type") === "number");
      await numberInputs[0].setValue(2);
      await numberInputs[1].setValue(30);
      await wrapper.find("textarea").setValue("Spicy fried chicken");

      const confirm = wrapper
        .findAll("button")
        .find((button) => /ADD RECIPE/i.test(button.text()));
      await confirm.trigger("click");
      await flushPromises();

      expect(RecipeServices.addRecipe).toHaveBeenCalledTimes(1);
      const sent = RecipeServices.addRecipe.mock.calls[0][0];
      expect(sent.name).toBe("Dave's Hot Chicken");
      expect(sent.servings).toBe(2);
      expect(Number(sent.time)).toBe(30);
      expect(sent.description).toBe("Spicy fried chicken");
      expect(sent.userId).toBe(owner.id);
      expect(RecipeServices.getRecipesByUserId).toHaveBeenCalled();
      wrapper.unmount();
    });

    it("Enforce modal focus", async () => {
      const wrapper = await mountList();
      await addButton(wrapper).trigger("click");
      await nextTick();

      await wrapper.get(".text-h4").trigger("click");
      await nextTick();
      expect(wrapper.text()).toContain("Add Recipe");
      expect(wrapper.text()).toMatch(/CLOSE/i);
      wrapper.unmount();
    });
  });

  describe("US-4.2 — View Recipes", () => {
    it("See list (signed in)", async () => {
      localStorage.setItem("user", JSON.stringify(owner));
      const wrapper = await mountList();

      expect(RecipeServices.getRecipesByUserId).toHaveBeenCalledWith(owner.id);
      expect(RecipeServices.getRecipes).not.toHaveBeenCalled();
      expect(wrapper.text()).toContain("Owner Published");
      expect(wrapper.text()).toContain("Owner Draft");
      expect(wrapper.text()).not.toContain("Other Published");
      wrapper.unmount();
    });

    it("See list (signed out)", async () => {
      const wrapper = await mountList();

      expect(RecipeServices.getRecipes).toHaveBeenCalled();
      expect(RecipeServices.getRecipesByUserId).not.toHaveBeenCalled();
      expect(wrapper.text()).toContain("Owner Published");
      expect(wrapper.text()).toContain("Other Published");
      expect(wrapper.text()).not.toContain("Owner Draft");
      expect(addButton(wrapper)).toBeFalsy();
      wrapper.unmount();
    });
  });

  describe("US-4.6 — Delete Recipe", () => {
    beforeEach(() => {
      localStorage.setItem("user", JSON.stringify(owner));
    });

    it("user (signed-in) selects delete icon", async () => {
      const wrapper = await mountList();
      const draftCard = wrapper
        .findAll(".v-card")
        .find((card) => card.text().includes("Owner Draft"));
      expect(draftCard).toBeTruthy();

      const icon = draftCard.find('[icon="mdi-delete"]');
      expect(icon.exists()).toBe(true);
      await icon.trigger("click");
      await nextTick();

      expect(wrapper.text()).toMatch(/confirm delete/i);
      expect(wrapper.text()).not.toMatch(/this recipe is currently published/i);
      expect(wrapper.text()).toMatch(/CANCEL/i);
      expect(
        wrapper
          .findAll("button")
          .some((button) => /^DELETE$/i.test(button.text().trim()))
      ).toBe(true);
      expect(RecipeServices.deleteRecipe).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("user selects delete on published recipe", async () => {
      const wrapper = await mountList();
      const publishedCard = wrapper
        .findAll(".v-card")
        .find((card) => card.text().includes("Owner Published"));
      expect(publishedCard).toBeTruthy();

      const icon = publishedCard.find('[icon="mdi-delete"]');
      expect(icon.exists()).toBe(true);
      await icon.trigger("click");
      await nextTick();

      expect(wrapper.text()).toMatch(/this recipe is currently published/i);
      expect(wrapper.text()).toMatch(/CANCEL/i);
      expect(
        wrapper
          .findAll("button")
          .some((button) => /^DELETE$/i.test(button.text().trim()))
      ).toBe(true);
      expect(RecipeServices.deleteRecipe).not.toHaveBeenCalled();
      wrapper.unmount();
    });

    it("user (signed-in) confirm delete action", async () => {
      const wrapper = await mountList();
      const icon = wrapper.find('[icon="mdi-delete"]');
      expect(icon.exists()).toBe(true);
      await icon.trigger("click");
      await nextTick();

      const confirm = wrapper
        .findAll("button")
        .find((button) => /^DELETE$/i.test(button.text().trim()));
      expect(confirm).toBeTruthy();
      await confirm.trigger("click");
      await flushPromises();

      expect(RecipeServices.deleteRecipe).toHaveBeenCalledWith(11);
      expect(
        wrapper
          .findAll("button")
          .some((button) => /^DELETE$/i.test(button.text().trim()))
      ).toBe(false);
      wrapper.unmount();
    });

    it("user (signed-in) cancels deletion action", async () => {
      const wrapper = await mountList();
      const icon = wrapper.find('[icon="mdi-delete"]');
      expect(icon.exists()).toBe(true);
      await icon.trigger("click");
      await nextTick();

      const cancel = wrapper
        .findAll("button")
        .find((button) => /CANCEL/i.test(button.text()));
      expect(cancel).toBeTruthy();
      await cancel.trigger("click");
      await flushPromises();
      await nextTick();

      expect(RecipeServices.deleteRecipe).not.toHaveBeenCalled();
      expect(
        wrapper
          .findAll("button")
          .some((button) => /CANCEL/i.test(button.text()))
      ).toBe(false);
      wrapper.unmount();
    });
  });
});
