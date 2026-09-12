# Feature: Create and Read Recipes

**Feature ID:** 4
**Branch pattern:** `feature/4-CR-recipes`
**Status:** Draft
**Created:** 2026-09-12
**Input:** {One-line intent -- what prompted this features (the user description)}
**Depends on:** [Feature X -- ...](feature-X-...md), ... <-- (omit if none)
**Related:** `features/references...`, [ADR-NNNN](../docs/adr/NNNN-title.md) <-- optional

---

## User Stories

### US-1.1: {Short title}

**As a** <role>
**I want to** <capability>
**So that** <benefit>

**Priority:** PN (eg. P1 for most important)  
**Independent test:** <how to verify this story alone, in one sentence> (eg. Submit valid registration and land on protected home with `user` in `localStorage`)
**Acceptance scenarios:** see ### US-N.N (eg. ### US-1.1) under Acceptance Criteria

### US-1.2: ...
**As a**
**I want to**
**So that**

**Priority:** PN
**Independent test:**
**Acceptance scenarios:**

---

## Requirements

### Functional Requirements

#### eg. (**FR-001**: Users MUST authenticate with **username** + **password** (not email-only login).)
#### The specifics on what it is supposed to do

- **FR-001**: <System MUST>
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
