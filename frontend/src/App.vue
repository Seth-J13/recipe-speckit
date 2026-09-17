<script setup>
import { useRoute } from "vue-router";
import MenuBar from "./components/MenuBar.vue";
import AppNotification from "./components/AppNotification.vue";

const route = useRoute();
</script>

<template>
  <v-app :style="{ background: '#F4F4F4' }">
    <MenuBar :key="route.fullPath" />
    <v-main>
      <router-view />
    </v-main>
    <AppNotification />
  </v-app>
</template>
