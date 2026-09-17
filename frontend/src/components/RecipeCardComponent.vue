<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import RecipeIngredientServices from "../services/RecipeIngredientServices.js";
import RecipeStepServices from "../services/RecipeStepServices";
import RecipeReports from "../reports/RecipeReports.js";
import RecipeServices from "../services/RecipeServices.js";

const router = useRouter();
const emit = defineEmits(["deletedList"]);

const showDetails = ref(false);
const isDelete = ref(false);
const recipeIngredients = ref([]);
const recipeSteps = ref([]);
const user = ref(JSON.parse(localStorage.getItem("user")));

const props = defineProps({
  recipe: {
    required: true,
  },
});

onMounted(async () => {
  await getRecipeIngredients();
  await getRecipeSteps();
});

async function getRecipeIngredients() {
  await RecipeIngredientServices.getRecipeIngredientsForRecipe(props.recipe.id)
    .then((response) => {
      recipeIngredients.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getRecipeSteps() {
  await RecipeStepServices.getRecipeStepsForRecipeWithIngredients(
    props.recipe.id
  )
    .then((response) => {
      recipeSteps.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function navigateToEdit() {
  router.push({ name: "editRecipe", params: { id: props.recipe.id } });
}

function openDelete() {
  isDelete.value = true;
}

function cancelDelete() {
  isDelete.value = false;
}

async function confirmDelete() {
  isDelete.value = false;
  await RecipeServices.deleteRecipe(props.recipe.id)
    .then(() => {
      emit("deletedList");
    })
    .catch((error) => {
      console.log(error);
    });
}
</script>

<template>
  <v-card
    class="rounded-lg elevation-5 mb-8"
    @click="showDetails = !showDetails"
  >
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          {{ recipe.name }}
          <v-chip class="ma-2" color="primary" label>
            <v-icon start icon="mdi-account-circle-outline"></v-icon>
            {{ recipe.servings }} Servings
          </v-chip>
          <v-chip class="ma-2" color="accent" label>
            <v-icon start icon="mdi-clock-outline"></v-icon>
            {{ recipe.time }} minutes
          </v-chip>
        </v-col>
        <v-col class="d-flex justify-end">
          <span
            icon="mdi-file-pdf-box"
            @click.stop="RecipeReports.generateRecipePDF(recipe)"
          >
            <v-icon
              size="small"
              icon="mdi-file-pdf-box"
              aria-label="Export-as-PDF"
            ></v-icon>
          </span>
          <span
            v-if="user !== null"
            icon="mdi-pencil"
            @click.stop="navigateToEdit()"
          >
            <v-icon
              size="small"
              icon="mdi-pencil"
              aria-label="Edit Recipe"
            ></v-icon>
          </span>
          <span
            v-if="user !== null"
            icon="mdi-delete"
            @click.stop="openDelete()"
          >
            <v-icon
              size="small"
              icon="mdi-delete"
              aria-label="Delete Recipe"
            ></v-icon>
          </span>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="body-1">
      {{ recipe.description }}
    </v-card-text>
    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3>Ingredients</h3>
        <v-list>
          <v-list-item
            v-for="recipeIngredient in recipeIngredients"
            :key="recipeIngredient.id"
          >
            <b
              >{{ recipeIngredient.quantity }}
              {{
                `${recipeIngredient.ingredient.unit}${
                  recipeIngredient.quantity > 1 ? "s" : ""
                }`
              }}</b
            >
            of {{ recipeIngredient.ingredient.name }} (${{
              recipeIngredient.ingredient.pricePerUnit
            }}/{{ recipeIngredient.ingredient.unit }})
          </v-list-item>
        </v-list>
        <h3>Recipe Steps</h3>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Step</th>
              <th class="text-left">Instruction</th>
              <th class="text-left">Ingredients</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="step in recipeSteps" :key="step.id">
              <td>{{ step.stepNumber }}</td>
              <td>{{ step.instruction }}</td>
              <td>
                <v-chip
                  size="small"
                  v-for="ingredient in step.recipeIngredient"
                  :key="ingredient.id"
                  pill
                  >{{ ingredient.ingredient.name }}</v-chip
                >
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-expand-transition>
  </v-card>
  <v-dialog v-model="isDelete" width="500">
    <v-card class="rounded-lg elevation-5">
      <v-card-title class="headline mb-2">Confirm delete</v-card-title>
      <v-card-text>
        Delete {{ recipe.name }}? This cannot be undone.
        <v-alert
          v-if="recipe.isPublished"
          type="warning"
          density="compact"
          class="mt-2"
        >
          This recipe is currently published.
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="outlined" @click="cancelDelete()">CANCEL</v-btn>
        <v-btn variant="elevated" color="error" @click="confirmDelete()"
          >DELETE</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
