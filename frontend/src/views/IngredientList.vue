<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import IngredientServices from "../services/IngredientServices.js";
import { useNotification } from "../composables/useNotification";

const units = [
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

const ingredients = ref([]);
const isAdd = ref(false);
const isEdit = ref(false);
const user = ref(null);
const { notifySuccess, notifyError } = useNotification();
const newIngredient = ref({
  id: undefined,
  name: undefined,
  unit: undefined,
  pricePerUnit: undefined,
});

onMounted(async () => {
  await getIngredients();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getIngredients() {
  await IngredientServices.getIngredients()
    .then((response) => {
      ingredients.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      notifyError(error.response.data.message);
    });
}

async function addIngredient() {
  isAdd.value = false;
  delete newIngredient.id;
  await IngredientServices.addIngredient(newIngredient.value)
    .then(() => {
      notifySuccess(`${newIngredient.value.name} added successfully!`);
    })
    .catch((error) => {
      console.log(error);
      notifyError(error.response.data.message);
    });
  await getIngredients();
}

async function updateIngredient() {
  isEdit.value = false;
  await IngredientServices.updateIngredient(newIngredient.value)
    .then(() => {
      notifySuccess(`${newIngredient.name} updated successfully!`);
    })
    .catch((error) => {
      console.log(error);
      notifyError(error.response.data.message);
    });
  await getIngredients();
}

function openAdd() {
  newIngredient.value.name = undefined;
  newIngredient.value.unit = undefined;
  newIngredient.value.pricePerUnit = undefined;
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

function openEdit(item) {
  newIngredient.value.id = item.id;
  newIngredient.value.name = item.name;
  newIngredient.value.unit = item.unit;
  newIngredient.value.pricePerUnit = item.pricePerUnit;
  isEdit.value = true;
}

function closeEdit() {
  isEdit.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >Ingredients
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openAdd()"
            >Add</v-btn
          >
        </v-col>
      </v-row>

      <v-table class="rounded-lg elevation-5">
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Unit</th>
            <th class="text-left">Price per Unit</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in ingredients" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.unit }}</td>
            <td>${{ item.pricePerUnit }}</td>
            <td>
              <v-btn size="small" variant="text" @click="openEdit(item)"
                >Edit</v-btn
              >
            </td>
          </tr>
        </tbody>
      </v-table>

      <v-dialog persistent :model-value="isAdd || isEdit" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-item>
            <v-card-title class="headline mb-2"
              >{{ isAdd ? "Add Ingredient" : isEdit ? "Edit Ingredient" : "" }}
            </v-card-title>
          </v-card-item>
          <v-card-text>
            <v-text-field
              v-model="newIngredient.name"
              label="Name"
              required
            ></v-text-field>
            <v-select
              v-model="newIngredient.unit"
              :items="units"
              label="Unit"
              required
            >
            </v-select>
            <v-text-field
              v-model="newIngredient.pricePerUnit"
              label="Price per Unit"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="flat"
              color="secondary"
              @click="isAdd ? closeAdd() : isEdit ? closeEdit() : false"
              >Close</v-btn
            >
            <v-btn
              variant="flat"
              color="primary"
              @click="
                isAdd ? addIngredient() : isEdit ? updateIngredient() : false
              "
              >{{
                isAdd ? "Add Ingredient" : isEdit ? "Update Ingredient" : ""
              }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>
