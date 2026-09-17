/**
 * Feature 4 — Create, Read, and Delete Recipes
 * Spec: features/feature-4-CR-recipes.md
 */

import { mount, flushPromises } from "@vue/test-utils";
import { nextTick } from "vue";
import { describe, it, expect, beforeEach, vi } from "vitest";
import RecipeCard from "../src/components/RecipeCardComponent.vue";
import RecipeIngredientServices from "../src/services/RecipeIngredientServices.js";
import RecipeStepServices from "../src/services/RecipeStepServices.js";
import RecipeReports from "../src/reports/RecipeReports.js";
import { mountOptions } from "./mount.js";

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

const recipe = {
  id: 7,
  name: "Dave's Hot Chicken",
  description: "Spicy fried chicken",
  servings: 4,
  time: 45,
  isPublished: true,
  userId: 1,
};

const ingredients = [
  {
    id: 1,
    quantity: 2,
    ingredient: { name: "flour", unit: "cup", pricePerUnit: "1.50" },
  },
  {
    id: 2,
    quantity: 1,
    ingredient: { name: "salt", unit: "tsp", pricePerUnit: "0.10" },
  },
];

const steps = [
  {
    id: 10,
    stepNumber: 1,
    instruction: "Mix dry ingredients",
    recipeIngredient: [{ id: 2, ingredient: { name: "flour" } }],
  },
];

async function mountCard(user = { id: 1, token: "t" }) {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
  const { options, router } = await mountOptions({ props: { recipe } });
  const wrapper = mount(RecipeCard, options);
  await flushPromises();
  await nextTick();
  return { wrapper, router };
}

function iconByName(wrapper, icon) {
  const byAttr = wrapper.find(`[icon="${icon}"]`);
  if (byAttr.exists()) return byAttr;
  return wrapper.find(`.${icon}`);
}

