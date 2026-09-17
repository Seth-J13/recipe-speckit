# Feature: User Authentication & Session Management

**Feature ID:** {3}
**Branch pattern:** `feature/3-Ingredients-Management`
**Status:** {Draft | Ready | Shipped}
**Created:** 2026-09-16
**Input:** {CRUD ingredients}
**Depends on:** [Feature X -- ...](feature-X-...md), ... <-- (omit if none)
[feature 1 -- menu bar](feature-1-menu-bar.md), 
[Feature 2 -- log-in-log-out](feature-2-log-in-log-out.md)

---

## User Stories

### US-3.1: {Short title}

**As a** <role>
**I want to** <capability>
**So that** <benefit>

**Priority:** PN (eg. P1 for most important)  
**Independent test:** <how to verify this story alone, in one sentence> (eg. Submit valid registration and land on protected home with `user` in `localStorage`)
**Acceptance scenarios:** see ### US-N.N (eg. ### US-1.1) under Acceptance Criteria

### US-3.2: ingredients view...
**As a** user 
**I want to** see a list of ingredients
**So that** I can see the ingredients

**Priority:** P1
**Independent test:** the list of ingredients is displayed in the middle of the screen, and none of the ingredients overlap. 
**Acceptance scenarios:** see ### US-1.1 under Acceptance Criteria

### US-3: Open the add-ingredient widget
**As a** user
**I want to** click an Add button on the ingredients table
**So that** I can create a new ingredient without leaving the list

**Priority:** P1
**Independent test:** From the ingredients table, click Add and confirm a widget with a title "Add Ingredient" appears.
**Acceptance scenarios:** see ### US-2.1 under Acceptance Criteria

### US-4: Enter name and price in the add widget
**As a** user
**I want to** type an ingredient name and price per unit in the add modal
**So that I** can record what the ingredient is called and what it costs

**Priority:** P1
**Independent test:** Open the Add Ingredient modal and confirm text inputs exist for name and price per unit, then type values into both.
**Acceptance scenarios:** see ### US-3.1 under Acceptance Criteria

### US-5: Choose a unit from a dropdown menu
**As a** user
**I want to** pick a unit from a dropdown of measuring units
**So that** the ingredient saves its unit of measurment 

**Priority:** P1
**Independent test:** Open the Add Ingredient modal, expand the dropdown menu, and confirm the list contains Cup, Gallon, Gram, Kilogram, Liter, Mili-liter, Ounce, Pint, Piece, Pound, Quart, Tablespoon, Teapsoon, and Unit.
**Acceptance scenarios:** see ### US-4.1 under Acceptance Criteria

### US-6: Cancel without saving
**As a** user
**I want to** close the ingredient modal with the Close button
**So that I** can leave an add or edit widget without creating or changing an ingredient

**Priority:** P2
**Independent test:** Open Add (or Edit), change fields, click Close (Cancel), and confirm the modal closes and the table is unchanged.
**Acceptance scenarios:** see ### US-5.1 under Acceptance Criteria

### US-7: Save a new ingredient to the database
**As a** user
**I want to** confirm the add ingredient by clicking the confirm button
**So that** the new ingredient is created with a database request and appears in the ingredients table

**Priority:** P1
**Independent test:** Submit a valid new ingredient via Add Ingredient and confirm a POST is sent and the new row appears with the submitted Name, Unit, and Price per Unit.
**Acceptance scenarios:** see ### US-6.1 under Acceptance Criteria

### US-8: Open the edit-ingredient modal from Actions
**As a** user
**I want to** click Edit in a row’s Actions column and see the same form as add, titled Edit Ingredient, with Update Ingredient as the confirm button
**So that** I can change an existing ingredient without a different workflow

**Priority:** P1
**Independent test:** Click Edit on an existing row and confirm a modal titled Edit Ingredient opens, fields match the add form and are prefilled from that row, and the confirm button label is Update Ingredient.
**Acceptance scenarios:** see ### US-7.1 under Acceptance Criteria

