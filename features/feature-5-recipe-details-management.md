# Feature: Recipe Details Management

**Feature ID:** 5
**Branch pattern:** `feature/5-recipe-details-management`
**Status:** Draft
**Created:** 2026-09-12
**Input:** Edit current logged in user recipes.
**Depends on:** [Feature 4 -- Recipe Management](feature-4-recipe-management.md)
**Related:** `frontend/src/views/EditRecipe.vue`, `backend/app/routes/recipe.routes.js`, `backend/app/routes/recipeIngredient.routes.js`, `backend/app/routes/recipeStep.routes.js`

---

## User Stories

### US-5.1: Edit Recipe Name

**As a** registered user
**I want to** type the recipe name
**So that** I can change what the recipe is called.

**Priority:** P1
**Independent test:** Original name displays in a editable text box. 
**Acceptance scenarios:** see ### US-5.1 under Acceptance Criteria

### US-5.2: Edit Recipe Number of Servings
**As a** registered user
**I want to** type or increase a counter of how many servings the recipe can supply
**So that** I can change and display a different amount of servings for the recipe.

**Priority:** P1
**Independent test:** Original number of servings displays and only numbers can be entered
**Acceptance scenarios:** see ### US-5.2 under Acceptance Criteria

### US-5.3: Edit Recipe Time to Make (in minutes)
**As a** registered user
**I want to** change the time (in minutes) to make the recipe
**So that** I can change and display the time to make on the recipe card.

**Priority:** P1
**Independent test:** Original amount of time displays, is editable, and only allows numbers in the text field
**Acceptance scenarios:** see ### US-5.3 under Acceptance Criteria

### US-5.4: Toggle Publish
**As a** registered user
**I want to** toggle if the recipe is published
**So that** other registered or non-registered users can view my recipe

**Priority:** P2
**Independent test:** Original value is displayed and can be changed and updated 
**Acceptance scenarios:** see ### US-5.4 under Acceptance Criteria

### US-5.5: Edit Recipe Description
**As a** registered user
**I want to** edit the description of the recipe
**So that** I can change the description of the recipe

**Priority:** P1
**Independent test:** Original description is displayed and the user can edit the description text box
**Acceptance scenarios:** see ### US-5.5 under Acceptance Criteria

### US-5.6: Expand Description Text Box
**As a** registered user
**I want to** expand or shrink the description text box with a resizer
**So that** I can have more or less room to type the description for my recipe

**Priority:** P3
**Independent test:** Resize handler is viewable on the bottom right of the text box and can be grabbed to resize the text box vertically
**Acceptance scenarios:** see ### US-5.6 under Acceptance Criteria

### US-5.7: Finalize Changes 
**As a** registered user
**I want to** finalize my recipe changes
**So that** the changes update throughout the website

**Priority:** P1
**Independent test:** Update database as a PUT request to recipes table 
**Acceptance scenarios:** see ### US-5.7 under Acceptance Criteria

### US-5.8: View List of Ingredients
**As a** registered user
**I want to** view my list of ingredients for this recipe
**So that** I know what ingredients this recipe requires

**Priority:** P2
**Independent test:** All ingredients are viewable one after the other with number of units of ingredient and price in USD on the left and edit and delete icons on the right 
**Acceptance scenarios:** see ### US-5.8 under Acceptance Criteria

### US-5.9: Add New Ingredient
**As a** registered user
**I want to** add new ingredients to my recipe
**So that** I can change what ingredients are required for my recipe

**Priority:** P2
**Independent test:** Add buton shows modal with a quantity text box and ingredients drop down from the ingredients table in the database. 
**Acceptance scenarios:** see ### US-5.9 under Acceptance Criteria

### US-5.10: Edit Ingredient
**As a** registered user
**I want to** edit a ingredient's quantity, and ingredient type
**So that** I can fix any mistakes or changes in my recipe

**Priority:** P2
**Independent test:** Edit icon shows a edit modal with a text box for quantity, and dropdown for ingredient type,  
**Acceptance scenarios:** see ### US-5.10 under Acceptance Criteria

### US-5.11: Delete Ingredient
**As a** registered user
**I want to** delete any ingredients attached to the recipe I am editing
**So that** I can remove unwanted ingredients

**Priority:** P2
**Independent test:** Remove the selected ingredient from the recipe being edited.
**Acceptance scenarios:** see ### US-5.11 under Acceptance Criteria

### US-5.12: Add a Step to the recipe
**As a** registered user
**I want to** add a step to follow in my recipe
**So that** I can follow the sequence of steps to create the recipe

**Priority:** P2
**Independent test:** Modal shows up with a text box only accepting intergers, text box for instruction description, and drop down for any ingredients used but is not required to be filled
**Acceptance scenarios:** see ### US-5.12 under Acceptance Criteria

### US-5.13: Edit a Step in the recipe
**As a** registered user
**I want to** add a edit a step in my recipe
**So that** I can follow the sequence of steps to create the recipe

**Priority:** P2
**Independent test:** Modal shows up with a text box only accepting intergers, text box for instruction description, and drop down for any ingredients used but is not required to be filled
**Acceptance scenarios:** see ### US-5.13 under Acceptance Criteria

### US-5.14: View All Steps in Chronological Order
**As a** registered user
**I want to** view all the steps of my recipe in chronological order
**So that** I can follow the steps and create my recipe

**Priority:** P2
**Independent test:** All available steps for the recipe being edited are shown sequentially as step, instruction description, ingredients used, edit icon, delete icon
**Acceptance scenarios:** see ### US-5.14 under Acceptance Criteria

---

## Requirements

### Functional Requirements

- **FR-001**: User **MUST** be allowed to edit the recipe name in the text input
- **FR-002**: User **MUST** be allowed to edit the number of servings
- **FR-003**: System **MUST NOT** allow user to enter anything but integers in the number of servings
- **FR-004**: User **MUST** be allowed to edit time to make (in minutes) text input
- **FR-005**: System **MUST NOT** allow user to input anything other than an integer into the time to make (in minutes) text input
- **FR-006**: User **MUST** be allowed to edit the description text input
- **FR-007**: User **MUST** be allowed to change the recipe description vertical text input size using a resizer
- **FR-008**: User **MUST** be allowed to toggle whether the recipe is published or not
- **FR-009**: System **MUST** update the backend database to update the edited recipe's name, number of servings, time to make (in minutes), description, published, ingredients, and steps
- **FR-010**: System **MUST** display the list of ingredients tied to currently viewed recipe
- **FR-011**: User **MUST** be allowed to add new ingredients to the currently selected recipe
- **FR-012**: User **MUST** be allowed to add new ingredients
- **FR-013**: User **MUST** be allowed to delete individual ingredients from the recipe
- **FR-014**: User **MUST** be allowed to add a step to the recipe
- **FR-015**: System **MUST NOT** allow user to input anything but an integer into the step numer
- **FR-015**: User **MUST** be allowed to edit individual steps
- **FR-016**: User **MUST** be allowed to delete steps
- **FR-017**: System **MUST** keep steps in chronological order
- **FR-018**: System **MUST NOT** allow user to input duplicate step numbers connected to the currently selected recipe

