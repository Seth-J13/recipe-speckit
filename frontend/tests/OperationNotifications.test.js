/**
 * Feature 1 — Menu Bar & User Navigation
 * Spec: features/1-menu-bar.md
 */
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
import RecipeList from "../src/views/RecipeList.vue";
import IngredientList from "../src/views/IngredientList.vue";
import EditRecipe from "../src/views/EditRecipe.vue";
import AppNotification from "../src/components/AppNotification.vue";
import UserServices from "../src/services/UserServices";
import RecipeServices from "../src/services/RecipeServices";
import IngredientServices from "../src/services/IngredientServices";
import RecipeIngredientServices from "../src/services/RecipeIngredientServices";
import RecipeStepServices from "../src/services/RecipeStepServices";
import { useNotification } from "../src/composables/useNotification";
import {
  apiError,
  createTestVuetify,
  findByText,
  mountShell,
  signedInUser,
  vuetifyStubs,
} from "./helpers";

vi.mock("../src/services/UserServices", () => ({
  default: {
    loginUser: vi.fn(),
    addUser: vi.fn(),
    logoutUser: vi.fn(),
    getUser: vi.fn(),
  },
}));

vi.mock("../src/services/RecipeServices.js", () => ({
  default: {
    getRecipes: vi.fn(() => Promise.resolve({ data: [] })),
    getRecipesByUserId: vi.fn(() => Promise.resolve({ data: [] })),
    addRecipe: vi.fn(),
    getRecipe: vi.fn(() =>
      Promise.resolve({ data: [{ id: 1, name: "Soup", servings: 2, time: 10 }] })
    ),
    updateRecipe: vi.fn(),
  },
}));

vi.mock("../src/services/IngredientServices.js", () => ({
  default: {
    getIngredients: vi.fn(() =>
      Promise.resolve({
        data: [{ id: 1, name: "Flour", unit: "cup", pricePerUnit: 1 }],
      })
    ),
    addIngredient: vi.fn(),
    updateIngredient: vi.fn(),
  },
}));

vi.mock("../src/services/RecipeIngredientServices.js", () => ({
  default: {
    getRecipeIngredientsForRecipe: vi.fn(() =>
      Promise.resolve({
        data: [
          {
            id: 9,
            quantity: 1,
            ingredientId: 1,
            ingredient: { name: "Salt", unit: "teaspoon", pricePerUnit: 1 },
          },
        ],
      })
    ),
    addRecipeIngredient: vi.fn(),
    updateRecipeIngredient: vi.fn(),
    deleteRecipeIngredient: vi.fn(),
  },
}));

vi.mock("../src/services/RecipeStepServices.js", () => ({
  default: {
    getRecipeStepsForRecipeWithIngredients: vi.fn(() =>
      Promise.resolve({ data: [] })
    ),
    addRecipeStep: vi.fn(),
    updateRecipeStep: vi.fn(),
    deleteRecipeStep: vi.fn(),
  },
}));

vi.mock("../src/components/RecipeCardComponent.vue", () => ({
  default: { template: "<div />" },
}));

function notifications() {
  return useNotification().notifications.value;
}

async function mountView(component, path) {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: "/", redirect: { name: "recipes" } },
      {
        path: "/recipes",
        name: "recipes",
        meta: { title: "Recipes" },
        component: RecipeList,
      },
      {
        path: "/ingredients",
        name: "ingredients",
        meta: { title: "Ingredients" },
        component: IngredientList,
      },
      {
        path: "/recipe/:id",
        name: "editRecipe",
        meta: { title: "Edit Recipe" },
        props: true,
        component: EditRecipe,
      },
    ],
  });
  await router.push(path);
  await router.isReady();
  const wrapper = mount(
    {
      components: { View: component, AppNotification },
      template: `<v-app><View /><AppNotification /></v-app>`,
    },
    {
      global: {
        plugins: [createTestVuetify(), router],
        stubs: vuetifyStubs,
      },
    }
  );
  await flushPromises();
  return { wrapper, router };
}

