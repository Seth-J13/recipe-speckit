# Feature: Create, Read, and Delete Recipes

**Feature ID:** 4  
**Branch pattern:** `feature/4-CR-recipes`  
**Status:** Draft  
**Created:** 2026-09-12  
**Input:** Signed-in users manage private named recipes on one dashboard view; new recipes are added in a dialogue; signed-out users see published, un-editable recipes  
**Depends on:** [Feature 1 -- Menu Bar](feature-1-menu-bar.md), [Feature 2 -- User Authentication](feature-2-user-auth.md) <-- (omit if none)  
**Related:** `features/references...`, [ADR-NNNN](../docs/adr/NNNN-title.md) <-- optional

---

## User Stories

### US-4.1: Add Recipe

**As a** signed in User  
**I want to** create named recipes (e.g. "Dave's Hot Chicken")  
**So that** I can add them to my recipes list

**Priority:** P1  
**Independent test:** Open add-recipe dialog, create a recipe, it appears in the recipes view  
**Acceptance scenarios:** see ### US-4.1 under Acceptance Criteria

### US-4.2: View Recipes

**As** any user  
**I want** my authentication state to determine what recipes I can see in the recipe list view
**So that** I can only see the recipes I'm allowed to see

**Priority:** P1  
**Independent test:** Dashboard loads a single list of recipes (no sidebar split), each recipe belongs to one card  
**Acceptance scenarios:** see ### US-4.2 under Acceptance Criteria

### US-4.3: See Recipe Details

**As** any user  
**I want to** see the details of a recipe like **Name**, **Servings**, and **Time to make (in minutes)**  
**So that** I can read/manage them without changing screens

**Priority:** P1
**Independent test:** Card shows bolded details from **I want to** by default, expands to show **Ingredients** and **Steps** when interacted  
**Acceptance scenarios:** see ### US-4.3 under Acceptance Criteria

### US-4.4: Manage Recipe List

**As** any user  
**I want** each Recipe to show an **Actions** row containing the **Export-as-PDF**, **Edit**, and **Delete** actions depending on my authentication state
**So that** I can make changes to my recipe in another view

**Priority:** P2  
**Independent test:** Each entry exposes Export-as-PDF, Edit, and Delete actions in both default and expanded states of interaction in this Recipes view  
**Acceptance scenarios:** see ### US-4.4 under Acceptance Criteria

### US-4.5: Export Option

**As** any User (authenticated or not authenticated)  
**I want** to be able to **Export-as-PDF** on any recipes appropriately shown in the Recipes view  
**So that** I can download a PDF version of the selected recipe (see file `./subfeature-4-1-pdf-export.md`)

**Priority:** P3  
**Independent test:** Each entry exposes Export-as-PDF in both expanded and default states of interaction on this view; picking Export-as-PDF downloads a PDF containing the Recipe name, its description, its serving number, its completion time (in minutes), its list of ingredients, and all its steps/instructions.  
**Acceptance scenarios:** see ### US-4.5 under Acceptance Criteria

### US-4.6: Delete Recipe

**As a** signed-in user  
**I want to** be able to delete my recipes  
**So that** I can remove unwanted recipes from my list

**Priority:** P2  
**Independent test:** Select **Delete** icon, recipe is removed from database, recipe no longer appears in view  
**Acceptance scenarios:** see ### US-4.6 under Acceptance Criteria

---

## Requirements

### Functional Requirements

- **FR-001**: A valid session (`authenticate` middleware) on this view shows only the current user's published and unpublished recipes.
- **FR-002**: A lack of a session on this view shows every user's published recipes.
- **FR-003**: PUT, POST, and DELETE requests to /recipeapi/recipes/ and /recipeapi/recipes/:id MUST require authenticate.
- **FR-004**: GET /recipeapi/recipes/user/:userId MUST require authenticate.
- **FR-005**: GET /recipeapi/recipes and GET /recipeapi/recipes/:id MUST NOT require a session.
- **FR-006**: A recipe MUST belong to exactly one user for its entire lifetime; ownership MUST never change.
- **FR-007**: Every database update, and delete MUST include `userId: req.user.id` in the `where` clause.
- **FR-008**: On create, `userId` MUST be set from `req.user.id` only — ignore or strip any `userId` in the request body.
- **FR-009**: Recipe names MUST be trimmed before save; empty strings MUST be rejected.
- **FR-010**: Recipes MUST be ordered alphabetically by name in API responses.
- **FR-011**: All visible recipes MUST contain an Export-as-PDF icon which downloads a PDF version of the recipe.
- **FR-012**: This feature MUST deliver recipe CRUD and a **single-view** recipes UI in `Dashboard.vue` (dialog-based add). No sidebar/main split. Recipe **Editing View** is Feature 5. CRUD **Ingredients** is Feature 3.
- **FR-013**: Only authenticated users see the `edit` and `delete` options listed
- **FR-014**: Selecting the `edit` icon on a Recipe card takes an authenticated user to the /recipe/:id view where `id` is the id of the recipe which that user owns

