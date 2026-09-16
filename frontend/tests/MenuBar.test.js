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
import MenuBar from "../src/components/MenuBar.vue";
import UserServices from "../src/services/UserServices.js";

vi.mock("../src/services/UserServices.js", () => ({
  default: {
    logoutUser: vi.fn(() =>
      Promise.resolve({ data: { message: "Logged out successfully." } })
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
      { path: "/", name: "login", component: { template: "<div>Login</div>" } },
      { path: "/recipes", name: "recipes", component: { template: "<div>Recipes</div>" } },
      {
        path: "/ingredients",
        name: "ingredients",
        component: { template: "<div>Ingredients</div>" },
      },
    ],
  });
}

describe("Feature 2 — Sign In & Sign Out", () => {
  let vuetify;

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("user", JSON.stringify(sessionUser));
    vuetify = createVuetify({ components, directives });
    UserServices.logoutUser.mockClear();
  });

  describe("US-2.2 — Stay signed in across page loads", () => {
    it("Changing pages", async () => {
      // TS-F2-AC004
      const router = makeRouter();
      await router.push("/ingredients");
      await router.isReady();

      const wrapper = mount(
        {
          template: "<v-app><MenuBar /></v-app>",
          components: { MenuBar },
        },
        {
          global: {
            plugins: [vuetify, router],
          },
        }
      );
      await flushPromises();

      const recipesBtn = wrapper
        .findAllComponents({ name: "VBtn" })
        .find((btn) => btn.text().trim() === "Recipes");
      expect(recipesBtn).toBeTruthy();
      expect(recipesBtn.props("to")).toEqual({ name: "recipes" });
      await router.push(recipesBtn.props("to"));
      await flushPromises();

      expect(router.currentRoute.value.name).toBe("recipes");
      expect(localStorage.getItem("user")).toBe(JSON.stringify(sessionUser));
    });
  });

  describe("US-2.3 — Sign out", () => {
    it("Logging out", async () => {
      // TS-F2-AC006
      const router = makeRouter();
      await router.push("/recipes");
      await router.isReady();

      const wrapper = mount(
        {
          template: "<v-app><MenuBar /></v-app>",
          components: { MenuBar },
        },
        {
          global: {
            plugins: [vuetify, router],
            stubs: {
              VMenu: {
                template:
                  '<div class="menu-stub"><slot name="activator" :props="{}" /><div class="menu-content"><slot /></div></div>',
              },
            },
          },
        }
      );
      await flushPromises();

      const logoutBtn = wrapper.findAll("button").find((node) => node.text() === "Logout");
      expect(logoutBtn).toBeTruthy();
      await logoutBtn.trigger("click");
      await flushPromises();

      expect(UserServices.logoutUser).toHaveBeenCalled();
      expect(localStorage.getItem("user")).toBeNull();
      expect(router.currentRoute.value.name).toBe("login");
    });
  });
});
