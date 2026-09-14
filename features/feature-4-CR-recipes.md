# Feature: Create and Read Recipes

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

**As a** signed in User  
**I want to** see a list of ONLY published and unpublished recipes **owned by me** on one screen  
**So that** I can see what recipes I have  

**Priority:** P1  
**Independent test:** Dashboard loads a single list of recipes (no sidebar split), each recipe belongs to one card  
**Acceptance scenarios:** see ### US-4.2 under Acceptance Criteria  

### US-4.3: See Recipe Details

**As a** signed in User  
**I want to** see the details of a recipe like **Name**, **Servings**, **Time to make (in minutes)**, **Actions**  
**So that** I can read them without changing screens  

**Priority:** P1
**Independent test:** Card shows bolded details from **I want to** by default, expands to show **Ingredients** and **Steps** when interacted  
**Acceptance scenarios:** see ### US-4.3 under Acceptance Criteria  

### US-4.4: Manage Recipe List

**As a** signed in User  
**I want** each Recipe to show **Export-as-PDF**, **Edit**, and **Delete** actions  
**So that** I can make changes to my recipe in another view  

**Priority:** P2  
**Independent test:** Each entry exposes Export-as-PDF, Edit, and Delete actions in all states of interaction in this Recipes view  
**Acceptance scenarios:** see ### US-4.4 under Acceptance Criteria  

### US-4.5: Private Recipes Only

**As an** signed-in user  
**I want** my unpublished recipes visible only to me  
**So that** other users cannot read or modify my unpublished recipes  

**Priority:** P1
**Independent test:** Cross-user unpublished-recipe access returns 404; GET /recipes/user/ never returns another user's unpublished recipes  
**Acceptance scenarios:** see ### US-4.5 under Acceptance Criteria  

### US-4.6: Public Recipes

**As a** guest with no account  
**I want** everyone's published recipes to be visible to me  
**So that** I can see public recipes  

**Priority:** P2  
**Independent test:** Cross-user published-recipe access returns 200; GET /recipes/user/ only returns another user's published recipes  
**Acceptance scenarios:** see ### US-4.6 under Acceptance Criteria  

### US-4.7: Public Recipe Details

**As a** guest with no account  
**I want to** see the details of a recipe like **Name**, **Servings**, **Time to make (in minutes)**, and **Export-as-PDF**  
**So that** I can read them without changing screens  

**Priority:** P1
**Independent test:** Card shows bolded details from **I want to** by default, expands to show **Ingredients** and **Steps** when interacted  
**Acceptance scenarios:** see ### US-4.7 under Acceptance Criteria  

### US-4.8: Export Option

**As** any User (authenticated or not authenticated)  
**I want** to be able to **Export-as-PDF** on any recipes appropriately shown in the Recipes view  
**So that** I can download a PDF version of the selected recipe  

**Priority:** P3  
**Independent test:** Each entry exposes Export-as-PDF in all states of interaction on this view; picking Export-as-PDF downloads a PDF containing the Recipe name, its description, its serving number, its completion time (in minutes), its list of ingredients, and all its steps/instructions.  
**Acceptance scenarios:** see ### US-4.8 under Acceptance Criteria  

### US-4.9: Manage Recipe List

**As a** signed-in user  
**I want to** be able to delete my recipes  
**So that** I can remove unwanted recipes from my list  

**Priority:** P2  
**Independent test:** Select **Delete** icon, recipe is removed from database, recipe no longer appears in view   
**Acceptance scenarios:** see ### US-4.9 under Acceptance Criteria 

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
- **FR-012**: This feature MUST deliver recipe CRUD and a **single-view** recipes UI in `Dashboard.vue` (dialog-based add). No sidebar/main split. Recipe **Editing View** is Feature 5. CRUD **Ingredients**  is Feature 3.
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