---



## Assumptions

- Feature 1, Feature 2, Feature 3, and Feature 4 are already on `dev`
- No new database tables -- Edit Recipe uses the [NEEDS CLARIFICATION: `recipe`, `ingredients`, `steps`]

## Edge Cases

- Fetch or Update another user's recipe --> `401`
- POST or Update steps with the same sequence number --> `400`
- PUT with incorrect database types --> `500`
- POST with duplicate data --> `400`

## Success Criteria

- **SC-001**: Every Gherkin scenario has at least one automated test before merge
- **SC-002**: User can edit the details of their selected recipe and update [NEEDS CLARIFICATION: `recipe`, `ingredients`, `steps`]
- **SC-003**: npm test passes for [NEEDS CLARIFICATION: `recipe.test.js`]

---

## Data Ownership & Isolation

Each user owns their recipes. Recipe ingredients and recipe steps belong to a recipe and inherit that recipe’s owner. The shared ingredient catalog is not owned by this feature.

| Rule | Requirement |
|------|-------------|
| **Read scope** | The edit page loads one recipe by route id (`GET /recipeapi/recipes/:id`) plus that recipe’s ingredients and steps. The ingredient dropdown uses the shared catalog (`GET /recipeapi/ingredients/`). |
| **Write scope** | `PUT /recipeapi/recipes/:id` succeeds only when the row exists and `userId = req.user.id`. Creating a recipe ingredient checks the parent recipe the same way. |
| **Create scope** | New `recipeIngredient` and `recipeStep` rows are created for the recipe being edited; they are not assigned a separate owner. |
| **Cross-user access** | Another user’s recipe on update → `404` `{ "message": "Cannot find Recipe with id=${id}." }` (not `403`). Missing/invalid Bearer token on write routes → `401`. |
| **UI scope** | `EditRecipe.vue` shows the recipe for `route.params.id`. Navigation to edit comes from the signed-in user’s recipe cards. |
| **Implementation** | Recipe update and recipe-ingredient create already check `req.user.id`. Prefer a shared helper in `app/authorization/` for recipe ownership rather than duplicating the check in every controller. |

---

## Key Entities

- **User**: registered account (name, email, username); owns recipe and ingredients, and steps are linked to the recipe.
- **Recipe**: selected recipe to edit
- **Ingredients**: list of the ingredients that only belongs to the selected recipe
- **Steps**: list of steps that only belongs to the selected recipe

---

## API Requirements

Mount prefix: `/recipeapi`. Flat JSON (no `{ success, data }` envelope). Errors: `{ "message": "Human-readable explanation." }`. Authenticated writes send `Authorization: Bearer <token>`.

This feature uses the edit-recipe endpoints below (create/delete recipe and catalog CRUD stay in other features).

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `GET` | `/recipeapi/recipes/:id` | No | Load the recipe being edited (includes nested steps and ingredients) |
| `PUT` | `/recipeapi/recipes/:id` | Yes | Save name, servings, time, description, `isPublished` |
| `GET` | `/recipeapi/recipes/:recipeId/recipeIngredients/` | No | List ingredients attached to this recipe |
| `POST` | `/recipeapi/recipes/:recipeId/recipeIngredients/` | Yes | Add an ingredient to this recipe |
| `PUT` | `/recipeapi/recipes/:recipeId/recipeIngredients/:id` | Yes | Update quantity / ingredient / optional step link |
| `DELETE` | `/recipeapi/recipes/:recipeId/recipeIngredients/:id` | Yes | Remove an ingredient from this recipe |
| `GET` | `/recipeapi/recipes/:recipeId/recipeStepsWithIngredients/` | No | List this recipe’s steps with linked ingredients, ordered by `stepNumber` ASC |
| `POST` | `/recipeapi/recipes/:recipeId/recipeSteps/` | Yes | Add a step |
| `PUT` | `/recipeapi/recipes/:recipeId/recipeSteps/:id` | Yes | Update a step |
| `DELETE` | `/recipeapi/recipes/:recipeId/recipeSteps/:id` | Yes | Delete a step |
| `GET` | `/recipeapi/ingredients/` | No | Ingredient catalog for the add/edit-ingredient dropdown (existing catalog; this feature does not define catalog writes) |

**Unauthenticated write:** `401` `{ "message": "Unauthorized! No Auth Header" }` (or expired-token message).

### Load recipe (`GET /recipeapi/recipes/:id`)

Success (`200`) — array with one recipe (frontend uses index `0`):

```json
[
  {
    "id": 1,
    "name": "Pancakes",
    "description": "Weekend breakfast",
    "servings": 4,
    "time": 20,
    "isPublished": false,
    "userId": 42,
    "recipeStep": []
  }
]
```

### Update recipe (`PUT /recipeapi/recipes/:id`)

**Request body** (fields the edit form sends):

```json
{
  "name": "Pancakes",
  "description": "Weekend breakfast",
  "servings": 4,
  "time": 20,
  "isPublished": true
}
```

**Success** (`200`):

```json
{ "message": "Recipe was updated successfully." }
```

**Not found / not owned:** `404`

```json
{ "message": "Cannot find Recipe with id=1." }
```

**Server error:** `500` `{ "message": "…" }`.

Name, description, servings, time, and `isPublished` edits stay in the form until this `PUT` (no API on each keystroke).

### Add recipe ingredient (`POST /recipeapi/recipes/:recipeId/recipeIngredients/`)

**Request body:**

```json
{
  "quantity": 2,
  "recipeId": 1,
  "recipeStepId": null,
  "ingredientId": 5
}
```

Missing `quantity`, `recipeId`, or `ingredientId` → `400`. Parent recipe missing or not owned → `404`.

**Success** (`200`): created `recipeIngredient` row (includes `id`, `quantity`, `recipeId`, `recipeStepId`, `ingredientId`).

### Update recipe ingredient (`PUT /recipeapi/recipes/:recipeId/recipeIngredients/:id`)

