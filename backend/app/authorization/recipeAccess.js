const db = require("../models");
const Recipe = db.recipe;

exports.getAccessibleRecipeOrNull = async (req, recipeId) => {
  const id = parseInt(recipeId, 10);
  if (Number.isNaN(id) || !req.user?.id) {
    return null;
  }
  const row = await Recipe.findOne({
    where: { id, userId: req.user.id },
  });
  return row ?? null;
};
