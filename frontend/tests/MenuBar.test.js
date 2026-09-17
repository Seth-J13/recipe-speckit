/**
 * Feature 1 — Menu Bar & User Navigation
 * Spec: features/1-menu-bar.md
 */
import { flushPromises } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import UserServices from "../src/services/UserServices";
import { useNotification } from "../src/composables/useNotification";
import { findByText, mountShell, signedInUser } from "./helpers";

vi.mock("../src/services/UserServices", () => ({
  default: {
    logoutUser: vi.fn(() => Promise.resolve({ data: { message: "Logged out successfully." } })),
  },
}));

describe("Feature 1 — Menu Bar & User Navigation", () => {
  let wrapper;
  let router;

  beforeEach(() => {
    document.body.innerHTML = "";
    localStorage.clear();
    useNotification().resetNotifications();
    UserServices.logoutUser.mockReset();
    UserServices.logoutUser.mockResolvedValue({
      data: { message: "Logged out successfully." },
    });
  });

  afterEach(() => {
    wrapper?.unmount();
    document.body.innerHTML = "";
  });

  describe("US-1.1 — Navigate Using the Menu Bar", () => {
    it("User navigates to the Recipes page", async () => {
      ({ wrapper, router } = await mountShell({ startPath: "/ingredients" }));
      await findByText(wrapper, "Recipes").trigger("click");
      await flushPromises();
      expect(router.currentRoute.value.name).toBe("recipes");
    });

    it("User navigates to the Ingredients page", async () => {
      ({ wrapper, router } = await mountShell({ startPath: "/recipes" }));
      await findByText(wrapper, "Ingredients").trigger("click");
      await flushPromises();
      expect(router.currentRoute.value.name).toBe("ingredients");
    });

    it("User selects the menu option for the current page", async () => {
      ({ wrapper, router } = await mountShell({ startPath: "/recipes" }));
      await findByText(wrapper, "Recipes").trigger("click");
      await flushPromises();
      expect(router.currentRoute.value.name).toBe("recipes");
    });

    it("Menu bar does not include a Login option", async () => {
      ({ wrapper } = await mountShell({ startPath: "/recipes" }));
      expect(findByText(wrapper, "Login")).toBeUndefined();
    });

    it("Application opens on Recipes with the menu bar", async () => {
      ({ wrapper, router } = await mountShell({ startPath: "/" }));
      expect(router.currentRoute.value.name).toBe("recipes");
      expect(findByText(wrapper, "Recipes")).toBeTruthy();
      expect(wrapper.text()).not.toContain("Login page");
      expect(wrapper.text()).toContain("Recipes page");
    });
  });

  describe("US-1.2 — See Branding and the Current Page Title", () => {
    it("Menu bar displays the OC logo", async () => {
      ({ wrapper } = await mountShell({ startPath: "/recipes" }));
      const logo = wrapper.get(".oc-logo");
      expect(logo.attributes("alt")).toBe("OC logo");
      expect(logo.attributes("src")).toContain("oc_logo.png");
    });

    it("Menu bar displays the current page title", async () => {
      ({ wrapper } = await mountShell({ startPath: "/recipes" }));
      expect(wrapper.get(".title").text()).toContain("Recipes");
    });

    it("Page title updates after navigation", async () => {
      ({ wrapper } = await mountShell({ startPath: "/ingredients" }));
      await findByText(wrapper, "Recipes").trigger("click");
      await flushPromises();
      expect(wrapper.get(".title").text()).toContain("Recipes");
    });
  });

  describe("US-1.3 — Open My Profile from the Menu Bar", () => {
    it("Menu bar displays the signed-in user's initials", async () => {
      ({ wrapper } = await mountShell({
        startPath: "/recipes",
        user: null,
      }));
      expect(wrapper.get('[aria-label="JD"]').text()).toContain("JD");
    });

    it("User opens the profile card", async () => {
      ({ wrapper } = await mountShell({
        startPath: "/recipes",
        user: null,
      }));
      await wrapper.get('[aria-label="JD"]').trigger("click");
      await flushPromises();
      expect(wrapper.text()).toContain("Jane Doe");
      expect(wrapper.text()).toContain("jane@example.com");
      expect(wrapper.text()).toContain("Logout");
    });
  });

  describe("US-1.4 — Log Out from the Profile Card", () => {
    it("User logs out from the profile card", async () => {
      ({ wrapper, router } = await mountShell({
        startPath: "/recipes",
        user: signedInUser,
      }));
      await wrapper.get('[aria-label="JD"]').trigger("click");
      await flushPromises();
      await findByText(wrapper, "Logout").trigger("click");
      await flushPromises();
      expect(localStorage.getItem("user")).toBeNull();
      expect(router.currentRoute.value.name).toBe("recipes");
      expect(wrapper.get('[aria-label="JD"]').exists()).toBe(true);
      expect(findByText(wrapper, "Recipes")).toBeTruthy();
      expect(findByText(wrapper, "Login")).toBeUndefined();
    });
  });
});