**Request body:** `{ "quantity", "recipeId", "recipeStepId", "ingredientId" }`

**Success** (`200`): `{ "message": "RecipeIngredient was updated successfully." }`

### Delete recipe ingredient (`DELETE /recipeapi/recipes/:recipeId/recipeIngredients/:id`)

**Success** (`200`): `{ "message": "RecipeIngredient was deleted successfully!" }`

**Failure:** `500` `{ "message": "…" }`.

### Add recipe step (`POST /recipeapi/recipes/:recipeId/recipeSteps/`)

**Request body:**

```json
{
  "stepNumber": 1,
  "instruction": "Mix dry ingredients",
  "recipeId": 1
}
```

Missing `stepNumber`, `instruction`, or `recipeId` → `400`.

**Success** (`200`): created `recipeStep` row (`id`, `stepNumber`, `instruction`, `recipeId`). Linking catalog ingredients to the step is a follow-up `PUT` on each `recipeIngredient` (`recipeStepId`).

### Update recipe step (`PUT /recipeapi/recipes/:recipeId/recipeSteps/:id`)

**Success** (`200`): `{ "message": "RecipeStep was updated successfully." }`

### Delete recipe step (`DELETE /recipeapi/recipes/:recipeId/recipeSteps/:id`)

**Success** (`200`): `{ "message": "RecipeStep was deleted successfully!" }`

### List steps with ingredients (`GET /recipeapi/recipes/:recipeId/recipeStepsWithIngredients/`)

**Success** (`200`): array of steps ordered by `stepNumber` ascending; each may include `recipeIngredient` with nested `ingredient`. Duplicate `stepNumber` values are allowed by the current API and sort next to each other.

---

## Screen Requirements

Follow [ui-style-system.mdc](../.cursor/rules/ui-style-system.mdc). Primary labeled actions use class `oc-cta`. Icon-only row actions need `aria-label`s.

### [View: Edit Recipe] — route name `editRecipe`

*   Path: `/recipe/:id` (`props: true`). View: `frontend/src/views/EditRecipe.vue`.
*   Heading: **Edit Recipe**
*   Reached from a signed-in user’s recipe card (pencil on the list).
*   On load: `GET` recipe, recipe ingredients, catalog ingredients, and steps-with-ingredients. Local field edits do **not** call the API until a save/add/update/delete action.

**Recipe details card**

*   Text field **Name** (`recipe.name`) — FR-001 / US-5.1
*   Number field **Number of Servings** (`recipe.servings`, `type="number"`) — FR-002, FR-003 / US-5.2
*   Number field **Time to Make (in minutes)** (`recipe.time`, `type="number"`) — FR-004, FR-005 / US-5.3
*   Switch **Publish?** with label `Publish? Yes` or `Publish? No` from `recipe.isPublished` — FR-008 / US-5.4
*   Textarea **Description** (`recipe.description`, multiple rows) — FR-006 / US-5.5
*   Description resize: vertical grab on the bottom-right resizer changes height; horizontal drag does not widen the box — FR-007 / US-5.6
*   Client whole-number check for servings and time: non-integer input is cleared and the user sees **"Please enter a whole number."**; no API request — US-5.2 / US-5.3
*   Primary action: **Update Recipe** (`oc-cta`) — FR-009 / US-5.7
*   Success snackbar: `` `${recipe.name} updated successfully!` ``; remain on the edit page and reload the recipe
*   Failure: snackbar shows the API `{ message }`; stay on the edit page

**Ingredients card** (below recipe details)

*   Heading: **Ingredients**
*   Primary action: **Add** (`oc-cta`)
*   Each row: quantity, unit (plural `s` when quantity > 1), ingredient name, price `($pricePerUnit/unit)`, pencil icon, trash icon
*   Icon actions: `aria-label` **Edit ingredient**, **Delete ingredient**
*   **Empty state:** empty list; **Add** remains available so the user can add an ingredient
*   Viewing the list does not send a new request after the initial page load

**Add / Edit Ingredient dialog** (`v-dialog`, persistent)

*   Titles: **Add Ingredient** / **Edit Ingredient**
*   Fields: **Quantity** (`type="number"`), **Ingredients** select (catalog `item-title="name"`, return object)
*   Quantity: numeric values stay in the field; `NaN` is cleared on blur/enter; no API until confirm
*   Confirm: **Add Ingredient** or **Update Ingredient** (`oc-cta`)
*   Dismiss: **Close** (closes the dialog without saving; no API request)
*   Success snackbar: `Ingredient added successfully!` or `` `${ingredient.name} updated successfully!` ``
*   Error snackbar: API `{ message }`

**Delete ingredient**

*   Trash icon immediately calls `DELETE` (no confirm dialog in the current UI)
*   Success snackbar: `` `${ingredient.name} deleted successfully!` ``
*   Error snackbar: API `{ message }`

**Steps card**

*   Heading: **Steps**
*   Primary action: **Add** (`oc-cta`)
*   Table columns: step number, instruction, ingredient chips, edit icon, delete icon
*   Rows ordered by `Number` (`stepNumber`) ascending, including duplicates next to each other — US-5.14
*   Icon actions: `aria-label` **Edit step**, **Delete step**
*   **Empty state:** empty table; **Add** remains available

**Add / Edit Step dialog** (`v-dialog`, persistent)

*   Titles: **Add Step** / **Edit Step**
*   Fields: **Number** (`type="number"`), **Instruction** (textarea), **Ingredients** multi-select from this recipe’s ingredients (optional)
*   Number: integers stay in the field; `NaN` is cleared on blur/enter; empty Instruction stays empty; no API until confirm
*   Confirm: **Add Step** or **Update Step** (`oc-cta`)
*   Dismiss: **Close**
*   Success snackbar: `Step added successfully!` / `Step updated successfully!`
*   Error snackbar: API `{ message }`
*   After a successful step create/update, selected recipe ingredients are `PUT` with `recipeStepId` set

**Delete step**

*   Trash icon immediately calls `DELETE`
*   Success snackbar: `Step deleted successfully!`
*   Error snackbar: API `{ message }`

**Loading / error**

*   Initial fetches run on mount. Request failures that return `{ message }` show in a `v-snackbar` (error color). There is no separate skeleton layout on this view.

**App chrome**

*   Existing `MenuBar` (Recipes, Ingredients, user menu). This feature does not add or hide chrome.

---

## Data Model Requirements

This feature uses the existing Recipe app tables (no new tables). Sequelize also stores `createdAt` / `updatedAt`.

### `recipes` table

Owned by a user (`userId` FK via `User hasMany Recipe`). Updated by **Update Recipe**.

