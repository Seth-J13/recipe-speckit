/**
 * Feature 2 — Sign In & Sign Out
 * Spec: features/feature-2-sign-in-sign-out.md
 */
import { flushPromises, mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { vi } from "vitest";
import Login from "../src/views/Login.vue";
import UserServices from "../src/services/UserServices.js";

vi.mock("../src/services/UserServices.js", () => ({
  default: {
    loginUser: vi.fn(),
    addUser: vi.fn(() =>
      Promise.resolve({
        data: {
          id: 2,
          email: "new@example.com",
          firstName: "Ada",
          lastName: "Lovelace",
          token: "new-token",
        },
      })
    ),
  },
}));

const sessionUser = {
  id: 1,
  email: "DDevito@example.com",
  firstName: "Danny",
  lastName: "Devito",
  token: "test-token",
};

function makeRouter() {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: "/", name: "login", component: Login },
      { path: "/recipes", name: "recipes", component: { template: "<div>Recipes</div>" } },
    ],
  });
}

describe("Feature 2 — Sign In & Sign Out", () => {
  let vuetify;

  beforeEach(() => {
    localStorage.clear();
    vuetify = createVuetify({ components, directives });
    UserServices.addUser.mockClear();
  });

  describe("US-2.2 — Stay signed in across page loads", () => {
    it("Refresh pages", async () => {
      // TS-F2-AC005
      localStorage.setItem("user", JSON.stringify(sessionUser));
      const router = makeRouter();
      await router.push("/");
      await router.isReady();

      mount(Login, {
        global: {
          plugins: [vuetify, router],
        },
      });
      await flushPromises();

      expect(localStorage.getItem("user")).toBe(JSON.stringify(sessionUser));
    });
  });

  describe("US-2.4 — Create account", () => {
    it("Creating new account", async () => {
      // TS-F2-AC007
      const router = makeRouter();
      await router.push("/");
      await router.isReady();

      const wrapper = mount(Login, {
        global: {
          plugins: [vuetify, router],
          stubs: {
            VDialog: {
              props: ["modelValue"],
              template: "<div class='create-account-dialog'><slot /></div>",
            },
          },
        },
      });
      await flushPromises();

      const fields = wrapper.findAllComponents({ name: "VTextField" });
      await fields[2].setValue("Ada");
      await fields[3].setValue("Lovelace");
      await fields[4].setValue("new@example.com");
      await fields[5].setValue("secret");

      const pushToRecipes = vi.spyOn(router, "push");

      const createButtons = wrapper
        .findAll("button")
        .filter((node) => node.text().includes("Create Account"));
      await createButtons[createButtons.length - 1].trigger("click");
      await flushPromises();

      expect(UserServices.addUser).toHaveBeenCalled();
      expect(JSON.parse(localStorage.getItem("user")).email).toBe("new@example.com");
      expect(pushToRecipes).toHaveBeenCalledWith({ name: "recipes" });
    });
  });
});
