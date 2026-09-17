<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import UserServices from "../services/UserServices";
import { useNotification } from "../composables/useNotification";

const PLACEHOLDER_USER = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
};

const route = useRoute();
const { notifySuccess, notifyError } = useNotification();

const sessionUser = ref(null);
const user = computed(() => sessionUser.value || PLACEHOLDER_USER);
const title = computed(() => route.meta.title || "");

onMounted(() => {
  sessionUser.value = JSON.parse(localStorage.getItem("user"));
});

const initials = computed(
  () => `${user.value.firstName.charAt(0)}${user.value.lastName.charAt(0)}`
);

const fullName = computed(
  () => `${user.value.firstName} ${user.value.lastName}`
);

async function logout() {
  if (!sessionUser.value?.token) {
    sessionUser.value = null;
    localStorage.removeItem("user");
    notifySuccess("Logged out successfully.");
    return;
  }
  try {
    await UserServices.logoutUser();
    localStorage.removeItem("user");
    sessionUser.value = null;
    notifySuccess("Logged out successfully.");
  } catch (error) {
    notifyError(error?.response?.data?.message || "Logout failed.");
  }
}
</script>

<template>
  <div>
    <v-app-bar color="primary" app dark>
      <img
        class="mx-2 oc-logo"
        alt="OC logo"
        src="/oc_logo.png"
        height="50"
        width="50"
      />
      <v-toolbar-title class="title">
        {{ title }}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="mx-2" :to="{ name: 'recipes' }"> Recipes </v-btn>
      <v-btn class="mx-2" :to="{ name: 'ingredients' }"> Ingredients </v-btn>
      <v-menu min-width="200px" rounded>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props" :aria-label="initials">
            <v-avatar class="mx-auto text-center" color="accent" size="large">
              <span class="white--text font-weight-bold">{{ initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar color="accent">
                <span class="white--text text-h5">{{ initials }}</span>
              </v-avatar>
              <h3>{{ fullName }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn rounded variant="text" @click="logout()"> Logout </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
</template>
