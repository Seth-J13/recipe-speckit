import { flushPromises, mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import MenuBar from "../src/components/MenuBar.vue";
import AppNotification from "../src/components/AppNotification.vue";

export const signedInUser = {
  id: 1,
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  token: "test-token",
};

export const vuetifyStubs = {
  VAppBar: { template: '<div class="v-app-bar-stub"><slot /></div>' },
  VDialog: {
    props: ["modelValue"],
    template: '<div v-if="modelValue" class="v-dialog-stub"><slot /></div>',
  },
  VMenu: {
    template: `
      <div class="v-menu-stub">
        <slot name="activator" :props="{}" />
        <div class="v-menu-content"><slot /></div>
      </div>
    `,
  },
};

export function createTestVuetify() {
  return createVuetify({ components, directives });
}

export function createTestRouter(startPath = "/recipes") {
  const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: "/",
        name: "login",
        meta: { title: "Login" },
        component: { template: "<div>Login page</div>" },
      },
      {
        path: "/recipes",
        name: "recipes",
        meta: { title: "Recipes" },
        component: { template: "<div>Recipes page</div>" },
      },
      {
        path: "/ingredients",
        name: "ingredients",
        meta: { title: "Ingredients" },
        component: { template: "<div>Ingredients page</div>" },
      },
      {
        path: "/recipe/:id",
        name: "editRecipe",
        meta: { title: "Edit Recipe" },
        props: true,
        component: { template: "<div>Edit Recipe page</div>" },
      },
    ],
  });
  router.push(startPath);
  return router;
}

export async function mountShell(options = {}) {
  const { startPath = "/recipes", user = signedInUser } = options;
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
  const router = createTestRouter(startPath);
  await router.isReady();
  const wrapper = mount(
    {
      components: { MenuBar, AppNotification },
      template: `
        <v-app>
          <MenuBar />
          <v-main>
            <router-view />
          </v-main>
          <AppNotification />
        </v-app>
      `,
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

export function findByText(wrapper, text) {
  return wrapper
    .findAll("a, button, .v-btn")
    .find((node) => node.text().replace(/\s+/g, " ").trim() === text);
}

export function apiError(message) {
  return { response: { data: { message } } };
}