---

## Assumptions

- Feature 1 menu bar, feature 2 user auth, and session handling MUST be merged to `dev` before implementing this feature
- Recipe adding uses **dialog-based** workflows (no split sidebar / main panel)
- There is no modal or dialogue to confirm a recipe deletion
- Recipe editing is outside the scope of this feature

## Edge Cases

- All Recipe creation fields empty in dialog → cancel operation and close dialogue
- One or more recipe creation fields empty in dialog but not all → confirmation button disabled
- Empty or whitespace-only Recipe name → confirmation button disabled.
- Invalid recipeId → `400`; unowned recipe → `404`.
- Unauthenticated dashboard or `GET /recipeapi/recipes` → show all published recipes from all users instead
- Duplicate / invalid input → `422` with helpful message beneath field where duplicate/invalid input is present

## Success Criteria

- **SC-001**: Every Gherkin scenario has at least one automated test before merge.
- **SC-002**: Signed-in user can export, view, and delete owned recipes on one screen without seeing other users' data.
- **SC-003**: Signed-in user can create new recipes on the same screen as `SC-002`.
- **SC-004**: Signed-out user can export and view all published recipes from all users on the same screen as `SC-002`.
- **SC-005**: `npm test` passes for recipe API and dashboard recipes-view behavior.

---

## Data Ownership & Isolation (foundation)

Each user owns their recipes exclusively. Another authenticated user must not be able to view, rename, or delete them.
Unauthenticated users (guests) may view all users' published recipes.

- Each user account is a separate tenant boundary for recipes.
- No API in this feature returns another user's profile or session.
- Later features must never expose unpublished recipes across users — not in recipe responses, detail views, or error messages that confirm another user's unpublished resource exists.

Each user owns their lists exclusively. Another authenticated user must not be able to view, rename, or delete them.

| Rule                  | Requirement                                                                                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Read scope**        | Authenticated `GET /recipeapi/recipes` returns only recipes where `userId = req.user.id`. Unauthenticated `GET /recipeapi/recipes` returns recipes where `isPublished = true`. |
| **Write scope**       | `PUT` and `DELETE` apply only when the recipe row matches both `id` and `req.user.id`.                                                                                         |
| **Create scope**      | New recipes are always owned by the authenticated user.                                                                                                                        |
| **Cross-user access** | If a recipe belongs to another user, respond with `404` — never `403` (do not confirm the list exists).                                                                        |
| **UI scope**          | The recipes view shows only recipes returned by `GET /recipeapi/recipes`.                                                                                                      |
| **Implementation**    | Use a shared helper (e.g. `getAccessibleRecipeOrNull(req, recipeId)`) in `app/authorization/` — do not duplicate scope logic in controllers.                                   |

---

## API Requirements

| Method   | Endpoint                       | Auth | Purpose                                                                                                |
| -------- | ------------------------------ | ---- | ------------------------------------------------------------------------------------------------------ |
| `GET`    | `/recipeapi/recipes`           | No   | Fetch all recipes for the authenticated user; Fetch all published recipes for the unauthenticated user |
| `POST`   | `/recipeapi/recipes`           | Yes  | Create a new list                                                                                      |
| `PUT`    | `/recipeapi/recipes/:recipeId` | Yes  | Update a list                                                                                          |
| `DELETE` | `/recipeapi/recipes/:recipeId` | Yes  | Delete a list owned by the caller                                                                      |

Unpublished recipes are visible only to their owner. Authenticated owner-scoped endpoints
return only the current user's recipes; access to another user's unpublished recipe returns `404`.
Published recipes are readable by anyone without a session via `GET /recipeapi/recipes`
and `GET /recipeapi/recipes/:id` (HTTP 200). Those public reads MUST never include
unpublished recipes.

**Create recipe request body:**

```json
{
  "id": 2,
  "name": "name",
  "description": "description",
  "servings": 2,
  "time": 30,
  "isPublished": false,
  "userId": 2
}
```