| Field | Type | Rules |
| ---------- | ----------- | ---------------------------------- |
| `id` | INTEGER PK | Auto-increment |
| `name` | STRING | Required |
| `description` | STRING | Required |
| `servings` | INTEGER | Required |
| `time` | INTEGER | Required; minutes |
| `isPublished` | BOOLEAN | Required |
| `userId` | INTEGER FK | Required on create; owner |

### `recipeSteps` table

| Field | Type | Rules |
| ---------- | ----------- | ---------------------------------- |
| `id` | INTEGER PK | Auto-increment |
| `recipeId` | INTEGER FK | Required |
| `stepNumber` | INTEGER | Required; UI label **Number**; list sort key |
| `instruction` | STRING(5000) | Required |

### `recipeIngredients` table

Join of a recipe (and optionally a step) to a catalog ingredient.

| Field | Type | Rules |
| ---------- | ----------- | ---------------------------------- |
| `id` | INTEGER PK | Auto-increment |
| `quantity` | FLOAT | Required |
| `recipeId` | INTEGER FK | Required |
| `recipeStepId` | INTEGER FK | Optional (`null` until linked to a step) |
| `ingredientId` | INTEGER FK | Required |

### `ingredients` table (catalog; read-only for this feature)

Used by the ingredient dropdown and row display. Writes belong to the ingredients feature.

| Field | Type | Rules |
| ---------- | ----------- | ---------------------------------- |
| `id` | INTEGER PK | Auto-increment |
| `name` | STRING | Required |
| `unit` | STRING | Required |
| `pricePerUnit` | DECIMAL(10,2) | Optional |

### Associations

*   `User` hasMany `Recipe`; `Recipe` belongsTo `User`
*   `Recipe` hasMany `RecipeStep`; `RecipeStep` belongsTo `Recipe`
*   `Recipe` hasMany `RecipeIngredient`; `RecipeIngredient` belongsTo `Recipe`
*   `RecipeStep` hasMany `RecipeIngredient`; `RecipeIngredient` belongsTo `RecipeStep` (optional)
*   `Ingredient` hasMany `RecipeIngredient`; `RecipeIngredient` belongsTo `Ingredient`


---

## Acceptance Criteria (Gherkin)



### US-5.1 — Edit Recipe Name

#### Scenario: User edits recipe name

- **Given** I am on the edit recipe page
- **When** I view the `Recipe Name` text input
- **And** I change the recipe name
- **Then** the text input stores the potential new name
- **And** no API request is sent


### US-5.2 — Edit Recipe Number of Servings

#### Scenario: User changes the number of servings with a number

- **Given** I am on the edit recipe page
- **And** I view the recipe `Number of Servings` value
- **When** I change the value to another number
- **Then** the text input reflects the new number
- **And** no API request is sent

#### Scenario: User changes the number of servings with a NaN value

- **Given** I am on the edit recipe page
- **And** I view the recipe `Number of Servings` value
- **When** I change the value to a letter or special character
- **Then** the text input is cleared
- **And** a messasge pops up saying `Please enter a whole number.`
- **And** no API request is sent

### US-5.3 — Edit Recipe Time to Make (in minutes)

#### Scenario: User changes the time to make (in minutes) to a number

- **Given** I am on the edit recipe page
- **And** I view the recipe `Time to Make (in minutes)` value
- **When** I change the value to a number
- **Then** the text input reflects the new number
- **And**  no API request is sent

#### Scenario: User changes the time to make (in minutes) to a NaN

- **Given** I am on the edit recipe page
- **And** I view the recipe `Time to Make  (in mintues)` value
- **When** I change the value to a letter or special character
- **Then** the text input is cleared
- **And** a messasge pops up saying `Please enter a whole number.`
- **And** no API request is sent

### US-5.4 — Toggle Publish 

#### Scenario: User toggles the publish recipe switch

- **Given** I am on the edit recipe page
- **And** I view the recipe `Publish Recipe?` switch
- **When** I click the switch
- **Then** the switch changes from its previous state to the opposite state
- **And** no API request is sent

### US-5.5 — Edit Recipe Description

#### Scenario: User changes the recipe description

- **Given** I am on the edit recipe page
- **And** I view the description
- **When** I change the description
- **Then** the text input reflects the new description

### US-5.6 — Expand Description Text Box 

#### Scenario: User grabs the resizer and moves it vertically, up or down

- **Given** I am on the edit recipe page
- **And** I grab the resizer on the bottom right of the description text box
- **When** I move the resizer up or down
- **Then** the text box resizes following the cursor
- **And** no API request is sent

#### Scenario: User grabs the resizer and moves it horizontally, left or right 

- **Given** I am on the edit recipe page
- **And** I grab the resizer on the bottom right of the description text box
- **When** I move the resizer left or right
- **Then** nothing happens
- **And** no API request is sent

### US-5.7 — Finalize Changes

#### Scenario: User clicks the `Update Recipe` button with correct values

- **Given** I am on the edit recipe page
- **When** I click the `Update Recipe` button 
- **Then** the API returns `200` with a payload containing [NEEDS CLARIFICATION: `recipeId`, `description`, `servings`,`isPublished`]
- **And** a message pops up saying `Recipe Successfully Updated`
- **And** I am redirected back to the recipe page 

#### Scenario: User clicks the `Update Recipe` button with incorrect values

- **Given** I am on the edit recipe page
- **When** I click the `Update Recipe` button
- **And** I have inputted incorrect values for any recipe attribute
- **Then** the API returns `400` with `{"message":"Invalid recipe recipeId, description, serving, time, or step"}`
- **And** I remain on the edit recipe page

### US-5.8 — View List of Ingredients

#### Scenario: User views recipe with ingredients

- **Given** I am on the edit recipe page
- **And** I look below the main recipe details tab
- **When** I view the list of ingredients in the ingredients tab
- **Then** I can view all the ingredients and their quantity, price, name, measurement, edit icon, and delete icon
- **And** no API request is sent

#### Scenario: User views recipe with no ingredients

- **Given** I am on the edit recipe page
- **And** I look below the main recipe details tab
- **When** I view the list of ingredients in the ingredients tab
- **And** I have no ingredients for the recipe I am editing
- **Then** I am prompted to add an ingredient
- **And** no API request is sent

### US-5.9 — Add New Ingredient 

#### Scenario: User clicks `Add` button in the ingredients table

- **Given** I am on the edit recipe page
- **And** I am viewing the ingredients tab
- **When** I click the `Add` button 
- **Then** a add modal pops up with input text for quantity and a drop down of the ingredient type
- **And** I enter ingredient data
- **And** no API request is sent

