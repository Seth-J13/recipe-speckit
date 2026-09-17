const db = require("../models");
const Recipe = db.recipe;
const RecipeStep = db.recipeStep;
const RecipeIngredient = db.recipeIngredient;
const Ingredient = db.ingredient;
const {
  getAccessibleRecipeOrNull,
} = require("../authorization/recipeAccess");

function parseRecipeId(recipeId) {
  const id = parseInt(recipeId, 10);
  return Number.isNaN(id) ? null : id;
}

// Create and Save a new Recipe
exports.create = (req, res) => {
  // Validate request
  if (req.body.name === undefined) {
    const error = new Error("Name cannot be empty for recipe!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.description === undefined) {
    const error = new Error("Description cannot be empty for recipe!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.servings === undefined) {
    const error = new Error("Servings cannot be empty for recipe!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.time === undefined) {
    const error = new Error("Time cannot be empty for recipe!");
    error.statusCode = 400;
    throw error;
  } else if (req.body.isPublished === undefined) {
    const error = new Error("Is Published cannot be empty for recipe!");
    error.statusCode = 400;
    throw error;
  }

  const name = String(req.body.name).trim();
  if (!name) {
    return res.status(400).send({
      message: "Name cannot be empty for recipe!",
    });
  }

  // Create a Recipe — ownership comes from the session only (FR-008)
  const recipe = {
    name,
    description: req.body.description,
    servings: req.body.servings,
    time: req.body.time,
    isPublished: req.body.isPublished ? req.body.isPublished : false,
    userId: req.user.id,
  };
  // Save Recipe in the database
  Recipe.create(recipe)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Recipe.",
      });
    });
};

// Find all Recipes for a user
exports.findAllForUser = (req, res) => {
  const userId = parseRecipeId(req.params.userId);
  if (userId === null) {
    return res.status(400).send({ message: "Invalid userId." });
  }
  if (userId !== req.user.id) {
    return res.status(404).send({
      message: `Cannot find Recipes for user with id=${req.params.userId}.`,
    });
  }
  Recipe.findAll({
    where: { userId: userId },
    include: [
      {
        model: RecipeStep,
        as: "recipeStep",
        required: false,
        include: [
          {
            model: RecipeIngredient,
            as: "recipeIngredient",
            required: false,
            include: [
              {
                model: Ingredient,
                as: "ingredient",
                required: false,
              },
            ],
          },
        ],
      },
    ],
    order: [
      ["name", "ASC"],
      [RecipeStep, "stepNumber", "ASC"],
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Recipes for user with id=${userId}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Error retrieving Recipes for user with id=" + userId,
      });
    });
};

// Find all Published Recipes
exports.findAllPublished = (req, res) => {
  Recipe.findAll({
    where: { isPublished: true },
    include: [
      {
        model: RecipeStep,
        as: "recipeStep",
        required: false,
        include: [
          {
            model: RecipeIngredient,
            as: "recipeIngredient",
            required: false,
            include: [
              {
                model: Ingredient,
                as: "ingredient",
                required: false,
              },
            ],
          },
        ],
      },
    ],
    order: [
      ["name", "ASC"],
      [RecipeStep, "stepNumber", "ASC"],
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Published Recipes.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Published Recipes.",
      });
    });
};

// Find a single Recipe with an id
exports.findOne = (req, res) => {
  const id = req.params.id;
  Recipe.findAll({
    where: { id: id },
    include: [
      {
        model: RecipeStep,
        as: "recipeStep",
        required: false,
        include: [
          {
            model: RecipeIngredient,
            as: "recipeIngredient",
            required: false,
            include: [
              {
                model: Ingredient,
                as: "ingredient",
                required: false,
              },
            ],
          },
        ],
      },
    ],
    order: [[RecipeStep, "stepNumber", "ASC"]],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Recipe with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Error retrieving Recipe with id=" + id,
      });
    });
};
// Update a Recipe by the id in the request
exports.update = async (req, res) => {
  const id = parseRecipeId(req.params.id);
  if (id === null) {
    return res.status(400).send({ message: "Invalid recipeId." });
  }
  try {
    const existing = await getAccessibleRecipeOrNull(req, id);
    if (!existing) {
      return res.status(404).send({
        message: `Cannot find Recipe with id=${id}.`,
      });
    }
    const { userId, id: _ignoredId, ...fields } = req.body;
    if (typeof fields.name === "string") {
      fields.name = fields.name.trim();
      if (!fields.name) {
        return res.status(400).send({
          message: "Name cannot be empty for recipe!",
        });
      }
    }
    const number = await Recipe.update(fields, {
      where: { id: existing.id, userId: req.user.id },
    });
    if (number == 1) {
      res.send({
        message: "Recipe was updated successfully.",
      });
    } else {
      res.send({
        message: `Cannot update Recipe with id=${id}. Maybe Recipe was not found or req.body is empty!`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message || "Error updating Recipe with id=" + id,
    });
  }
};
// Delete a Recipe with the specified id in the request
exports.delete = async (req, res) => {
  const id = parseRecipeId(req.params.id);
  if (id === null) {
    return res.status(400).send({ message: "Invalid recipeId." });
  }
  try {
    const existing = await getAccessibleRecipeOrNull(req, id);
    if (!existing) {
      return res.status(404).send({
        message: `Recipe with id=${id} not found.`,
      });
    }
    await Recipe.destroy({
      where: { id: existing.id, userId: req.user.id },
    });
    res.send({
      message: "Recipe was deleted successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message || "Could not delete Recipe with id=" + id,
    });
  }
};
// Delete all Recipes from the database.
exports.deleteAll = (req, res) => {
  Recipe.destroy({
    where: { userId: req.user.id },
    truncate: false,
  })
    .then((number) => {
      res.send({ message: `${number} Recipes were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all recipes.",
      });
    });
};