**Recipe success response** (`200` / `201`):

```json
{
  "id": 2,
  "name": "name",
  "description": "description",
  "servings": 2,
  "time": 30,
  "isPublished": false,
  "userId": 2,
  "updatedAt": "2026-09-14T14:28:04.080Z",
  "createdAt": "2026-09-14T14:28:04.080Z"
}
```

**Error response:** `{ "message": "Human-readable explanation." }` with appropriate HTTP status.  
**Not found / not owned:** `404` (do not use `403`).

---

## Screen Requirements

### [View: Application Dashboard] — route name `home`

Replaces the Feature 2 placeholder home page. **Single Vue view** (`Dashboard.vue`) — no sidebar / main-panel split.

**Recipes view (this feature)**

- Heading: **Recipes**
- Primary action: **NEW** opens a `<v-dialog>` with a name `<v-text-field>` and **Create** / **Cancel**. Use class `oc-cta` on **Create** and **NEW** (per [ui-style-system.mdc](../../.cursor/rules/ui-style-system.mdc)).
- Display owned recipes as cards (e.g. `<v-card>`): each row shows the **Recipe Name** and icon actions:
  - **PDF** icon — exports the selected recipe as a pdf file and opens a file picker window to save to a location
  - **Edit** icon — changes URI to `/recipe/:id` where `:id` is the recipeId of the selected card
  - **Delete** icon — sends a delete request to the `/recipeapi/recipes/:id` where `:id` is the recipeId of the selected card
- Icon-only row actions use `size="small"` and accessible `aria-label`s (**Export-as-PDF**, **Edit Recipe**, **Delete Recipe**).
- **Empty state:** **"No Recipes yet. Create your first Recipe."** when the user has zero lists.
- **Loading state:** skeleton or progress indicator while lists are fetching.
- **Error state:** `<v-alert type="error">` for API failures.

**Implementation note:** one route/view for recipes; recipe create and read dialogs are child components or inline `<v-dialog>` blocks in `Dashboard.vue` unless the team splits presentational dialogs later.

---

## Key Entities

- **User**: registered account (firstname, lastname, email, password); owns future recipes.
- **Session**: server-side record tying a JWT token to a user; expires after 24 hours.

---

## Data Model Requirements

### `recipes` table

| Field         | Type         | Rules                      |
| ------------- | ------------ | -------------------------- |
| `id`          | INTEGER PK   | Auto-increment             |
| `name`        | VARCHAR(100) | Nullable                   |
| `description` | VARCHAR(255) | Nullable                   |
| `servings`    | INTEGER      | Required                   |
| `time`        | DATETIME     | Required                   |
| `isPublished` | TINYINT(1)   | Required                   |
| `createdAt`   | DATETIME     | Default CURRENT_TIMESTAMP  |
| `updatedAt`   | DATETIME     | Default CURRENT_TIMESTAMP  |
| `userId`      | INTEGER      | Foreign Key to users table |

---

## Acceptance Criteria (Gherkin)

### US-4.1: Add Recipe

#### Scenario: open add modal

- **Given** I am authenticated and am viewing the Recipes view
- **When** I interact with the `NEW` button
- **Then** The `Add Recipe` modal appears in the center of the screen
- **And** I can see the title `Add Recipe` in the `Add Recipe` modal
- **And** I can see a text input field called `Name`
- **And** I can see an integer input field called `Number of Servings` whose default is 2
- **And** I can see an integer input field called `Time to make (in minutes)` whose default is 30
- **And** I can see a text area field called `Description`
- **And** I can see a toggle switch labeled `Publish?` whose default is set to `No` (off)
- **And** I can see `CLOSE` and `ADD RECIPE` buttons
- **And** the view behind the modal is dimmed until the modal closes

#### Scenario: Serving/Time input field details

- **Given** I am viewing the `Add Recipe` modal
- **When** I hover over or select the `Number of Servings` or `Time to make (in minutes)` input fields
- **Then** I can either click up or down arrows to the right of the field to increment or decrement the value inside the field respectively or input an integer myself
- **And** the incremented or decremented values reflect realtime in the values of the input field

#### Scenario: Publish toggle

- **Given** I am viewing the `Add Recipe` modal
- **When** I interact with the `Publish?` toggle switch anywhere in its element
- **Then** the toggle switch switches to `Yes` (on) if it was previously off
- **And** the toggle switch switches to `No` (off) if it was previously on
- **And** the state of the switch (`Yes`/`No`) is shown to the right of the word `Publish?`