#### Scenario: User inputs a number into the quantity input text

- **Given** I am on the edit recipe page
- **And** I have click the `Add` ingredient button  
- **When** I add a number to the `quantity` input text
- **Then** the input text reflects the inputted number
- **And** no API request is sent

#### Scenario: User inputs a `NaN` into the quantity input text

- **Given** I am on the edit recipe page
- **And** I have clicked the `Add` ingredient button
- **When** I add a `NaN` value into the quantity input text
- **Then** once I click off or hit enter the data is erased from the value from the input text
- **And** no API request is sent

#### Scenario: User selects an ingredient from the drop down

- **Given** I am on the edit recipe page
- **And** I have clicked the `Add` ingredient button and clicked the ingredient dropdown
- **When** I select an ingredient from the list
- **Then** the dropdown shows the selected choice 
- **And** no API request is sent

#### Scenario: User inputs correct values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown

- **Given** I am on the edit recipe page
- **And** I have filled out the `Add Ingredient` modal correctly
- **When** I click the `Add Ingredient` button
- **Then** the API returns `200` with a payload containing [NEEDS CLARIFICATION: `ingredient`, `quantity`]
- **And** A message pops up saying "Successfully added ingredient"

#### Scenario: User inputs incorrect values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown

- **Given** I am on the edit recipe page
- **And** I have filled out the `Add Ingredient` modal incorrectly
- **When** I click the `Add Ingredient` button
- **Then** the API returns `401` with a message containing [NEEDS CLARIFICATION: "{"message": "Cannot add the ingredient a value was inputted incorrectly.}"]
- **And** A error message pops up saying "Could not add ingredient"

#### Scenario: User clicks the `Cancel` button

- **Given** I am on the edit recipe 
- **When** I click the `Cancel` button
- **Then** the modal is closed and all changed input values return to their original values
- **And** no API request is sent

### US-5.10 — Edit Ingredient 

#### Scenario: User clicks the edit icon button in the ingredients table

- **Given** I am on the edit recipe page
- **And** I am viewing the ingredients tab
- **When** I click the icon edit button 
- **Then** a edit ingredient modal pops up with input text for quantity and a drop down of the ingredient type
- **And** I enter ingredient data
- **And** no API request is sent

#### Scenario: User inputs a number into the quantity input text

- **Given** I am on the edit recipe page
- **And** I have click the edit ingredient icon button  
- **When** I add a number to the `quantity` input text
- **Then** the input text reflects the inputted number
- **And** no API request is sent

#### Scenario: User inputs a `NaN` into the quantity input text

- **Given** I am on the edit recipe page
- **And** I have clicked the edit ingredient icon button
- **When** I add a `NaN` value into the quantity input text
- **Then** once I click off or hit enter the data is erased from the value from the input text
- **And** no API request is sent

#### Scenario: User selects an ingredient from the drop down

- **Given** I am on the edit recipe page
- **And** I have clicked the edit ingredient icon button and clicked the ingredient dropdown
- **When** I select an ingredient from the list
- **Then** the dropdown shows the selected choice 
- **And** no API request is sent

#### Scenario: User inputs correct values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown

- **Given** I am on the edit recipe page
- **And** I have filled out the `Edit Ingredient` modal correctly
- **When** I click the `Update Ingredient` button
- **Then** the API returns `200` with a payload containing [NEEDS CLARIFICATION: `ingredient`, `quantity`]
- **And** a message pops up saying "Successfully updated ingredient"

#### Scenario: User inputs incorrect values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown

- **Given** I am on the edit recipe page
- **And** I have filled out the `Edit Ingredient` modal incorrectly
- **When** I click the `Update Ingredient` button
- **Then** the API returns `401` with a message containing [NEEDS CLARIFICATION: "{"message": "Cannot update the ingredient a value was inputted incorrectly.}"]
- **And** a message pops up saying "Could not update ingredient"

#### Scenario: User clicks the `Cancel` button

- **Given** I am on the edit recipe 
- **When** I click the `Cancel` button
- **Then** the modal is closed and all changed input values return to their original values
- **And** no API request is sent

### US-5.11 — Delete Ingredient

#### Scenario: User clicks delete icon button and successfully deletes the ingredient

- **Given** I am on the edit recipe page
- **And** I am viewing the ingredients tab
- **When** I click a ingredient's delete icon button 
- **Then** the API returns `200` with a payload of [NEEDS CLARIFICATION: {"message": "Successfully removed ingredient from recipe"}]
- **And** a message pops up saying "Ingredient removed"

#### Scenario: User clicks delete icon button and something goes wrong removing ingredient

- **Given** I am on the edit recipe page
- **And** I am viewing the ingredients tab
- **When** I click a ingredient's delete icon button
- **Then** the API returns `500` with {"message":"Could not remove the {ingredient_name} from {recipe_name}"}
- **And** a message pops up saying "Ingredient could not be removed" 

### US-5.12 — Add a Step to the recipe

#### Scenario: User clicks `Add` button in the recipe steps table

- **Given** I am on the edit recipe page
- **And** I am viewing the recipe steps tab
- **When** I click the `Add` button 
- **Then** a add modal pops up with input text for `Number`, input text for `Instruction` and a drop down of the `Ingredient` type
- **And** I enter step data
- **And** no API request is sent

#### Scenario: User inputs a number into the `Number` input text

- **Given** I am on the add recipe step modal
- **And** I have click the `Add` button  
- **When** I add a number to the `Number` input text
- **Then** the input text reflects the inputted number
- **And** no API request is sent

#### Scenario: User inputs a `NaN` into the `Number` input text

- **Given** I am on the add recipe step modal
- **And** I have clicked the `Add` step button
- **When** I add a `NaN` value into the `Number` input text
- **Then** once I click off or hit enter the data is erased from the value from the input text
- **And** no API request is sent

#### Scenario: User inputs the instruction for `Instruction` input text

- **Given** I am on the add recipe step modal
- **And** I have click the `Add` button  
- **When** I add text to the `Instruction` input text
- **Then** the input text reflects the input
- **And** no API request is sent

#### Scenario: User does not input anything into `Instruction` input text

- **Given** I am on the add recipe step modal
- **And** I have clicked the `Add` step button
- **When** I add nothing to `Instruction` input text
- **Then** nothing changes and the input text is empty
- **And** no API request is sent

#### Scenario: User selects an ingredient from the `Ingredients` dropdown