### US-9: Save ingredient changes into database
**As a** user
**I want to** confirm the edit modal with Update Ingredient
**So that** the existing ingredient is updated with a PUT request and the table row shows the new values

**Priority:** P1
**Independent test:** Change an existing ingredient in the edit modal, click Update Ingredient, and confirm a PUT is sent and that table row reflects the new Name, Unit, and Price per Unit.
**Acceptance scenarios:** see ### US-8.1 under Acceptance Criteria

---

## Requirements

### Functional Requirements

#### eg. (**FR-001**: Users MUST authenticate with **username** + **password** (not email-only login).)
#### The specifics on what it is supposed to do

- **FR-001**: <System MUST>
- **FR-002**: <Users MUST be able to ...>
- **FR-003**: <... MUST NOT ...>
- etc...

- **FR-001:** <The system MUST display a Table of Ingredients with exactly these columns: Name, Unit, Price per Unit, and Actions.>
- **FR-002:** <Users MUST be able to open an add card from an Add button at the top right of the table. The modal title MUST be Add Ingredient.>
- **FR-003**: <The add/edit modal MUST provide text inputs for name and price per unit, and a dropdown for unit.>
- **FR-004:** <The unit dropdown MUST list these values (varchar in the database; UI is still a dropdown): Cup, Gallon, Gram, Kilogram, Liter, Mili-liter, Ounce, Pint, Piece, Pound, Quart, Tablespoon, Teapsoon, Unit.>
- **FR-005**: <Users MUST be able to dismiss the modal with a Close (Cancel) button. Dismissing MUST NOT create or update an ingredient.>
- **FR-006**: <Confirming add with Add Ingredient MUST send a POST request and persist the new ingredient so it appears in the table.>
- **FR-007**: <Each ingredient row MUST provide an Edit button under Actions. The edit modal MUST be the same as add except the title MUST be Edit Ingredient and the confirm button MUST be Update Ingredient, with fields populated from the selected ingredient.>
- **FR-008**: <Confirming edit with Update Ingredient MUST send a PUT request for the current ingredient and refresh that row. The edit flow MUST NOT use POST to create a second ingredient.>

---



## Assumptions

- What already exists (eg. Feature 1 auth is on `dev`)
- What you are deliberately not building yet

## Edge Cases

- Empty required field → …
- Cross-user access → …
- Duplicate / invalid input → …

## Success Criteria

- **SC-001**: Every Gherkin scenario has at least one automated test before merge
- **SC-002**: <measurable outcome for this feature>

---

## Data Ownership & Isolation (foundation)

Feature 1 establishes identity; Features 2–3 enforce per-user data boundaries.

- Each user account is a separate tenant boundary for todo lists and items.
- No API in this feature returns another user's profile or session.
- Later features must never expose lists or todos across users — not in list responses, detail views, or error messages that confirm another user's resource exists.

---

## Key Entities

- **User**: registered account (name, email, username, role); owns future lists and todos.
- **Session**: server-side record tying a JWT token to a user; expires after 24 hours.

---



## Data Model Requirements
### Look under ./backend/app/models/(file name).js
- This shows the table you will need to model


### `ingredients` table

| Field      | Type        | Rules                              |
| ---------- | ----------- | ---------------------------------- |
| `id`       | INTEGER PK  | Auto-increment                     |
| `unit`     | STRING      | Required                           |
| `pricePerUnit`    | DECIMAL(10,2)      | Required                           |
| `createdAt`    | DATETIME      | Required                 |
| `updatedAt` | DATETIME | Required|

---

## Acceptance Criteria (Gherkin)



### US-3.1 — view ingredients list

#### Scenario: view ingredients list

- **Given** I am on the ingredients view
- **When** I the screen loads
- **Then** I see all existing ingredients in a list regardless of who entered them.

#### Scenario: {What is happening or has happend}