#### Scenario: Close button cancels operation

- **Given** I am viewing the `Add Recipe` modal
- **When** I press the `CLOSE` button
- **Then** all the input fields are cleared
- **And** the `Add Recipe` modal closes
- **And** no requests are sent to the API

#### Scenario: Field validation

- **Given** I am viewing the `Add Recipe` modal
- **When** I press the `ADD RECIPE` button
- **And** either the `Number of Servings` or the `Time to make (in minutes)` integer field is empty
- **Then** all the input fields are cleared
- **And** the `Add Recipe` modal closes
- **And** no requests are sent to the API

#### Scenario: Add button confirms operation

- **Given** I am viewing the `Add Recipe` modal
- **When** I press the `ADD RECIPE` button
- **And** all integer fields and text areas have valid input
- **Then** a `PUT` request is sent to the API whose body contains the data from the `Add Recipe` modal and whose format follows the **Create recipe request body**
- **And** the `Add Recipe` modal closes
- **And** the list of Recipe cards refreshes without the window/page refreshing

#### Scenario: Enforce modal focus

- **Given** I am viewing the `Add Recipe` modal
- **When** I interact with anything outside the `Add Recipe` modal
- **Then** the `Add Recipe` modal bounces once to enforce that it must continue being interacted with
- **And** the `Add Recipe` modal MUST not close unless the `CLOSE` button is interacted with

### US-4.2: View Recipes

#### Scenario: See list (signed in)

- **Given** I am a user who has successfully authenticated
- **When** I view the recipes list view
- **Then** I see ONLY a list of recipe cards I OWN
- **And** I see NO recipes owned by anyone else
- **And** I MUST NOT see published recipes owned by any user besides ones with my `userId`
- **And** requests to `GET` unpublished recipes from any other `userId` returns `404 NOT FOUND` and MUST NOT return code `403`
- **And** all the recipe cards MUST NEVER overlap

#### Scenario: See list (signed out)

- **Given** I am a user who has not authenticated
- **When** I view the recipes list view
- **Then** I see ONLY a list of recipe cards who are published
- **And** I MUST NOT see any unpublished recipes
- **And** requests to `GET` unpublished recipes returns `404 NOT FOUND` and MUST NOT return code `403`
- **And** all the recipe cards MUST NEVER overlap

### US-4.3: See Recipe Details

#### Scenario: Always-present recipe details

- **Given** I am any user (authenticated or unauthenticated)
- **When** I view the recipes list view
- **Then** all the recipes I see contain **Recipe Name**, **# Servings**, and **Time to make (in minutes)** information on the left inside the recipe card

#### Scenario: Expanded recipe card

- **Given** I am any user (authenticated or unauthenticated)
- **When** I interact with a recipe card in its default state
- **Then** the recipe card expands vertically downward to show its list of **Recipe Steps** and **Ingredients**
- **And** the **Ingredients** form a list in the format '**[number of units] [unit name][`s` if > 1]** of [ingredient name] $[price per unit]/[unit name]'
- **And** the **Steps** form a table with the columns **Step** (number), **Instruction**, and **Ingredients**
- **And** the **Steps** table headers are shown even if there are no steps present
- **And** the **Ingredients** list is shown before the **Steps** list

#### Scenario: Shrink recipe card

- **Given** I am any user (authenticated or unauthenticated)
- **When** I interact with a recipe card in its expanded state
- **Then** the recipe card shrinks vertically
- **And** only its default information from scenario `Always-present recipe details` is shown

### US-4.4: Manage Recipe List

#### Scenario: Actions on Recipe Card (signed-in)

- **Given** I am an authenticated user
- **When** I view the recipes list view
- **Then** **Export-as-PDF**, **Delete**, and **Edit** action icons are shown inside the recipe card
- **And** they appear in both default and expanded states of interaction
- **And** they are in a single row on the right side of the recipe card

#### Scenario: Select edit icon