describe("Feature 4 — Create, Read, and Delete Recipes", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    RecipeIngredientServices.getRecipeIngredientsForRecipe.mockResolvedValue({
      data: ingredients,
    });
    RecipeStepServices.getRecipeStepsForRecipeWithIngredients.mockResolvedValue(
      { data: steps }
    );
  });

  describe("US-4.3 — See Recipe Details", () => {
    it("Always-present recipe details", async () => {
      const signedIn = await mountCard();
      expect(signedIn.wrapper.text()).toContain("Dave's Hot Chicken");
      expect(signedIn.wrapper.text()).toContain("4 Servings");
      expect(signedIn.wrapper.text()).toContain("45 minutes");
      signedIn.wrapper.unmount();

      const signedOut = await mountCard(null);
      expect(signedOut.wrapper.text()).toContain("Dave's Hot Chicken");
      expect(signedOut.wrapper.text()).toContain("4 Servings");
      expect(signedOut.wrapper.text()).toContain("45 minutes");
      signedOut.wrapper.unmount();
    });

    it("Expanded recipe card", async () => {
      const { wrapper } = await mountCard();
      await wrapper.get(".v-card").trigger("click");
      await nextTick();

      const text = wrapper.text();
      expect(text).toContain("Ingredients");
      expect(text).toContain("Recipe Steps");
      expect(text.indexOf("Ingredients")).toBeLessThan(
        text.indexOf("Recipe Steps")
      );
      expect(text).toContain("2");
      expect(text).toContain("cups");
      expect(text).toContain("of flour");
      expect(text).toContain("$1.50/cup");
      expect(text).toContain("1");
      expect(text).toContain("tsp");
      expect(text).toContain("of salt");
      expect(wrapper.text()).toContain("Step");
      expect(wrapper.text()).toContain("Instruction");
      expect(wrapper.text()).toContain("Mix dry ingredients");

      wrapper.unmount();

      RecipeStepServices.getRecipeStepsForRecipeWithIngredients.mockResolvedValue(
        { data: [] }
      );
      const empty = await mountCard();
      await empty.wrapper.get(".v-card").trigger("click");
      await nextTick();
      expect(empty.wrapper.text()).toContain("Step");
      expect(empty.wrapper.text()).toContain("Instruction");
      expect(empty.wrapper.text()).toContain("Ingredients");
      empty.wrapper.unmount();
    });

    it("Shrink recipe card", async () => {
      const { wrapper } = await mountCard();
      const card = wrapper.get(".v-card");
      await card.trigger("click");
      await nextTick();
      expect(wrapper.text()).toContain("Mix dry ingredients");

      await card.trigger("click");
      await nextTick();
      expect(wrapper.find(".v-table").isVisible()).toBe(false);
      expect(wrapper.text()).toContain("Dave's Hot Chicken");
      expect(wrapper.text()).toContain("4 Servings");
      expect(wrapper.text()).toContain("45 minutes");
      wrapper.unmount();
    });
  });

  describe("US-4.4 — Manage Recipe List", () => {
    it("Actions on Recipe Card (signed-in)", async () => {
      const { wrapper } = await mountCard({ id: 1, token: "t" });
      expect(iconByName(wrapper, "mdi-file-pdf-box").exists()).toBe(true);
      expect(iconByName(wrapper, "mdi-pencil").exists()).toBe(true);
      expect(iconByName(wrapper, "mdi-delete").exists()).toBe(true);

      await wrapper.get(".v-card").trigger("click");
      await nextTick();
      expect(iconByName(wrapper, "mdi-file-pdf-box").exists()).toBe(true);
      expect(iconByName(wrapper, "mdi-pencil").exists()).toBe(true);
      expect(iconByName(wrapper, "mdi-delete").exists()).toBe(true);
      wrapper.unmount();
    });

    it("Select edit icon", async () => {
      const { wrapper, router } = await mountCard({ id: 1, token: "t" });
      await iconByName(wrapper, "mdi-pencil").trigger("click");
      await flushPromises();
      expect(router.currentRoute.value.name).toBe("editRecipe");
      expect(router.currentRoute.value.params.id).toBe("7");
      wrapper.unmount();
    });

    it("Actions on Recipe Card (signed-out)", async () => {
      const { wrapper } = await mountCard(null);
      expect(iconByName(wrapper, "mdi-file-pdf-box").exists()).toBe(true);
      expect(iconByName(wrapper, "mdi-pencil").exists()).toBe(false);
      expect(iconByName(wrapper, "mdi-delete").exists()).toBe(false);

      await wrapper.get(".v-card").trigger("click");
      await nextTick();
      expect(iconByName(wrapper, "mdi-file-pdf-box").exists()).toBe(true);
      expect(iconByName(wrapper, "mdi-pencil").exists()).toBe(false);
      expect(iconByName(wrapper, "mdi-delete").exists()).toBe(false);
      wrapper.unmount();
    });
  });

  describe("US-4.5 — Export Option", () => {
    async function exportFromCard(user) {
      const { wrapper } = await mountCard(user);
      const icon = iconByName(wrapper, "mdi-file-pdf-box");
      expect(icon.exists()).toBe(true);
      await icon.trigger("click");
      await flushPromises();
      return wrapper;
    }

    it("export-to-pdf icon selected", async () => {
      const signedIn = await exportFromCard({ id: 1, token: "t" });
      expect(RecipeReports.generateRecipePDF).toHaveBeenCalledWith(recipe);
      expect(iconByName(signedIn, "mdi-file-pdf-box").exists()).toBe(true);
      signedIn.unmount();

      RecipeReports.generateRecipePDF.mockClear();

      const signedOut = await exportFromCard(null);
      expect(RecipeReports.generateRecipePDF).toHaveBeenCalledWith(recipe);
      expect(iconByName(signedOut, "mdi-file-pdf-box").exists()).toBe(true);
      signedOut.unmount();
    });

    it("cancel operation", async () => {
      const signedIn = await exportFromCard({ id: 1, token: "t" });
      expect(iconByName(signedIn, "mdi-file-pdf-box").exists()).toBe(true);
      expect(signedIn.text()).toContain("Dave's Hot Chicken");
      signedIn.unmount();

      const signedOut = await exportFromCard(null);
      expect(iconByName(signedOut, "mdi-file-pdf-box").exists()).toBe(true);
      expect(signedOut.text()).toContain("Dave's Hot Chicken");
      signedOut.unmount();
    });
  });
});
