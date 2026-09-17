import jsPDF from "jspdf";
import "jspdf-autotable";
import RecipeIngredientServices from "../services/RecipeIngredientServices.js";
import RecipeStepServices from "../services/RecipeStepServices.js";

function formatPrice(price) {
  return Number(price).toFixed(2);
}

function formatUpdatedAt(value) {
  const date = value ? new Date(value) : new Date();
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

function footerText(recipe) {
  if (recipe.isPublished) {
    return `${recipe.id} published as of ${formatUpdatedAt(recipe.updatedAt)}`;
  }
  return `${recipe.id} — draft (unpublished)`;
}

export default {
  async generateRecipePDF(recipe) {
    let recipeIngredients = [];
    let recipeSteps = [];

    try {
      const response =
        await RecipeIngredientServices.getRecipeIngredientsForRecipe(recipe.id);
      recipeIngredients = (response.data || []).filter(
        (row) => row.recipeStepId == null
      );
    } catch (error) {
      console.log(error);
    }

    try {
      const response =
        await RecipeStepServices.getRecipeStepsForRecipeWithIngredients(
          recipe.id
        );
      recipeSteps = (response.data || []).map((step) => ({
        ...step,
        ingredientList: (step.recipeIngredient || [])
          .map((ri) => ri.ingredient?.name)
          .filter(Boolean)
          .join(", "),
      }));
    } catch (error) {
      console.log(error);
    }

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "in",
      format: "letter",
    });
    const img = new Image();
    img.src = "/oc-logo-white.png";
    try {
      doc.addImage(img, "PNG", 0.4, 0.78, 0.975, 0.56);
    } catch (error) {
      console.log(error);
    }

    doc.setFontSize(16).text(String(recipe.name || ""), 1.0, 1.7);
    doc.setFontSize(12).text(`${parseInt(recipe.servings, 10)} servings`, 1.5, 2.0);
    doc.setFontSize(12).text(String(recipe.description || ""), 1.5, 2.3);
    doc.setFontSize(12).text(`${recipe.time} min`, 1.5, 2.6);

    doc.setFontSize(16).text("Ingredients", 1.0, 3.0);
    let startY = 3.3;
    if (recipeIngredients.length === 0) {
      doc.setFontSize(12).text("None", 1.5, startY);
      startY += 0.3;
    } else {
      recipeIngredients.forEach((row) => {
        const unit = row.ingredient?.unit || "";
        const name = row.ingredient?.name || "";
        const price = formatPrice(row.ingredient?.pricePerUnit);
        doc.setFontSize(12).text(
          `${row.quantity} ${unit} of ${name} ($${price}/${unit})`,
          1.5,
          startY
        );
        startY += 0.3;
      });
    }

    doc.setFontSize(16).text("Steps", 1.0, startY);
    startY += 0.3;

    doc.autoTable({
      columns: [
        { title: "Step", dataKey: "stepNumber" },
        { title: "Instruction", dataKey: "instruction" },
        { title: "Ingredients", dataKey: "ingredientList" },
      ],
      headStyles: {
        fillColor: [129, 20, 41],
        fontSize: 11,
      },
      startY,
      body: recipeSteps,
      margin: { left: 0.5, top: 1.5 },
    });

    doc
      .setFontSize(10)
      .text(footerText(recipe), 0.5, doc.internal.pageSize.height - 0.5);
    doc.save("recipeReport.pdf");
  },
};
