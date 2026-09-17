import { ref } from "vue";

const notifications = ref([]);
let nextId = 1;

export function useNotification() {
  function notifySuccess(text) {
    notifications.value = [
      ...notifications.value,
      { id: nextId++, text, color: "green" },
    ];
  }

  function notifyError(text) {
    notifications.value = [
      ...notifications.value,
      { id: nextId++, text, color: "red" },
    ];
  }

  function closeNotification(id) {
    notifications.value = notifications.value.filter(
      (notification) => notification.id !== id
    );
  }

  function resetNotifications() {
    notifications.value = [];
  }

  return {
    notifications,
    notifySuccess,
    notifyError,
    closeNotification,
    resetNotifications,
  };
}