| Rule | Requirement |
|------|-------------|
| **Read scope** | Authenticated `GET /recipeapi/recipes` returns only recipes where `userId = req.user.id`. Unauthenticated `GET /recipeapi/recipes` returns recipes where `isPublished = true`. |
| **Write scope** | `PUT` and `DELETE` apply only when the recipe row matches both `id` and `req.user.id`. |
| **Create scope** | New recipes are always owned by the authenticated user. |
| **Cross-user access** | If a recipe belongs to another user, respond with `404` — never `403` (do not confirm the list exists). |
| **UI scope** | The recipes view shows only recipes returned by `GET /recipeapi/recipes`. |
| **Implementation** | Use a shared helper (e.g. `getAccessibleRecipeOrNull(req, recipeId)`) in `app/authorization/` — do not duplicate scope logic in controllers. |

---

## API Requirements

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `GET` | `/recipeapi/recipes` | No | Fetch all recipes for the authenticated user; Fetch all published recipes for the unauthenticated user |
| `POST` | `/recipeapi/recipes` | Yes | Create a new list |
| `PUT` | `/recipeapi/recipes/:recipeId` | Yes | Update a list |
| `DELETE` | `/recipeapi/recipes/:recipeId` | Yes | Delete a list owned by the caller |

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
*   Heading: **Recipes**
*   Primary action: **NEW** opens a `<v-dialog>` with a name `<v-text-field>` and **Create** / **Cancel**. Use class `oc-cta` on **Create** and **NEW** (per [ui-style-system.mdc](../../.cursor/rules/ui-style-system.mdc)).
*   Display owned recipes as cards (e.g. `<v-card>`): each row shows the **Recipe Name** and icon actions:
    *   **PDF** icon — exports the selected recipe as a pdf file and opens a file picker window to save to a location
    *   **Edit** icon — changes URI to `/recipe/:id` where `:id` is the recipeId of the selected card
    *   **Delete** icon — sends a delete request to the `/recipeapi/recipes/:id` where `:id` is the recipeId of the selected card
*   Icon-only row actions use `size="small"` and accessible `aria-label`s (**Export as PDF**, **Edit Recipe**, **Delete Recipe**).
*   **Empty state:** **"No Recipes yet. Create your first Recipe."** when the user has zero lists.
*   **Loading state:** skeleton or progress indicator while lists are fetching.
*   **Error state:** `<v-alert type="error">` for API failures.

**Implementation note:** one route/view for recipes; recipe create and read dialogs are child components or inline `<v-dialog>` blocks in `Dashboard.vue` unless the team splits presentational dialogs later.

---



## Key Entities

- **User**: registered account (name, email, username, role); owns future recipes.
- **Session**: server-side record tying a JWT token to a user; expires after 24 hours.

---



## Data Model Requirements

### `recipes` table


| Field        | Type         | Rules                      |
| ------------ | ------------ | -------------------------- |
| `id`         | INTEGER PK   | Auto-increment             |
| `name`       | VARCHAR(100) | Nullable                   |
| `description`| VARCHAR(255) | Nullable                   |
| `servings`   | INTEGER      | Required                   |
| `time`       | DATETIME     | Required                   |
| `isPublished`| TINYINT(1)   | Required                   |
| `createdAt`  | DATETIME     | Default CURRENT_TIMESTAMP  |
| `updatedAt`  | DATETIME     | Default CURRENT_TIMESTAMP  |
| `userId`     | INTEGER      | Foreign Key to users table |

---

## Acceptance Criteria (Gherkin)


### US-4.1: Add Recipe

#### Scenario: signed in user hits the `NEW` button

- **Given** I am authenticated and am viewing the Recipes view  
- **When** I interact with the `NEW` button  
- **Then** The `Add Recipe` modal appears in the center of the screen  
- **And** I can see the title `Add Recipe` in the `Add Recipe` modal
- **And** I can see a text input field called `Name`  
- **And** I can see an integer input field called `Number of Servings` whose default is 2  
- **And** I can see an integer input field called `Time to Make (in minutes)` whose default is 30  
- **And** I can see a text area field called `Description`  
- **And** I can see a toggle switch labeled `Publish?` whose default is set to `No` (off)  
- **And** I can see `CLOSE` and `ADD RECIPE` buttons  

#### Scenario: Interacting with Servings and Time input fields

