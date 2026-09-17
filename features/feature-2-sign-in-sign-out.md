# Feature: Sign In & Sign Out

**Feature ID:** 2
**Branch pattern:** `feature/2-sign-in-sign-out`
**Status:** Ready
**Created:** 2026-09-14
**Input:** Can log in, stay signed in, and log out.
**Depends on:** Feature 1 — Create account (a `users` row with email + password must already exist)
**Related:** `features/reference/api.md`, `features/reference/data-model.md`, `features/reference/behavior.md`

---

## User Stories

### US-2.1: Sign in

**As a** not signed-in user
**I want to** press Login with a valid email and password
**So that** I land on Recipes with an active session

**Priority:** P1
**Independent test:** Sign in with valid credentials and land on the Recipes list with `user` stored in `localStorage`.
**Acceptance scenarios:** see ### US-2.1 under Acceptance Criteria

### US-2.2: Stay signed in across page loads

**As a** signed-in user
**I want** my session to persist when I go to Recipes and when I refresh the page
**So that** I do not have to sign in again after every navigation or refresh

**Priority:** P1
**Independent test:** With a valid `localStorage` session, open Recipes and refresh — no re-login prompt.
**Acceptance scenarios:** see ### US-2.2 under Acceptance Criteria
**Trace:** `TS-F2-US2.2`

### US-2.3: Sign out

**As a** signed-in user
**I want to** sign out
**So that** no one else can use my account on a shared device

**Priority:** P2
**Independent test:** Sign out clears the server session and `localStorage`; user lands on Login.
**Acceptance scenarios:** see ### US-2.3 under Acceptance Criteria

### US-2.4: Create account

**As a** not signed-in user
**I want to** be able to create an account
**So that** I can create recipes

**Priority:** P1
**Independent test:** Press Create Account, fill credentials in the dialog, then confirm a session exists and Recipes is shown.
**Acceptance scenarios:** see ### US-2.4 under Acceptance Criteria
**Trace:** `TS-F2-US2.4`

---

## Requirements

### Functional Requirements

- **FR-001**: Users MUST authenticate with **email** + **password** (not username login; not password-only).
- **FR-002**: Successful login MUST create a server session and return a token; the frontend MUST store the payload in `localStorage` under `user` and navigate to Recipes.
- **FR-003**: A valid session MUST persist across navigation (including Recipes) and browser refresh until expiry or logout.
- **FR-004**: Logout MUST invalidate the current server session, clear `localStorage` `user`, and send the user to Login.
- **FR-005**: Unknown or unused email on login MUST return **401** with message **"User not found!"**.
- **FR-006**: Wrong password for an existing email MUST return **401** with message **"Invalid password!"**.
- **FR-007**: Missing or expired token on a protected API MUST return **401**; the frontend MUST clear the session and redirect to Login.

---

## Assumptions

- Feature 1 (Create account) provides `users` rows. This feature does not create accounts.
- The Recipe app shell (Vue 3 frontend, Express API mounted at `/recipeapi`, MySQL) already exists in this repo.
- Login identifier is **email**, matching the running Recipe UI and `users.email`.
- Viewing published recipes without an account is allowed; this feature does not change that.

---

## Edge Cases

- Unknown email on login → **401** `"User not found!"`
- Wrong password on login → **401** `"Invalid password!"`
- Empty email or password on login → request blocked or **401** with a clear message
- Missing or expired Bearer token on protected API → **401**; frontend clears `user` and redirects to Login

---

## Success Criteria

- **SC-001**: Every Gherkin scenario has at least one automated test before merge.
- **SC-002**: A user can log in with email and password and receive a session token.
- **SC-003**: A signed-in user can log out and is returned to Login with no remaining local session.
- **SC-004**: A valid session survives Recipes navigation and page refresh until logout or expiry.

---

## Data Ownership & Isolation

Feature 2 starts and ends the caller’s own session. It does not return another user’s profile or token.

| Rule | Requirement |
|------|-------------|
| **Read scope** | Login success returns **only** the authenticating user’s profile fields and token. |
| **Write scope** | Login creates a `sessions` row for that user. Logout deletes **only** the caller’s current session. |
| **Create scope** | This feature does not create `users` or recipe rows. |
| **Cross-user access** | No endpoint in this feature returns another user’s password, salt, or session token. |
| **UI scope** | MenuBar shows the signed-in user’s initials, name, and email from `localStorage` `user`. |
| **Later features** | Recipe APIs must never expose another user’s private recipes. Cross-user → `404` (not `403`). |

