# Story 4.5: Recipe PDF Export

## Overview

Export a single `Recipe` row — with its associated `RecipeStep`, `RecipeIngredient`, and `Ingredient` records — as a one-page PDF matching the reference layout in `recipeReport.pdf`. Related: [Feature 4 -- pdf-export](feature-4-pdf-export.md)

## Data Requirements

Query the recipe by `id` with eager-loaded associations:

- `recipe` (name, description, servings, time, isPublished, updatedAt)
- `recipe.recipeStep` ordered by `stepNumber` ASC
- `recipe.recipeIngredient` joined to `ingredient` (name, unit, pricePerUnit)
- Each `recipeStep`'s own `recipeIngredient` (via `recipeStepId`), joined to `ingredient.name`

## Layout & Field Mapping

### Header

| PDF Element    | Source               | Notes                                                 |
| -------------- | -------------------- | ----------------------------------------------------- |
| Logo           | Static brand asset   | Fixed, not data-driven                                |
| Title          | `recipe.name`        |                                                       |
| Servings badge | `recipe.servings`    | Display as integer                                    |
| Description    | `recipe.description` |                                                       |
| Time           | `recipe.time`        | Format as duration (e.g. `45 min`), not raw timestamp |

### Ingredients Section

One line per `recipeIngredient` where `recipeStepId IS NULL` (recipe-level ingredients, not step-scoped), joined to `ingredient`:

```
{quantity} {ingredient.unit} of {ingredient.name} (${ingredient.pricePerUnit}/{ingredient.unit})
```

`pricePerUnit` formatted to 2 decimals with `$` prefix.

### Steps Table

Columns: `Step` | `Instruction` | `Ingredients`

- Rows sourced from `recipeStep`, ordered by `stepNumber` ASC.
- `Step` = `stepNumber`
- `Instruction` = `instruction`
- `Ingredients` = comma-separated `ingredient.name` for all `recipeIngredient` rows where `recipeStepId` matches this step. Empty if none.

### Footer

```
{recipe.id} published as of {recipe.updatedAt}
```

- Only rendered when `isPublished = 1`.
- `updatedAt` formatted `M/D/YYYY`.
- If `isPublished = 0`, footer reads `{recipe.id} — draft (unpublished)` instead.

## Acceptance Criteria

1. Given a published recipe with steps and ingredients, the generated PDF contains title, servings, description, time, a recipe-level ingredient list with priced units, a steps table with per-step ingredient references, and a published footer with correct id/date.
2. Given an unpublished recipe, the footer shows draft state instead of a publish date.
3. Given a step with no linked ingredients, its `Ingredients` cell renders empty, not an error.
4. Given a recipe with no recipe-level ingredients (`recipeStepId IS NULL` set has zero rows), the Ingredients section renders an empty state rather than omitting the header.
5. Numeric formatting: `pricePerUnit` always shows 2 decimal places regardless of DB precision.
