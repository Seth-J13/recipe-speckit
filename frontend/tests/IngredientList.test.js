/**
 * Feature 3 — Ingredients Management
 * Spec: features/feature-3-Ingredients-Management.md
 */

import { mount, flushPromises } from "@vue/test-utils";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { nextTick } from "vue";
import IngredientList from "../src/views/IngredientList.vue";
import IngredientServices from "../src/services/IngredientServices.js";

vi.mock("../src/services/IngredientServices.js", () => ({
  default: {
    getIngredients: vi.fn(),
    addIngredient: vi.fn(),
    updateIngredient: vi.fn(),
  },
}));

const SPEC_UNITS = [
  "Cup",
  "Gallon",
  "Gram",
  "Kilogram",
  "Liter",
  "Mili-liter",
  "Ounce",
  "Pint",
  "Piece",
  "Pound",
  "Quart",
  "Tablespoon",
  "Teapsoon",
  "Unit",
];

const existingRows = [
  { id: 1, name: "Flour", unit: "Cup", pricePerUnit: "1.50" },
  { id: 2, name: "Sugar", unit: "Pound", pricePerUnit: "0.80" },
];

function signedInUser() {
  return { id: 11, email: "cook@example.com", token: "test-token" };
}

function buttonLabel(button) {
  return button.text().replace(/\s+/g, " ").trim();
}

function findButton(wrapper, label) {
  const match = wrapper.findAll("button").find((button) => {
    return buttonLabel(button) === label;
  });
  if (!match) {
    const labels = wrapper
      .findAll("button")
      .map(buttonLabel)
      .filter(Boolean);
    throw new Error(`Button "${label}" not found. Found: ${labels.join(" | ")}`);
  }
  return match;
}

function countButtons(wrapper, label) {
  return wrapper.findAll("button").filter((button) => buttonLabel(button) === label)
    .length;
}

function findFieldByLabel(wrapper, componentName, label) {
  const match = wrapper.findAllComponents({ name: componentName }).find((field) => {
    return field.props("label") === label;
  });
  if (!match) {
    throw new Error(`${componentName} with label "${label}" not found`);
  }
  return match;
}

function tableText(wrapper) {
  return wrapper.find("table").text();
}

async function mountList({ ingredients = existingRows } = {}) {
  IngredientServices.getIngredients.mockResolvedValue({ data: ingredients });
  IngredientServices.addIngredient.mockResolvedValue({ data: {} });
  IngredientServices.updateIngredient.mockResolvedValue({ data: {} });

  localStorage.clear();
  localStorage.setItem("user", JSON.stringify(signedInUser()));

  const vuetify = createVuetify({ components, directives });
  const wrapper = mount(IngredientList, {
    global: {
      plugins: [vuetify],
      stubs: {
        VDialog: {
          name: "VDialog",
          props: ["modelValue", "persistent", "width"],
          template:
            '<div class="ingredient-dialog" v-if="modelValue"><slot /></div>',
        },
      },
    },
  });

  await flushPromises();
  await nextTick();
  return wrapper;
}