---

## Key Entities

- **User**: existing account (first name, last name, email) created by Feature 1; used here only to verify credentials.
- **Session**: server-side record tying an encrypted session id (client `token`) to a user; expires after 24 hours.

---

## API Requirements

Mount prefix: `/recipeapi`.

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| `POST` | `/recipeapi/login` | No (Basic) | Authenticate email + password and return session payload |
| `POST` | `/recipeapi/logout` | Yes (Bearer) | Invalidate the current session |

**Login:** `Authorization: Basic <base64(email:password)>`. JSON body is not required for credential check.

**Login success response** (flat JSON, no envelope; never include `password` or `salt`):

```json
{
  "id": 1,
  "email": "DDevito@example.com",
  "firstName": "Danny",
  "lastName": "Devito",
  "token": "<encrypted-session-id>"
}
```

**Logout success:** `{ "message": "Logged out successfully." }`

**Error response:** `{ "message": "Human-readable explanation." }`

Quoted messages that tests must match:

| Situation | Status | `message` |
|-----------|--------|-----------|
| Unknown email | 401 | `User not found!` |
| Wrong password | 401 | `Invalid password!` |

`POST /recipeapi/users` (Create Account) is **not** this feature.

---

## Screen Requirements

### [View: Login] — route name `login` (`/`)

- Heading: **Login**
- Fields: **Email**, **Password** (both required)
- Primary action: **Login**
- **Create Account** on this screen is Feature 1 — do not change that dialog in this feature
- Optional chrome: **View Published Recipes** (not AC for this feature)
- **Error:** snackbar shows the API `message` (including **"User not found!"** and **"Invalid password!"**)
- **Success:** store payload in `localStorage` `user`, snackbar **"Login successful!"**, navigate to route `recipes`

### [View: Recipes] — route name `recipes` (`/recipes`)

- Post-login landing page (`RecipeList.vue`)
- Recipe CRUD is **out of scope**; this feature only requires that a valid session remains after arriving here

### App chrome — `MenuBar`

- **Recipes** button (stays signed in; navigates to `recipes`)
- When signed in: avatar (initials from first + last name). Opening it shows name, email, and **Logout**
- **Logout** runs logout, then lands on `login`

---

## Data Model Requirements

This feature **uses** `users` (Feature 1) and **owns** `sessions`.

### `users` table (read for login; not created here)

| Field | Type | Rules |
|-------|------|-------|
| `id` | INTEGER PK | Auto-increment |
| `firstName` | STRING | Required |
| `lastName` | STRING | Required |
| `email` | STRING | Required, unique; login identifier |
| `password` | BLOB | Required; salted hash only — never store plaintext |
| `salt` | BLOB | Required; used to hash the password |

### `sessions` table

| Field | Type | Rules |
|-------|------|-------|
| `id` | INTEGER PK | Auto-increment |
| `email` | STRING | Required |
| `expirationDate` | DATE | Required; 24 hours from login |
| `userId` | INTEGER FK | Required; references `users.id` |

The client `token` is the encrypted session `id`. It is not stored as a separate column.

### Associations

- `User` hasMany `Session`
- `Session` belongsTo `User`

---

## Acceptance Criteria (Gherkin)

### US-2.1 — Sign in

#### Scenario: Successful login

- **Given** I am on the Login page
- **When** I fill out a valid email and a valid password
- **And** I press **Login**
- **Then** the API request is sent
- **And** I am signed in
- **And** I land on Recipes

#### Scenario: Bad email

- **Given** I am on the Login page
- **When** I fill out an unused or wrong email and a password
- **And** I press **Login**
- **Then** I see the message **"User not found!"**
- **And** I remain on Login
- **And** I am not signed in

#### Scenario: Bad password

- **Given** I am on the Login page
- **When** I fill out an existing email and an invalid password
- **And** I press **Login**
- **Then** I see the message **"Invalid password!"**
- **And** I remain on Login
- **And** I am not signed in

### US-2.2 — Stay signed in across page loads

#### Scenario: Changing pages

- **Given** I have a valid session
- **When** I press **Recipes**
- **Then** I remain logged in
- **And** I am on the Recipes page