- **Given** I am viewing the `Add Recipe` modal  
- **When** I hover over or select the `Number of Servings` or `Time to Make (in minutes)` input fields  
- **Then** I can either click up or down arrows to the right of the field to increment or decrement the value inside the field respectively or input an integer myself  
- **And** the incremented or decremented values reflect realtime in the values of the input field  

#### Scenario: Interacting with Publish switch

- **Given** I am viewing the `Add Recipe` modal  
- **When** I interact with the `Publish?` toggle switch anywhere in its element  
- **Then** the toggle switch switches to `Yes` (on) if it was previously off  
- **And** the toggle switch switches to `No` (off) if it was previously on  
- **And** the state of the switch (`Yes`/`No`) is shown to the right of the word `Publish?`  

#### Scenario: Interacting with modal buttons

- **Given** I am viewing the `Add Recipe` modal  
- **When** I press the `CLOSE` button  
- **Then** all the input fields are cleared  
- **And** the `Add Recipe` modal closes  
- **And** no requests are sent to the API  

#### Scenario: Interacting with modal buttons

- **Given** I am viewing the `Add Recipe` modal  
- **When** I press the `ADD RECIPE` button  
- **And** either the `Number of Servings` or the `Time to Make (in minutes)` integer field is empty  
- **Then** all the input fields are cleared  
- **And** the `Add Recipe` modal closes  
- **And** no requests are sent to the API  

#### Scenario: Interacting with modal buttons

- **Given** I am viewing the `Add Recipe` modal  
- **When** I press the `ADD RECIPE` button  
- **And** all input/integer fields and text areas have valid input  
- **Then** a `PUT` request is sent to the API whose body contains the data from the `Add Recipe` modal and whose format follows the **Create recipe request body**   
- **And** the `Add Recipe` modal closes  
- **And** the list of Recipe cards refreshes without the window/page refreshing  

### US-4.2: View Recipes

#### Scenario: {What is happening or has happend}

- **Given** {Where are you on the website?}
- **When** {Main action?}
- **And** {What additional action did you take?}
- **Then** {Website response}
- **And** {additional response}
- **And**  

### US-4.3: See Recipe Details

#### Scenario: {What is happening or has happend}

- **Given** {Where are you on the website?}
- **When** {Main action?}
- **And** {What additional action did you take?}
- **Then** {Website response}
- **And** {additional response}
- **And**  

### US-4.4: Manage Recipe List

#### Scenario: {What is happening or has happend}

- **Given** {Where are you on the website?}
- **When** {Main action?}
- **And** {What additional action did you take?}
- **Then** {Website response}
- **And** {additional response}
- **And**  

### US-4.5: Private Recipes Only

#### Scenario: {What is happening or has happend}

- **Given** {Where are you on the website?}
- **When** {Main action?}
- **And** {What additional action did you take?}
- **Then** {Website response}
- **And** {additional response}
- **And**  

### US-4.6: Public Recipes

#### Scenario: {What is happening or has happend}

- **Given** {Where are you on the website?}
- **When** {Main action?}
- **And** {What additional action did you take?}
- **Then** {Website response}
- **And** {additional response}
- **And**  

### US-4.7: Public Recipe Details

#### Scenario: {What is happening or has happend}

- **Given** {Where are you on the website?}
- **When** {Main action?}
- **And** {What additional action did you take?}
- **Then** {Website response}
- **And** {additional response}
- **And**  

### US-4.8: Manage Recipe List

#### Scenario: {What is happening or has happend}

- **Given** {Where are you on the website?}
- **When** {Main action?}
- **And** {What additional action did you take?}
- **Then** {Website response}
- **And** {additional response}
- **And**  

### US-4.9: Manage Recipe List

#### Scenario: {What is happening or has happend}

- **Given** {Where are you on the website?}
- **When** {Main action?}
- **And** {What additional action did you take?}
- **Then** {Website response}
- **And** {additional response}
- **And**  

### US-4.10: Manage Recipe List

#### Scenario: {What is happening or has happend}

- **Given** {Where are you on the website?}
- **When** {Main action?}
- **And** {What additional action did you take?}
- **Then** {Website response}
- **And** {additional response}
- **And**  

