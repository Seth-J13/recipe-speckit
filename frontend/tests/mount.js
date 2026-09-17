import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { createMemoryHistory, createRouter } from "vue-router";

export function createTestVuetify() {
  return createVuetify({ components, directives });
}

export function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", name: "login", component: { template: "<div />" } },
      { path: "/recipes", name: "recipes", component: { template: "<div />" } },
      {
        path: "/recipe/:id",
        name: "editRecipe",
        component: { template: "<div />" },
      },
    ],
  });
}

export async function mountOptions(extra = {}) {
  const vuetify = createTestVuetify();
  const router = extra.router || createTestRouter();
  await router.push(extra.route || "/recipes");
  await router.isReady();
  return {
    router,
    options: {
      props: extra.props,
      global: {
        plugins: [vuetify, router],
        stubs: {
          VDialog: {
            name: "VDialog",
            props: ["modelValue", "persistent", "width"],
            template:
              '<div class="v-dialog" v-if="modelValue"><slot /></div>',
          },
          ...(extra.stubs || {}),
        },
      },
    },
  };
}