#### Scenario: Refresh pages

- **Given** I have a valid session
- **When** I refresh the page
- **Then** I remain logged in
- **And** I do not have to sign in again

### US-2.3 — Sign out

#### Scenario: Logging out

- **Given** I have a valid session
- **When** I press the profile circle
- **And** I click **Logout**
- **Then** I am logged out of the user session
- **And** I am redirected to the Login page

### US-2.3 — create account

#### Scenario: Creating new account 

- **Given** I am on the Login page
- **When** I press the **Create Account** button
- **And** I fill all textboxes
- **And** I click **Create Account**
- **Then** I am logged into the new account
- **And** I am redirected to the Recipes page

---

## Test Coverage Map

Each scenario above must map to at least one automated test.

| Story | Scenario | Test file | Test name |
|-------|----------|-----------|-----------|
| US-2.1 | Successful login | `backend/tests/auth.test.js` | `it("Successful login")` |
| US-2.1 | Bad email | `backend/tests/auth.test.js` | `it("Bad email")` |
| US-2.1 | Bad password | `backend/tests/auth.test.js` | `it("Bad password")` |
| US-2.2 | Changing pages | `frontend/tests/MenuBar.test.js` | `it("Changing pages")` |
| US-2.2 | Refresh pages | `frontend/tests/Login.test.js` | `it("Refresh pages")` |
| US-2.3 | Logging out | `frontend/tests/MenuBar.test.js` | `it("Logging out")` |
| US-2.4 | Creating new account | `frontend/tests/Login.test.js` | `it("Creating new account")` |

---

## Test traceability

Tests must link back to this spec in three layers:

```text
feature-2-sign-in-sign-out.md
  └── US-2.1 — Sign in
        └── Scenario: Successful login
              └── backend/tests/auth.test.js → it("Successful login")
```

### File header

Every Feature 2 test file starts with:

```javascript
/**
 * Feature 2 — Sign In & Sign Out
 * Spec: features/feature-2-sign-in-sign-out.md
 */
```

Harness-only files (`app.test.js`, `App.test.js`) are exempt — they verify the test setup, not product behavior.

### Nested `describe` blocks

```javascript
describe("Feature 2 — Sign In & Sign Out", () => {
  describe("US-2.1 — Sign in", () => {
    it("Successful login", async () => {
      /* … */
    });
    it("Bad email", async () => {
      /* … */
    });
  });
});
```

- **Outer `describe`** — feature name (matches spec title).
- **Inner `describe`** — `US-2.n` + story title (matches AC `###` heading).
- **`it` name** — exact Gherkin **Scenario** title from this spec.

## Agent implementation request

Copy when asking Cursor to implement this feature (`@` this file):

```text
Implement Feature 2 from @features/feature-2-sign-in-sign-out.md on branch `feature/2-sign-in-sign-out`.

Follow layer order in @features/framework.md (models → routes → backend tests → frontend → frontend tests).
Follow Test Traceability in this spec (file headers, nested describe blocks, exact Scenario it names).
Map every Gherkin scenario in the Test Coverage Map; run `npm test` before finishing.
If API routes, payloads, schema, or product rules changed per this spec, update @features/reference/api.md, @features/reference/data-model.md, and/or @features/reference/behavior.md in the same PR to match shipped code.
Complete Definition of Done and the merge checklist in @features/framework.md.
Do not implement behavior not in this spec.
```

**Reference updates for this feature:** `features/reference/data-model.md`, `features/reference/api.md`, `features/reference/behavior.md`

---

## Definition of Done

*   [x] Backend and frontend implemented per this spec (**FR-00N** satisfied)
*   [x] **Success Criteria (SC-00N)** met
*   [x] All mapped tests pass (`npm test`)
*   [x] Test Coverage Map complete
*   [x] Test traceability (file headers, nested `describe` / `it`, audit commands in this spec)
*   [x] `features/reference/data-model.md` updated (if schema changed)
*   [x] `features/reference/api.md` updated (if API changed)
*   [x] `features/reference/behavior.md` updated (if product rules changed)

---

## Out of Scope

*   Recipe create / edit / delete and per-user recipe ownership
*   Published-recipe browsing
*   Password reset
*   Username or role-based access
*   Ingredients catalog (signed-in **Ingredients** nav exists in MenuBar; not AC here)
