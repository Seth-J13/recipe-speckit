import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      meta: { title: "Login" },
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/recipes",
      name: "recipes",
      meta: { title: "Recipes" },
      component: () => import("./views/RecipeList.vue"),
    },
    {
      path: "/recipe/:id",
      name: "editRecipe",
      meta: { title: "Edit Recipe" },
      props: true,
      component: () => import("./views/EditRecipe.vue"),
    },
    {
      path: "/ingredients",
      name: "ingredients",
      meta: { title: "Ingredients" },
      component: () => import("./views/IngredientList.vue"),
    },
  ],
});

export default router;