- **Given** I am on the add recipe step modal
- **And** I have clicked the `Add` ingredient button and clicked the ingredients dropdown
- **When** I select one or more ingredients from the `Ingredients tab`
- **Then** the dropdown shows the selected choice(s)
- **And** no API request is sent

#### Scenario: User does not select an ingredient from the `Ingredients` dropdown

- **Given** I am on the add recipe step modal
- **And** I have clicked the `Add` ingredient button and clicked the ingredients dropdown
- **When** I leave the ingredients dropdown as empty
- **Then** nothing changes in the dropdown
- **And** no API request is sent

#### Scenario: User inputs correct values into `Number` input text

- **Given** I am on the add recipe step modal
- **And** I have filled out the `Add Step` modal correctly
- **When** I click the `Add Step` button
- **Then** the API returns `200` with a payload containing [NEEDS CLARIFICATION: `number`, `instruction`, `ingredients`]
- **And** A message pops up saying "Successfully added step"

#### Scenario: User inputs incorrect values into `Number` input text

- **Given** I am on the add recipe step modal
- **And** I have filled out the `Add Step` modal incorrectly
- **When** I click the `Add Step` button
- **Then** the API returns `401` with a message containing [NEEDS CLARIFICATION: "{"message": "Cannot add the step number was inputted incorrectly"}"]
- **And** A error message pops up saying "Could not add step"

#### Scenario: User clicks the `Cancel` button

- **Given** I am on the add recipe step modal 
- **When** I click the `Cancel` button
- **Then** the modal is closed and all changed input values return to their original values
- **And** no API request is sent


### US-5.13 — Edit a Step to the recipe

#### Scenario: User clicks edit icon button on one of the steps in the recipe steps table

- **Given** I am on the edit recipe page
- **And** I am viewing the recipe steps tab
- **When** I click the edit recipe step icon button 
- **Then** a edit modal pops up with input text for `Number`, input text for `Instruction` and a drop down of the `Ingredient` type
- **And** I enter step data
- **And** no API request is sent

#### Scenario: User inputs a number into the `Number` input text

- **Given** I am on the edit recipe step modal
- **And** I have clicked the edit recipe step icon button  
- **When** I edit the number in the `Number` input text
- **Then** the input text reflects the inputted number
- **And** no API request is sent

#### Scenario: User inputs a `NaN` into the `Number` input text

- **Given** I am on the edit recipe step modal
- **And** I have clicked the edit recipe step icon button
- **When** I add a `NaN` value into the `Number` input text
- **Then** once I click off or hit enter the data is erased from the value from the input text
- **And** no API request is sent

#### Scenario: User inputs the instruction for `Instruction` input text

- **Given** I am on the add recipe step modal
- **And** I have click the edit recipe step icon button  
- **When** I add text to the `Instruction` input text
- **Then** the input text reflects the input
- **And** no API request is sent

#### Scenario: User does not input anything into `Instruction` input text

- **Given** I am on the edit recipe step modal
- **And** I have clicked the edit recipe step button
- **When** I add nothing to `Instruction` input text
- **Then** nothing changes and the input text is empty
- **And** no API request is sent

#### Scenario: User selects an ingredient from the `Ingredients` dropdown

- **Given** I am on the edit recipe step modal
- **And** I have clicked the edit recipe step icon button and clicked the ingredients dropdown
- **When** I select one or more ingredients from the `Ingredients tab`
- **Then** the dropdown shows the selected choice(s)
- **And** no API request is sent

#### Scenario: User does not select an ingredient from the `Ingredients` dropdown

- **Given** I am on the edit recipe step modal
- **And** I have clicked the edit recipe step modal icon button and clicked the ingredients dropdown
- **When** I leave the ingredients dropdown as empty
- **Then** nothing changes in the dropdown
- **And** no API request is sent

#### Scenario: User inputs correct values into `Number` input text

- **Given** I am on the edit recipe step modal
- **And** I have filled out the `Edit Step` modal correctly
- **When** I click the `Update Step` button
- **Then** the API returns `200` with a payload containing [NEEDS CLARIFICATION: `number`, `instruction`, `ingredients`]
- **And** A message pops up saying "Successfully updated step"

#### Scenario: User inputs incorrect values into `Number` input text

- **Given** I am on the edit recipe step modal
- **And** I have filled out the `Edit Step` modal incorrectly
- **When** I click the `Update Step` button
- **Then** the API returns `401` with a message containing [NEEDS CLARIFICATION: "{"message": "Cannot add the step number was inputted incorrectly"}"]
- **And** A error message pops up saying "Could not update step"

#### Scenario: User clicks the `Cancel` button

- **Given** I am on the edit recipe step modal 
- **When** I click the `Cancel` button
- **Then** the modal is closed and all changed input values return to their original values
- **And** no API request is sent

### US-5.14 — View All Steps in Chronological Order

#### Scenario: User adds a new step to the recipe with `Number` in chronological order

- **Given** I am on the edit recipe page 
- **And** I am viewing the recipe steps tab
- **When** I add a new step 
- **Then** the steps list adds the new step to the bottom of the list
- **And** no API request is sent

#### Scenario: User adds a new step with `Number` out of chronological order

- **Given** I am on the edit recipe page
- **And** I am viewing the recipe steps tab
- **When** I add a new step
- **Then** the steps list is sorted by `Number` ascending
- **And** no API request is sent

#### Scenario: User adds a new recipe step with a duplicate `Number` step 

- **Given** I am on the edit recipe page
- **And** I am viewing the recipe steps tab
- **When** I add a new recipe step with a duplicate `Number`
- **Then** the list sorts by `Number` with duplicates following each other 
- **And** no API request is sent 

#### Scenario: User edits a recipe step with the `Number` changed out of chronological order

- **Given** I am on the edit recipe page
- **And** I am viewing the recipe steps tab
- **When** I edit a recipe step
- **Then** the steps list is sorted by `Number` ascending
- **And** no API request is sent

#### Scenario: User edits a recipe step with a duplicate `Number` step 

- **Given** I am on the edit recipe page
- **And** I am viewing the recipe steps tab
- **When** I edit a recipe step with a duplicate `Number`
- **Then** the list sorts by `Number` with duplicates following each other 
- **And** no API request is sent 



---

## Test Coverage Map

Each scenario above must map to at least one automated test. `it` names must match the Gherkin **Scenario** titles exactly.