- **Given** {Where are you on the website?}
- **When** {Main action?}
- **And** {What additional action did you take?}
- **Then** {Website response}
- **And** {additional response}
- **And** 
- **etc...** 


## VVV Example AC (Change or Delete) VVV
#### Scenario: User submits registration with missing email

- **Given** I am on the registration page
- **When** I leave the email field empty
- **And** I submit the form
- **Then** inline validation blocks the request
- **And** I see the message **"Email is required."**
- **And** no API request is sent
## ^^^ (Change or Delete) ^^^

### US-2.1 — open add ingredient modal
#### Scenario: open add ingredient modal
**Given** I am on the ingredients view
**When** I click the Add button at the top right of the table
**Then** a modal (add card) is shown
**And** the modal title is "Add Ingredient"
**And** the ingredients table remains in the background behind the modal

### US-3.1 — enter name and price per unit
#### Scenario: enter name and price per unit
**Given** I am on the ingredients view
**And** the Add Ingredient modal is open
**When** I type an ingredient name in the name text input
**And** I type a price in the price per unit text input
**Then** the name field shows the text I entered
**And** the price per unit field shows the value I entered
**And** both fields are text inputs (not the unit dropdown)

### US-4.1 — select unit from dropdown
#### Scenario: select unit from dropdown
**Given** I am on the ingredients view
**And** the Add Ingredient modal is open
**When** I open the unit dropdown
**Then** I see these options: Cup, Gallon, Gram, Kilogram, Liter, Mili-liter, Ounce, Pint, Piece, Pound, Quart, Tablespoon, Teapsoon, Unit
**And** I can select one of those values as the ingredient’s unit
**And** the selected unit is shown in the dropdown after I choose it

### US-5.1 — cancel without saving
#### Scenario: cancel add without saving
**Given** I am on the ingredients view
**And** the Add Ingredient modal is open
**And** I have entered a name, unit, or price per unit
**When** I click Close (Cancel)
**Then** the modal closes
**And** no API request is sent
**And** the ingredients table is unchanged

#### Scenario: cancel edit without saving
**Given** I am on the ingredients view
**And** the Edit Ingredient modal is open
**And** I have changed the name, unit, or price per unit
**When** I click Close (Cancel)
**Then** the modal closes
**And** no API request is sent
**And** the ingredients table is unchanged

### US-6.1 — add ingredient with POST
#### Scenario: add ingredient with POST
**Given** I am on the ingredients view
**And** the Add Ingredient modal is open
**And** I have entered a name, selected a unit, and entered a price per unit
**When** I click the Add Ingredient confirm button
**Then** a POST request is sent for the new ingredient
**And** the modal closes
**And** the ingredients table shows a new row with that name, unit, and price per unit
**And** the new row includes an Edit button in the Actions column

### US-7.1 — open edit ingredient modal
#### Scenario: open edit ingredient modal
**Given** I am on the ingredients view
**And** at least one ingredient row is visible
**When** I click Edit in that row’s Actions column
**Then** a modal opens with the title "Edit Ingredient"
**And** the form is the same as add: text inputs for name and price per unit, and a unit dropdown
**And** those fields are filled with the selected ingredient’s current name, unit, and price per unit
**And** the confirm button is labeled "Update Ingredient"

### US-8.1 — update ingredient with PUT
#### Scenario: update ingredient with PUT
**Given** I am on the ingredients view
**And** the Edit Ingredient modal is open for an existing ingredient
**And** I have changed the name, unit, and/or price per unit
**When** I click the Update Ingredient confirm button
**Then** a PUT request is sent for that ingredient
**And** the modal closes
**And** the same table row shows the updated name, unit, and price per unit
**And** a new ingredient row is not created

---



### US-N.2 — {Related Functional Requirement}

#### Scenario: 

- **Given** 
- **And** 
- **When** 
- **And** 
- **Then** 
- **And** 
- **And**
- **And** 

---

### etc...