describe("Feature 3 — Ingredients Management", () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
      wrapper = undefined;
    }
    localStorage.clear();
  });

  describe("US-3.1 — view ingredients list", () => {
    it("view ingredients list", async () => {
      wrapper = await mountList();

      expect(tableText(wrapper)).toContain("Flour");
      expect(tableText(wrapper)).toContain("Sugar");
      expect(IngredientServices.getIngredients).toHaveBeenCalled();
    });
  });

  describe("US-3.2 — open add ingredient modal", () => {
    it("open add ingredient modal", async () => {
      wrapper = await mountList();

      await findButton(wrapper, "Add").trigger("click");
      await nextTick();

      expect(wrapper.find(".ingredient-dialog").exists()).toBe(true);
      expect(wrapper.text()).toContain("Add Ingredient");
      expect(wrapper.find("table").exists()).toBe(true);
      expect(tableText(wrapper)).toContain("Flour");
    });
  });

  describe("US-3.3 — enter name and price per unit", () => {
    it("enter name and price per unit", async () => {
      wrapper = await mountList();
      await findButton(wrapper, "Add").trigger("click");
      await nextTick();

      const nameField = findFieldByLabel(wrapper, "VTextField", "Name");
      const priceField = findFieldByLabel(wrapper, "VTextField", "Price per Unit");
      const unitField = findFieldByLabel(wrapper, "VSelect", "Unit");

      await nameField.setValue("Butter");
      await priceField.setValue("3.25");

      expect(nameField.props("modelValue")).toBe("Butter");
      expect(String(priceField.props("modelValue"))).toBe("3.25");
      expect(nameField.element.tagName).not.toBe("SELECT");
      expect(priceField.element.tagName).not.toBe("SELECT");
      expect(unitField.exists()).toBe(true);
    });
  });

  describe("US-3.4 — select unit from dropdown", () => {
    it("select unit from dropdown", async () => {
      wrapper = await mountList();
      await findButton(wrapper, "Add").trigger("click");
      await nextTick();

      const unitField = findFieldByLabel(wrapper, "VSelect", "Unit");
      expect(unitField.props("items")).toEqual(SPEC_UNITS);

      await unitField.setValue("Cup");
      await nextTick();
      expect(unitField.props("modelValue")).toBe("Cup");
    });
  });

  describe("US-3.5 — cancel without saving", () => {
    it("cancel add without saving", async () => {
      wrapper = await mountList();
      const beforeTable = tableText(wrapper);

      await findButton(wrapper, "Add").trigger("click");
      await nextTick();
      await findFieldByLabel(wrapper, "VTextField", "Name").setValue("Discard Me");
      await findButton(wrapper, "Close").trigger("click");
      await nextTick();

      expect(wrapper.find(".ingredient-dialog").exists()).toBe(false);
      expect(IngredientServices.addIngredient).not.toHaveBeenCalled();
      expect(IngredientServices.updateIngredient).not.toHaveBeenCalled();
      expect(tableText(wrapper)).toBe(beforeTable);
    });

    it("cancel edit without saving", async () => {
      wrapper = await mountList();
      const beforeTable = tableText(wrapper);

      await findButton(wrapper, "Edit").trigger("click");
      await nextTick();
      await findFieldByLabel(wrapper, "VTextField", "Name").setValue(
        "Changed Flour"
      );
      await findButton(wrapper, "Close").trigger("click");
      await nextTick();

      expect(wrapper.find(".ingredient-dialog").exists()).toBe(false);
      expect(IngredientServices.updateIngredient).not.toHaveBeenCalled();
      expect(IngredientServices.addIngredient).not.toHaveBeenCalled();
      expect(tableText(wrapper)).toBe(beforeTable);
    });
  });

  describe("US-3.6 — add ingredient with POST", () => {
    it("add ingredient with POST", async () => {
      const created = {
        id: 3,
        name: "Salt",
        unit: "Cup",
        pricePerUnit: "0.40",
      };
      IngredientServices.getIngredients
        .mockResolvedValueOnce({ data: existingRows })
        .mockResolvedValueOnce({ data: [...existingRows, created] });
      IngredientServices.addIngredient.mockResolvedValue({ data: created });

      wrapper = await mountList({ ingredients: existingRows });
      await findButton(wrapper, "Add").trigger("click");
      await nextTick();

      await findFieldByLabel(wrapper, "VTextField", "Name").setValue("Salt");
      await findFieldByLabel(wrapper, "VSelect", "Unit").setValue("Cup");
      await findFieldByLabel(wrapper, "VTextField", "Price per Unit").setValue(
        "0.40"
      );
      await findButton(wrapper, "Add Ingredient").trigger("click");
      await flushPromises();
      await nextTick();

      expect(IngredientServices.addIngredient).toHaveBeenCalledTimes(1);
      const posted = IngredientServices.addIngredient.mock.calls[0][0];
      expect(posted.name).toBe("Salt");
      expect(posted.unit).toBe("Cup");
      expect(String(posted.pricePerUnit)).toBe("0.40");
      expect(wrapper.find(".ingredient-dialog").exists()).toBe(false);
      expect(tableText(wrapper)).toContain("Salt");
      expect(tableText(wrapper)).toContain("Cup");
      expect(tableText(wrapper)).toContain("0.40");
      expect(countButtons(wrapper, "Edit")).toBe(existingRows.length + 1);
    });
  });

  describe("US-3.7 — open edit ingredient modal", () => {
    it("open edit ingredient modal", async () => {
      wrapper = await mountList();

      await findButton(wrapper, "Edit").trigger("click");
      await nextTick();

      expect(wrapper.find(".ingredient-dialog").exists()).toBe(true);
      expect(wrapper.text()).toContain("Edit Ingredient");
      expect(
        findFieldByLabel(wrapper, "VTextField", "Name").props("modelValue")
      ).toBe("Flour");
      expect(
        findFieldByLabel(wrapper, "VSelect", "Unit").props("modelValue")
      ).toBe("Cup");
      expect(
        String(
          findFieldByLabel(wrapper, "VTextField", "Price per Unit").props(
            "modelValue"
          )
        )
      ).toBe("1.50");
      expect(findButton(wrapper, "Update Ingredient").exists()).toBe(true);
    });
  });

  describe("US-3.8 — update ingredient with PUT", () => {
    it("update ingredient with PUT", async () => {
      const updated = {
        id: 1,
        name: "Bread Flour",
        unit: "Pound",
        pricePerUnit: "2.10",
      };
      IngredientServices.getIngredients
        .mockResolvedValueOnce({ data: existingRows })
        .mockResolvedValueOnce({
          data: [updated, existingRows[1]],
        });
      IngredientServices.updateIngredient.mockResolvedValue({ data: updated });

      wrapper = await mountList({ ingredients: existingRows });
      await findButton(wrapper, "Edit").trigger("click");
      await nextTick();

      await findFieldByLabel(wrapper, "VTextField", "Name").setValue(
        "Bread Flour"
      );
      await findFieldByLabel(wrapper, "VSelect", "Unit").setValue("Pound");
      await findFieldByLabel(wrapper, "VTextField", "Price per Unit").setValue(
        "2.10"
      );
      await findButton(wrapper, "Update Ingredient").trigger("click");
      await flushPromises();
      await nextTick();

      expect(IngredientServices.updateIngredient).toHaveBeenCalledTimes(1);
      expect(IngredientServices.addIngredient).not.toHaveBeenCalled();
      const payload = IngredientServices.updateIngredient.mock.calls[0][0];
      expect(payload.id).toBe(1);
      expect(payload.name).toBe("Bread Flour");
      expect(payload.unit).toBe("Pound");
      expect(String(payload.pricePerUnit)).toBe("2.10");
      expect(wrapper.find(".ingredient-dialog").exists()).toBe(false);
      expect(tableText(wrapper)).toContain("Bread Flour");
      expect(tableText(wrapper)).toContain("Pound");
      expect(tableText(wrapper)).toContain("2.10");
      expect(wrapper.findAll("tbody tr")).toHaveLength(2);
    });
  });
});