| Story | Scenario | Test file | Test name |
|-------|----------|-----------|-----------|
| US-5.1 | User edits recipe name | `frontend/tests/EditRecipe.test.js` | `User edits recipe name` |
| US-5.2 | User changes the number of servings with a number | `frontend/tests/EditRecipe.test.js` | `User changes the number of servings with a number` |
| US-5.2 | User changes the number of servings with a NaN value | `frontend/tests/EditRecipe.test.js` | `User changes the number of servings with a NaN value` |
| US-5.3 | User changes the time to make (in minutes) to a number | `frontend/tests/EditRecipe.test.js` | `User changes the time to make (in minutes) to a number` |
| US-5.3 | User changes the time to make (in minutes) to a NaN | `frontend/tests/EditRecipe.test.js` | `User changes the time to make (in minutes) to a NaN` |
| US-5.4 | User toggles the publish recipe switch | `frontend/tests/EditRecipe.test.js` | `User toggles the publish recipe switch` |
| US-5.5 | User changes the recipe description | `frontend/tests/EditRecipe.test.js` | `User changes the recipe description` |
| US-5.6 | User grabs the resizer and moves it vertically, up or down | `frontend/tests/EditRecipe.test.js` | `User grabs the resizer and moves it vertically, up or down` |
| US-5.6 | User grabs the resizer and moves it horizontally, left or right | `frontend/tests/EditRecipe.test.js` | `User grabs the resizer and moves it horizontally, left or right` |
| US-5.7 | User clicks the `Update Recipe` button with correct values | `backend/tests/recipes.test.js` | `User clicks the \`Update Recipe\` button with correct values` |
| US-5.7 | User clicks the `Update Recipe` button with correct values | `frontend/tests/EditRecipe.test.js` | `User clicks the \`Update Recipe\` button with correct values` |
| US-5.7 | User clicks the `Update Recipe` button with incorrect values | `backend/tests/recipes.test.js` | `User clicks the \`Update Recipe\` button with incorrect values` |
| US-5.7 | User clicks the `Update Recipe` button with incorrect values | `frontend/tests/EditRecipe.test.js` | `User clicks the \`Update Recipe\` button with incorrect values` |
| US-5.8 | User views recipe with ingredients | `frontend/tests/EditRecipe.test.js` | `User views recipe with ingredients` |
| US-5.8 | User views recipe with no ingredients | `frontend/tests/EditRecipe.test.js` | `User views recipe with no ingredients` |
| US-5.9 | User clicks `Add` button in the ingredients table | `frontend/tests/EditRecipe.test.js` | `User clicks \`Add\` button in the ingredients table` |
| US-5.9 | User inputs a number into the quantity input text | `frontend/tests/EditRecipe.test.js` | `User inputs a number into the quantity input text` |
| US-5.9 | User inputs a `NaN` into the quantity input text | `frontend/tests/EditRecipe.test.js` | `User inputs a \`NaN\` into the quantity input text` |
| US-5.9 | User selects an ingredient from the drop down | `frontend/tests/EditRecipe.test.js` | `User selects an ingredient from the drop down` |
| US-5.9 | User inputs correct values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown | `backend/tests/recipeIngredients.test.js` | `User inputs correct values into \`Quantity\` text input and selects a \`Ingredient\` from the ingredient dropdown` |
| US-5.9 | User inputs correct values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown | `frontend/tests/EditRecipe.test.js` | `User inputs correct values into \`Quantity\` text input and selects a \`Ingredient\` from the ingredient dropdown` |
| US-5.9 | User inputs incorrect values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown | `backend/tests/recipeIngredients.test.js` | `User inputs incorrect values into \`Quantity\` text input and selects a \`Ingredient\` from the ingredient dropdown` |
| US-5.9 | User inputs incorrect values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown | `frontend/tests/EditRecipe.test.js` | `User inputs incorrect values into \`Quantity\` text input and selects a \`Ingredient\` from the ingredient dropdown` |
| US-5.9 | User clicks the `Cancel` button | `frontend/tests/EditRecipe.test.js` | `User clicks the \`Cancel\` button` |
| US-5.10 | User clicks the edit icon button in the ingredients table | `frontend/tests/EditRecipe.test.js` | `User clicks the edit icon button in the ingredients table` |
| US-5.10 | User inputs a number into the quantity input text | `frontend/tests/EditRecipe.test.js` | `User inputs a number into the quantity input text` |
| US-5.10 | User inputs a `NaN` into the quantity input text | `frontend/tests/EditRecipe.test.js` | `User inputs a \`NaN\` into the quantity input text` |
| US-5.10 | User selects an ingredient from the drop down | `frontend/tests/EditRecipe.test.js` | `User selects an ingredient from the drop down` |
| US-5.10 | User inputs correct values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown | `backend/tests/recipeIngredients.test.js` | `User inputs correct values into \`Quantity\` text input and selects a \`Ingredient\` from the ingredient dropdown` |
| US-5.10 | User inputs correct values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown | `frontend/tests/EditRecipe.test.js` | `User inputs correct values into \`Quantity\` text input and selects a \`Ingredient\` from the ingredient dropdown` |
| US-5.10 | User inputs incorrect values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown | `backend/tests/recipeIngredients.test.js` | `User inputs incorrect values into \`Quantity\` text input and selects a \`Ingredient\` from the ingredient dropdown` |
| US-5.10 | User inputs incorrect values into `Quantity` text input and selects a `Ingredient` from the ingredient dropdown | `frontend/tests/EditRecipe.test.js` | `User inputs incorrect values into \`Quantity\` text input and selects a \`Ingredient\` from the ingredient dropdown` |
| US-5.10 | User clicks the `Cancel` button | `frontend/tests/EditRecipe.test.js` | `User clicks the \`Cancel\` button` |
| US-5.11 | User clicks delete icon button and successfully deletes the ingredient | `backend/tests/recipeIngredients.test.js` | `User clicks delete icon button and successfully deletes the ingredient` |
| US-5.11 | User clicks delete icon button and successfully deletes the ingredient | `frontend/tests/EditRecipe.test.js` | `User clicks delete icon button and successfully deletes the ingredient` |
| US-5.11 | User clicks delete icon button and something goes wrong removing ingredient | `backend/tests/recipeIngredients.test.js` | `User clicks delete icon button and something goes wrong removing ingredient` |
| US-5.11 | User clicks delete icon button and something goes wrong removing ingredient | `frontend/tests/EditRecipe.test.js` | `User clicks delete icon button and something goes wrong removing ingredient` |
| US-5.12 | User clicks `Add` button in the recipe steps table | `frontend/tests/EditRecipe.test.js` | `User clicks \`Add\` button in the recipe steps table` |
| US-5.12 | User inputs a number into the `Number` input text | `frontend/tests/EditRecipe.test.js` | `User inputs a number into the \`Number\` input text` |
| US-5.12 | User inputs a `NaN` into the `Number` input text | `frontend/tests/EditRecipe.test.js` | `User inputs a \`NaN\` into the \`Number\` input text` |
| US-5.12 | User inputs the instruction for `Instruction` input text | `frontend/tests/EditRecipe.test.js` | `User inputs the instruction for \`Instruction\` input text` |
| US-5.12 | User does not input anything into `Instruction` input text | `frontend/tests/EditRecipe.test.js` | `User does not input anything into \`Instruction\` input text` |
| US-5.12 | User selects an ingredient from the `Ingredients` dropdown | `frontend/tests/EditRecipe.test.js` | `User selects an ingredient from the \`Ingredients\` dropdown` |
| US-5.12 | User does not select an ingredient from the `Ingredients` dropdown | `frontend/tests/EditRecipe.test.js` | `User does not select an ingredient from the \`Ingredients\` dropdown` |
| US-5.12 | User inputs correct values into `Number` input text | `backend/tests/recipeSteps.test.js` | `User inputs correct values into \`Number\` input text` |
| US-5.12 | User inputs correct values into `Number` input text | `frontend/tests/EditRecipe.test.js` | `User inputs correct values into \`Number\` input text` |
| US-5.12 | User inputs incorrect values into `Number` input text | `backend/tests/recipeSteps.test.js` | `User inputs incorrect values into \`Number\` input text` |
| US-5.12 | User inputs incorrect values into `Number` input text | `frontend/tests/EditRecipe.test.js` | `User inputs incorrect values into \`Number\` input text` |
| US-5.12 | User clicks the `Cancel` button | `frontend/tests/EditRecipe.test.js` | `User clicks the \`Cancel\` button` |
| US-5.13 | User clicks edit icon button on one of the steps in the recipe steps table | `frontend/tests/EditRecipe.test.js` | `User clicks edit icon button on one of the steps in the recipe steps table` |
| US-5.13 | User inputs a number into the `Number` input text | `frontend/tests/EditRecipe.test.js` | `User inputs a number into the \`Number\` input text` |
| US-5.13 | User inputs a `NaN` into the `Number` input text | `frontend/tests/EditRecipe.test.js` | `User inputs a \`NaN\` into the \`Number\` input text` |
| US-5.13 | User inputs the instruction for `Instruction` input text | `frontend/tests/EditRecipe.test.js` | `User inputs the instruction for \`Instruction\` input text` |
| US-5.13 | User does not input anything into `Instruction` input text | `frontend/tests/EditRecipe.test.js` | `User does not input anything into \`Instruction\` input text` |
| US-5.13 | User selects an ingredient from the `Ingredients` dropdown | `frontend/tests/EditRecipe.test.js` | `User selects an ingredient from the \`Ingredients\` dropdown` |
| US-5.13 | User does not select an ingredient from the `Ingredients` dropdown | `frontend/tests/EditRecipe.test.js` | `User does not select an ingredient from the \`Ingredients\` dropdown` |
| US-5.13 | User inputs correct values into `Number` input text | `backend/tests/recipeSteps.test.js` | `User inputs correct values into \`Number\` input text` |
| US-5.13 | User inputs correct values into `Number` input text | `frontend/tests/EditRecipe.test.js` | `User inputs correct values into \`Number\` input text` |
| US-5.13 | User inputs incorrect values into `Number` input text | `backend/tests/recipeSteps.test.js` | `User inputs incorrect values into \`Number\` input text` |
| US-5.13 | User inputs incorrect values into `Number` input text | `frontend/tests/EditRecipe.test.js` | `User inputs incorrect values into \`Number\` input text` |
| US-5.13 | User clicks the `Cancel` button | `frontend/tests/EditRecipe.test.js` | `User clicks the \`Cancel\` button` |
| US-5.14 | User adds a new step to the recipe with `Number` in chronological order | `frontend/tests/EditRecipe.test.js` | `User adds a new step to the recipe with \`Number\` in chronological order` |
| US-5.14 | User adds a new step with `Number` out of chronological order | `frontend/tests/EditRecipe.test.js` | `User adds a new step with \`Number\` out of chronological order` |
| US-5.14 | User adds a new recipe step with a duplicate `Number` step | `frontend/tests/EditRecipe.test.js` | `User adds a new recipe step with a duplicate \`Number\` step` |
| US-5.14 | User edits a recipe step with the `Number` changed out of chronological order | `frontend/tests/EditRecipe.test.js` | `User edits a recipe step with the \`Number\` changed out of chronological order` |
| US-5.14 | User edits a recipe step with a duplicate `Number` step | `frontend/tests/EditRecipe.test.js` | `User edits a recipe step with a duplicate \`Number\` step` |

