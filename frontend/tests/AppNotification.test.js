/**
 * Feature 1 — Menu Bar & User Navigation
 * Spec: features/1-menu-bar.md
 */
import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import AppNotification from "../src/components/AppNotification.vue";
import { useNotification } from "../src/composables/useNotification";
import { createTestVuetify, findByText, mountShell } from "./helpers";

describe("Feature 1 — Menu Bar & User Navigation", () => {
  let wrapper;

  beforeEach(() => {
    document.body.innerHTML = "";
    localStorage.clear();
    useNotification().resetNotifications();
  });

  afterEach(() => {
    wrapper?.unmount();
    document.body.innerHTML = "";
  });

  describe("US-1.5 — See Reusable Success and Failure Notifications", () => {
    it("Successful operation shows a green notification at the bottom of the screen", async () => {
      wrapper = mount(AppNotification, {
        global: { plugins: [createTestVuetify()] },
      });
      useNotification().notifySuccess("Saved.");
      await flushPromises();
      const tray = wrapper.get('[data-testid="app-notifications"]');
      expect(tray.element.style.bottom).toBe("16px");
      expect(tray.element.style.position).toBe("fixed");
      const notice = wrapper.get('[data-color="green"]');
      expect(notice.text()).toContain("Saved.");
      expect(notice.classes().join(" ")).toMatch(/green/i);
    });

    it("Unsuccessful operation shows a red notification at the bottom of the screen", async () => {
      wrapper = mount(AppNotification, {
        global: { plugins: [createTestVuetify()] },
      });
      useNotification().notifyError("Failed.");
      await flushPromises();
      const tray = wrapper.get('[data-testid="app-notifications"]');
      expect(tray.element.style.bottom).toBe("16px");
      const notice = wrapper.get('[data-color="red"]');
      expect(notice.text()).toContain("Failed.");
      expect(notice.classes().join(" ")).toMatch(/red/i);
    });

    it("User closes a notification", async () => {
      const leftover = { undone: false };
      wrapper = mount(AppNotification, {
        global: { plugins: [createTestVuetify()] },
      });
      useNotification().notifySuccess("Saved.");
      leftover.undone = false;
      await flushPromises();
      await findByText(wrapper, "Close").trigger("click");
      await flushPromises();
      expect(wrapper.find('[data-color="green"]').exists()).toBe(false);
      expect(leftover.undone).toBe(false);
    });

    it("Multiple notifications do not block the page", async () => {
      ({ wrapper } = await mountShell({ startPath: "/recipes" }));
      const { notifySuccess, notifyError } = useNotification();
      notifySuccess("Saved.");
      notifyError("Failed.");
      await flushPromises();
      expect(wrapper.findAll("[data-color]")).toHaveLength(2);
      expect(findByText(wrapper, "Recipes")).toBeTruthy();
      expect(wrapper.text()).toContain("Recipes page");
    });

    it("The same notification can appear on more than one page", async () => {
      const { notifySuccess, notifyError } = useNotification();
      ({ wrapper } = await mountShell({ startPath: "/recipes" }));
      notifySuccess("Saved on Recipes.");
      await flushPromises();
      expect(wrapper.get('[data-testid="app-notifications"]').text()).toContain(
        "Saved on Recipes."
      );
      await findByText(wrapper, "Ingredients").trigger("click");
      await flushPromises();
      notifyError("Failed on Ingredients.");
      await flushPromises();
      const tray = wrapper.get('[data-testid="app-notifications"]');
      expect(tray.element.style.bottom).toBe("16px");
      expect(tray.text()).toContain("Failed on Ingredients.");
      expect(wrapper.text()).toContain("Ingredients page");
    });
  });
});