describe("Feature 1 — Menu Bar & User Navigation", () => {
  let wrapper;

  beforeEach(() => {
    document.body.innerHTML = "";
    localStorage.clear();
    useNotification().resetNotifications();
    UserServices.logoutUser.mockReset();
    RecipeServices.addRecipe.mockReset();
    IngredientServices.updateIngredient.mockReset();
    RecipeIngredientServices.deleteRecipeIngredient.mockReset();
  });

  afterEach(() => {
    wrapper?.unmount();
    document.body.innerHTML = "";
  });

  describe("US-1.6 — Get Notified for Create, Update, Delete, and Logout", () => {
    it("Successful Create shows a notification", async () => {
      localStorage.setItem("user", JSON.stringify(signedInUser));
      RecipeServices.addRecipe.mockResolvedValue({});
      ({ wrapper } = await mountView(RecipeList, "/recipes"));
      await findByText(wrapper, "Add").trigger("click");
      await flushPromises();
      await findByText(wrapper, "Add Recipe").trigger("click");
      await flushPromises();
      expect(notifications().length).toBeGreaterThan(0);
      expect(wrapper.find("[data-color]").exists()).toBe(true);
    });

    it("Unsuccessful Create shows a notification", async () => {
      localStorage.setItem("user", JSON.stringify(signedInUser));
      RecipeServices.addRecipe.mockRejectedValue(apiError("Create failed."));
      ({ wrapper } = await mountView(RecipeList, "/recipes"));
      await findByText(wrapper, "Add").trigger("click");
      await flushPromises();
      await findByText(wrapper, "Add Recipe").trigger("click");
      await flushPromises();
      expect(notifications().length).toBeGreaterThan(0);
      expect(wrapper.find("[data-color]").exists()).toBe(true);
    });

    it("Successful Update shows a notification", async () => {
      localStorage.setItem("user", JSON.stringify(signedInUser));
      IngredientServices.updateIngredient.mockResolvedValue({});
      ({ wrapper } = await mountView(IngredientList, "/ingredients"));
      await wrapper.get(".mdi-pencil").trigger("click");
      await flushPromises();
      await findByText(wrapper, "Update Ingredient").trigger("click");
      await flushPromises();
      expect(notifications().length).toBeGreaterThan(0);
      expect(wrapper.find("[data-color]").exists()).toBe(true);
    });

    it("Unsuccessful Update shows a notification", async () => {
      localStorage.setItem("user", JSON.stringify(signedInUser));
      IngredientServices.updateIngredient.mockRejectedValue(
        apiError("Update failed.")
      );
      ({ wrapper } = await mountView(IngredientList, "/ingredients"));
      await wrapper.get(".mdi-pencil").trigger("click");
      await flushPromises();
      await findByText(wrapper, "Update Ingredient").trigger("click");
      await flushPromises();
      expect(notifications().length).toBeGreaterThan(0);
      expect(wrapper.find("[data-color]").exists()).toBe(true);
    });

    it("Successful Delete shows a notification", async () => {
      localStorage.setItem("user", JSON.stringify(signedInUser));
      RecipeIngredientServices.deleteRecipeIngredient.mockResolvedValue({});
      ({ wrapper } = await mountView(EditRecipe, "/recipe/1"));
      await wrapper.get(".mdi-trash-can").trigger("click");
      await flushPromises();
      expect(notifications().length).toBeGreaterThan(0);
      expect(wrapper.find("[data-color]").exists()).toBe(true);
    });

    it("Unsuccessful Delete shows a notification", async () => {
      localStorage.setItem("user", JSON.stringify(signedInUser));
      RecipeIngredientServices.deleteRecipeIngredient.mockRejectedValue(
        apiError("Delete failed.")
      );
      ({ wrapper } = await mountView(EditRecipe, "/recipe/1"));
      await wrapper.get(".mdi-trash-can").trigger("click");
      await flushPromises();
      expect(notifications().length).toBeGreaterThan(0);
      expect(wrapper.find("[data-color]").exists()).toBe(true);
    });

    it("Successful Logout shows a notification", async () => {
      UserServices.logoutUser.mockResolvedValue({
        data: { message: "Logged out successfully." },
      });
      ({ wrapper } = await mountShell({ startPath: "/recipes" }));
      await wrapper.get('[aria-label="JD"]').trigger("click");
      await flushPromises();
      await findByText(wrapper, "Logout").trigger("click");
      await flushPromises();
      expect(notifications().length).toBeGreaterThan(0);
    });

    it("Unsuccessful Logout shows a notification", async () => {
      UserServices.logoutUser.mockRejectedValue(apiError("Logout failed."));
      ({ wrapper } = await mountShell({ startPath: "/recipes" }));
      await wrapper.get('[aria-label="JD"]').trigger("click");
      await flushPromises();
      await findByText(wrapper, "Logout").trigger("click");
      await flushPromises();
      expect(notifications().length).toBeGreaterThan(0);
      expect(wrapper.find("[data-color]").exists()).toBe(true);
    });
  });
});