---

## Agent implementation request

Copy when asking Cursor to implement this feature (`@` this file):

```text
Implement Feature 5 from @features/feature-5-recipe-details-management.md on branch `feature/5-recipe-details-management`.

Follow layer order in @features/framework.md (models → routes → backend tests → frontend → frontend tests).
Map every Gherkin scenario in the Test Coverage Map; run `npm test` before finishing.
If API routes, payloads, schema, or product rules changed per this spec, update @features/reference/api.md, @features/reference/data-model.md, and/or @features/reference/behavior.md in the same PR to match shipped code.
Complete Definition of Done and the merge checklist in @features/framework.md.
Do not implement behavior not in this spec.
```

**Reference updates for this feature:** `features/reference/api.md`, `features/reference/data-model.md`, `features/reference/behavior.md`

---

## Definition of Done

*   [ ] Backend and frontend implemented per this spec (**FR-00N** satisfied)
*   [ ] **Success Criteria (SC-00N)** met
*   [ ] All mapped tests pass (`npm test`)
*   [ ] Test Coverage Map complete
*   [ ] `features/reference/data-model.md` updated (if schema changed)
*   [ ] `features/reference/api.md` updated (if API changed)
*   [ ] `features/reference/behavior.md` updated (if product rules changed)

---

## Out of Scope

*   Creating, listing, publishing-browse, and deleting recipes ([Feature 4](./feature-4-recipe-management.md))
*   Ingredient catalog create / update / delete (`/ingredients`)
*   Registration, login, and logout
*   Recipe PDF export from recipe cards
*   Adding a new catalog ingredient from the edit-recipe dialog (dropdown is catalog-only)
*   Wipe-all endpoints (`DELETE /recipeapi/recipeIngredients/`, `DELETE /recipeapi/recipeSteps/`, `DELETE /recipeapi/recipes/`)