- **Given** I am an authenticated user
- **When** I select the **Edit** action icon on a card I own
- **Then** I am taken to the `/recipe/:id` URI/view where `:id` is the id of the recipe (defer this view's details to Feature 5)

#### Scenario: Actions on Recipe Card (signed-out)

- **Given** I am an unauthenticated user
- **When** I view the recipes list view
- **Then** only the **Export-as-PDF** action icon is shown inside the recipe card
- **And** it appears in both default and expanded states of interaction
- **And** it is on the right side of the recipe card

### US-4.5: Export Option

#### Scenario: export-to-pdf icon selected

- **Given** I am a signed-in user viewing my list of owned recipes
- **When** I select the **Export-as-PDF** icon
- **Then** a PDF file is generated via [story 4.9 -- pdf-export](story-4-9-pdf-export.md) information
- **And** a file-picker dialog opens to download this generated PDF to my computer
- **And** this file's default name is `recipeReport.pdf`
- **And** the view behind the file-picker is dimmed until the file-picker closes
- **And** the browser/OS handles the rest

#### Scenario: cancel operation

- **Given** I am a signed-in user viewing my list of owned recipes
- **When** I select the **Export-as-PDF** icon
- **And** I cancel the operation while the file-picker dialog is open/active
- **Then** the PDF file is not saved to my computer
- **And** the PDF file is discarded from the app
- **And** the **Export-as-PDF** option is still present in the recipe card

### US-4.6: Delete Recipe

#### Scenario: user (signed-in) selected delete icon

- **Given** I am a user (authenticated)
- **And** I am viewing the recipe list I own
- **When** I select the delete icon of a recipe I own
- **Then** a modal appears in the center of the screen asking for confirmation for the deletion action
- **And** I see a **CANCEL** outline-button alongside a **DELETE** raised-button at the bottom-right of the modal
- **And** the view behind the modal is dimmed until the modal closes

#### Scenario: user (signed-in) cancels deletion action

- **Given** I am viewing the delete confirmation modal
- **When** I select the **CANCEL** outline-button
- **Or** I interact with anything outside the deletion modal
- **Then** no requests are sent to the API
- **And** the modal closes

Each `### US-N.n` block under **Acceptance Criteria** owns the scenarios for that user story. One story may have many scenarios; do not mix scenarios from different stories under one heading.

Every scenario must appear in the **Test Coverage Map** and have at least one automated test before the feature is done.

---

## Test traceability

Tests must link back to this spec in three layers:

```text
feature-4-CR-recipes.md
  └── US-4.1 — Add Recipe
        └── Scenario: open add modal
              └── frontend/tests/RecipeList.test.js → it("open add modal")
```

### File header

Every Feature 4 test file starts with:

```javascript
/**
 * Feature 4 — Create, Read, and Delete Recipes
 * Spec: features/feature-4-CR-recipes.md
 */
```

Harness-only files (`app.test.js`, `App.test.js`) are exempt — they verify the test setup, not product behavior.

### Nested `describe` blocks

```javascript
describe('Feature 4 — Create, Read, and Delete Recipes', () => {
  describe('US-4.1 — Add Recipe', () => {
    it('open add modal', async () => {
      /* … */
    });
    it('Add button confirms operation', async () => {
      /* … */
    });
  });
});
```

- **Outer `describe`** — feature name (matches spec title).
- **Inner `describe`** — `US-4.n` + story title (matches AC `###` heading).
- **`it` name** — exact Gherkin **Scenario** title from this spec.

### Test Coverage Map

The map is the authoritative index. Each Gherkin scenario below must have ≥1 matching `it` before this feature is done. API and ownership cases live in `backend/tests/recipes.test.js` (Jest + supertest). Recipes-view and card UI live in `frontend/tests/RecipeList.test.js` and `frontend/tests/RecipeCard.test.js` (Vitest).

| Story  | Scenario                                 | Test file                                                            | Test name                                        |
| ------ | ---------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------ |
| US-4.1 | open add modal                           | `frontend/tests/RecipeList.test.js`                                  | `it("open add modal")`                           |
| US-4.1 | Serving/Time input field details         | `frontend/tests/RecipeList.test.js`                                  | `it("Serving/Time input field details")`         |
| US-4.1 | Publish toggle                           | `frontend/tests/RecipeList.test.js`                                  | `it("Publish toggle")`                           |
| US-4.1 | Close button cancels operation           | `frontend/tests/RecipeList.test.js`                                  | `it("Close button cancels operation")`           |
| US-4.1 | Field validation                         | `frontend/tests/RecipeList.test.js`                                  | `it("Field validation")`                         |
| US-4.1 | Add button confirms operation            | `frontend/tests/RecipeList.test.js`, `backend/tests/recipes.test.js` | `it("Add button confirms operation")`            |
| US-4.1 | Enforce modal focus                      | `frontend/tests/RecipeList.test.js`                                  | `it("Enforce modal focus")`                      |
| US-4.2 | See list (signed in)                     | `frontend/tests/RecipeList.test.js`, `backend/tests/recipes.test.js` | `it("See list (signed in)")`                     |
| US-4.2 | See list (signed out)                    | `frontend/tests/RecipeList.test.js`, `backend/tests/recipes.test.js` | `it("See list (signed out)")`                    |
| US-4.3 | Always-present recipe details            | `frontend/tests/RecipeCard.test.js`                                  | `it("Always-present recipe details")`            |
| US-4.3 | Expanded recipe card                     | `frontend/tests/RecipeCard.test.js`                                  | `it("Expanded recipe card")`                     |
| US-4.3 | Shrink recipe card                       | `frontend/tests/RecipeCard.test.js`                                  | `it("Shrink recipe card")`                       |
| US-4.4 | Actions on Recipe Card (signed-in)       | `frontend/tests/RecipeCard.test.js`                                  | `it("Actions on Recipe Card (signed-in)")`       |
| US-4.4 | Select edit icon                         | `frontend/tests/RecipeCard.test.js`                                  | `it("Select edit icon")`                         |
| US-4.4 | Actions on Recipe Card (signed-out)      | `frontend/tests/RecipeCard.test.js`                                  | `it("Actions on Recipe Card (signed-out)")`      |
| US-4.5 | export-to-pdf icon selected              | `frontend/tests/RecipeCard.test.js`                                  | `it("export-to-pdf icon selected")`              |
| US-4.5 | cancel operation                         | `frontend/tests/RecipeCard.test.js`                                  | `it("cancel operation")`                         |
| US-4.6 | user (signed-in) selected delete icon    | `frontend/tests/RecipeList.test.js`, `backend/tests/recipes.test.js` | `it("user (signed-in) selected delete icon")`    |
| US-4.6 | user (signed-in) cancels deletion action | `frontend/tests/RecipeList.test.js`                                  | `it("user (signed-in) cancels deletion action")` |

### Auditing coverage

```bash
# Find all tests for a story
rg "US-4.1" features/ backend/tests frontend/tests

# Find a scenario across spec and tests
rg "open add modal" features/ backend/tests frontend/tests
```

Every `#### Scenario` in this spec must have ≥1 matching `it`. Every Feature 4 `it` must trace to a scenario.

---

## Definition of Done

- [ ] Backend and frontend implemented on `feature/4-CR-recipes` per this spec (**FR-001**–**FR-014**): signed-in users create, view, export, and delete **owned** recipes on one recipes view; signed-out users see **published** recipes only; edit-recipe screen is **not** built here (Feature 5)
- [ ] **SC-001**–**SC-005** met: every Gherkin scenario has a test; signed-in export/view/delete/create on one screen without other users’ unpublished data; signed-out export/view of all published recipes; `npm test` passes for recipe API and recipes-view tests
- [ ] All mapped tests pass (`npm test`): `backend/tests/recipes.test.js`, `frontend/tests/RecipeList.test.js`, `frontend/tests/RecipeCard.test.js`
- [ ] Test Coverage Map complete — every `#### Scenario` under US-4.1–US-4.6 has a matching `it("…")` with the exact scenario title
- [ ] `features/reference/data-model.md` updated with the `recipes` table (`name`, `description`, `servings`, `time`, `isPublished`, `userId`)
- [ ] `features/reference/api.md` updated with `/recipeapi/recipes` and `/recipeapi/recipes/:id` (GET public published reads; POST/PUT/DELETE and `GET /recipes/user/:userId` require authenticate; create/error payloads)
- [ ] `features/reference/behavior.md` updated with published vs unpublished visibility, owner-only writes, `404` (never `403`) for unowned or unpublished cross-user access, alphabetical name order, and which card actions show signed-in vs signed-out
- [ ] README Feature catalog has a Feature 4 row (`features/feature-4-CR-recipes.md`, `feature/4-CR-recipes`)
- [ ] Out of Scope respected: no steps/ingredients CRUD, no PDF format picker, no recipe sharing, no `/recipe/:id` edit view

---

## Out of Scope

- Steps and Ingredients CRUD (see `feature-recipe-details-management.md`)
- Changes to user authentication
- Users choosing PDF-export formatting
- `403` responses (MUST avoid `403` responses)
- Drag-and-drop recipe card reordering
- Sharing recipes with other users

---

## Delivered to Feature 5

The following are intentionally deferred to the next feature spec:

- `edit recipe` screen/view via URI `/recipe/:id`
- `POST /recipeapi/recipes/:id`
