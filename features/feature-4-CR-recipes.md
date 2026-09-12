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
**I want to** see a list of all my published and unpublished recipes on one screen  
**So that** I can see what recipes I have  

**Priority:** P1  
**Independent test:** Dashboard loads a single list of recipes (no sidebar split), each recipe belongs to one card  
**Acceptance scenarios:** see ### US-4.2 under Acceptance Criteria  

### US-4.3: Default Recipe Details

**As a** signed in User  
**I want to** see the details of a recipe like **Name**, **Servings**, **Time to make (in minutes)**, and **Actions**  
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

---



## Requirements



### Functional Requirements



#### eg. (**FR-001**: Users MUST authenticate with **username** + **password** (not email-only login).)



#### The specifics on what it is supposed to do

- **FR-001**: 
- **FR-002**: <Users MUST be able to ...>
- **FR-003**: <... MUST NOT ...>
- etc...

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
- **SC-002**: 

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



## VVV Example table (Change or Delete) VVV



### `users` table


| Field      | Type        | Rules                              |
| ---------- | ----------- | ---------------------------------- |
| `id`       | INTEGER PK  | Auto-increment                     |
| `fName`    | STRING      | Required                           |
| `lName`    | STRING      | Required                           |
| `email`    | STRING      | Required, unique                   |
| `username` | STRING(100) | Required, unique; stored lowercase |
| `password` | STRING(255) | Required; bcrypt hash only         |
| `role`     | STRING(20)  | Default `worker`                   |




## ^^^ (Change or Delete) ^^^

---



## Acceptance Criteria (Gherkin)



### US-1.1 — {Related Functional Requirement}



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

