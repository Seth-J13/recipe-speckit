<script setup>
import { useNotification } from "../composables/useNotification";

const { notifications, closeNotification } = useNotification();
</script>

<template>
  <div
    class="app-notifications"
    data-testid="app-notifications"
    style="position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); z-index: 2000; width: min(560px, calc(100% - 32px)); pointer-events: none;"
  >
    <v-alert
      v-for="notification in notifications"
      :key="notification.id"
      class="app-notification mb-2"
      :color="notification.color"
      :data-color="notification.color"
      rounded="lg"
      variant="flat"
    >
      <div class="d-flex align-center justify-space-between">
        <span>{{ notification.text }}</span>
        <v-btn
          class="ml-4"
          variant="text"
          @click="closeNotification(notification.id)"
        >
          Close
        </v-btn>
      </div>
    </v-alert>
  </div>
</template>

<style scoped>
.app-notification {
  pointer-events: auto;
}
</style>
