# Feature: User Authentication & Session Management

**Feature ID:** {Number}
**Branch pattern:** `feature/#-short-name`
**Status:** {Draft | Ready | Shipped}
**Created:** YYYY-MM-DD
**Input:** {One-line intent -- what prompted this features (the user description)}
**Depends on:** [Feature X -- ...](feature-X-...md), ... <-- (omit if none)
**Related:** `features/references...`, [ADR-NNNN](../docs/adr/NNNN-title.md) <-- optional

---

## User Stories

### US-1.1: Register an account

**As a**   
**I want to** 
**So that** 

**Priority:** PN (eg. P1 for most important)  
**Independent test:** (eg. Submit valid registration and land on protected home with `user` in `localStorage`)
**Acceptance scenarios:** (eg. see ### US-1.1 under Acceptance Criteria)

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

- **FR-001**: 
- **FR-002**: 

---



## Assumptions
### These are examples of assumptions (DELETE these and ADD your own)
- Greenfield app — no existing users or external identity provider.
- Single browser `localStorage` session per device (no multi-tab sync beyond shared storage).
- Lists and todos are deferred to Features 2–3; Feature 1 delivers auth and a minimal protected home placeholder only.



## Edge Cases
### These are examples of edge cases (DELETE these and ADD your own)
- Duplicate username or email on register → `400` with clear message.
- Invalid login credentials → `401` (same message for wrong username or password).
- Missing or expired token on protected API → `401`; frontend clears session and redirects to login.
- Whitespace-only required fields → rejected (client and/or server).



## Success Criteria
### These are examples of success criteria (DELETE these and ADD your own)
- **SC-001**: Every Gherkin scenario in this feature has at least one automated test before merge.
- **SC-002**: A new user can register, sign in, reach the protected home page, and sign out in one manual pass.
- **SC-003**: `npm test` passes with backend auth and frontend router/register/login coverage.

---



## Data Ownership & Isolation (foundation)

Feature 1 establishes identity; Features 2–3 enforce per-user data boundaries.

- Each user account is a separate tenant boundary for todo lists and items.
- No API in this feature returns another user's profile or session.
- Later features must never expose lists or todos across users — not in list responses, detail views, or error messages that confirm another user's resource exists.

---



## API Requirements


| Method | Endpoint         | Auth | Purpose                                 |
| ------ | ---------------- | ---- | --------------------------------------- |
| `POST` | `/todo/register` | No   | Create a new user account               |
| `POST` | `/todo/login`    | No   | Authenticate and return session payload |
| `POST` | `/todo/logout`   | Yes  | Invalidate current session token        |


**Login / register success response** (flat JSON, no envelope):

```json
{
  "userId": 1,
  "username": "jdoe",
  "email": "jdoe@example.com",
  "fName": "Jane",
  "lName": "Doe",
  "role": "worker",
  "token": "<jwt>"
}
```

**Error response:** `{ "message": "Human-readable explanation." }` with appropriate HTTP status.

---



## Screen Requirements



### [View: Login Page] — route name `login`

- Full-screen auth layout (no `MenuBar`).
- Fields: username, password.
- Primary action: **Sign in** (`v-btn`, shows `:loading` while request is in flight).
- Link or button to navigate to registration.
- Inline error via `<v-alert type="error">` on failed login.



### [View: Register Page] — route name `register`

- Full-screen auth layout (no `MenuBar`).
- Fields: first name, last name, email, username, password, confirm password.
- Email field uses shared `emailRules` from `frontend/src/config/validation.js` (required + regex format).
- Primary action: **Create account**.
- Link or button to navigate to login.
- Client-side validation before API call; server errors shown via `<v-alert type="error">`.



### [View: Dashboard placeholder] — route name `home`

- Minimal protected landing page shown after successful login (full dashboard built in Feature 2).
- Displays a welcome message using the user's first name.
- **No** `MenuBar` in Feature 1 — auth pages and this placeholder use a full-screen layout only.
- **Sign out** button on this page (standalone `v-btn`; removed from page content when `MenuBar` is added in Feature 2).

---



## Key Entities

- **User**: registered account (name, email, username, role); owns future lists and todos.
- **Session**: server-side record tying a JWT token to a user; expires after 24 hours.

---



## Data Model Requirements



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




### `sessions` table


| Field            | Type       | Rules                           |
| ---------------- | ---------- | ------------------------------- |
| `id`             | INTEGER PK | Auto-increment                  |
| `token`          | STRING     | Required                        |
| `email`          | STRING     | Required                        |
| `expirationDate` | DATE       | Required                        |
| `userId`         | INTEGER FK | Required, references `users.id` |


---



## Acceptance Criteria (Gherkin)



### US-1.1 — Registration



#### Scenario: User registers with valid information

- **Given** I am on the registration page
- **When** I enter valid first name, last name, email, username, password, and matching confirm password
- **And** I submit the form
- **Then** the API returns `201` with a user payload including `userId`, `username`, `email`, `token`, and `role`
- **And** my user record is stored in the database with a bcrypt password hash
- **And** I am redirected to the home page
- **And** my session is stored in `localStorage` under the key `user`



#### Scenario: User submits registration with missing email

- **Given** I am on the registration page
- **When** I leave the email field empty
- **And** I submit the form
- **Then** inline validation blocks the request
- **And** I see the message **"Email is required."**
- **And** no API request is sent



#### Scenario: User submits registration with invalid email format

- **Given** I am on the registration page
- **When** I enter a value that is not a valid email address (e.g. `notanemail`)
- **And** I submit the form
- **Then** inline validation blocks the request
- **And** I see the message **"Enter a valid email address."**
- **And** no API request is sent



#### Scenario: User submits registration with missing username

- **Given** I am on the registration page
- **When** I leave the username field empty
- **And** I submit the form
- **Then** inline validation blocks the request
- **And** I see the message **"Username is required."**
- **And** no API request is sent



#### Scenario: User submits registration with password too short

- **Given** I am on the registration page
- **When** I enter a password with fewer than 8 characters
- **And** I submit the form
- **Then** inline validation blocks the request
- **And** I see the message **"Password must be at least 8 characters."**



#### Scenario: User submits registration with mismatched passwords

- **Given** I am on the registration page
- **When** password and confirm password do not match
- **And** I submit the form
- **Then** inline validation blocks the request
- **And** I see the message **"Passwords do not match."**



#### Scenario: User registers with a duplicate username

- **Given** a user with username `jdoe` already exists
- **When** I submit registration with username `jdoe`
- **Then** the API returns `400` with `{ "message": "Username is already taken." }`
- **And** the error is displayed in a `<v-alert type="error">`



#### Scenario: User registers with a duplicate email

- **Given** a user with email `jane@example.com` already exists
- **When** I submit registration with email `jane@example.com`
- **Then** the API returns `400` with `{ "message": "Email is already registered." }`
- **And** the error is displayed in a `<v-alert type="error">`

---



### US-1.2 — Sign in



#### Scenario: User signs in with valid credentials

- **Given** I am on the login page
- **And** a registered user exists with username `jdoe` and a known password
- **When** I enter username `jdoe` and the correct password
- **And** I click **Sign in**
- **Then** the API returns `200` with a payload containing `userId`, `username`, `token`, and `role`
- **And** a session row is created or reused in the database
- **And** I am redirected to the home page
- **And** my session is stored in `localStorage` under the key `user`



#### Scenario: User signs in with invalid password

- **Given** I am on the login page
- **And** a registered user exists with username `jdoe`
- **When** I enter username `jdoe` and an incorrect password
- **And** I click **Sign in**
- **Then** the API returns `401` with `{ "message": "Invalid username or password." }`
- **And** I remain on the login page
- **And** the error is displayed in a `<v-alert type="error">`



#### Scenario: User signs in with missing username

- **Given** I am on the login page
- **When** I leave the username field empty
- **And** I click **Sign in**
- **Then** inline validation blocks the request
- **And** I see the message **"Username is required."**
- **And** no API request is sent



#### Scenario: User signs in with missing password

- **Given** I am on the login page
- **When** I leave the password field empty
- **And** I click **Sign in**
- **Then** inline validation blocks the request
- **And** I see the message **"Password is required."**
- **And** no API request is sent

---



### US-1.3 — Stay signed in across page loads



#### Scenario: Signed-in user visits login page

- **Given** I have a valid session in `localStorage`
- **When** I navigate to the login page
- **Then** I am redirected to the home page



#### Scenario: API request includes session token

- **Given** I am signed in
- **When** the frontend makes an authenticated API request
- **Then** the request includes header `Authorization: Bearer <token>`



#### Scenario: Protected API request succeeds with a valid session

- **Given** I am signed in as user A
- **And** user B also exists
- **When** I send an authenticated `GET /todo/lists` request
- **Then** the API returns `200`
- **And** only lists owned by user A are returned



#### Scenario: Expired or invalid session token

- **Given** I am signed in with an expired or revoked token
- **When** the frontend makes an authenticated API request
- **Then** the API returns `401` with an unauthorized message
- **And** `localStorage` key `user` is cleared
- **And** I am redirected to the login page

---



### US-1.4 — Sign out



#### Scenario: User signs out

- **Given** I am signed in on the home page
- **When** I click **Sign out**
- **Then** the API invalidates my session token on the server
- **And** `localStorage` key `user` is removed
- **And** I am redirected to the login page

---



### US-1.5 — Block unauthenticated access



#### Scenario: Unauthenticated user accesses a protected route

- **Given** I have no session in `localStorage`
- **When** I navigate directly to the home page
- **Then** I am redirected to the login page

---



## Test Coverage Map

Each scenario above must map to at least one automated test.


| Story  | Scenario                                            | Test file                                                             | Test name                                             |
| ------ | --------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------- |
| US-1.1 | User registers with valid information               | `backend/tests/auth.test.js`                                          | `User registers with valid information`               |
| US-1.1 | User submits registration with missing email        | `backend/tests/auth.test.js`                                          | `User submits registration with missing email`        |
| US-1.1 | User submits registration with invalid email format | `frontend/tests/Register.test.js`                                     | `User submits registration with invalid email format` |
| US-1.1 | User submits registration with missing username     | `frontend/tests/Register.test.js`                                     | `User submits registration with missing username`     |
| US-1.1 | User submits registration with password too short   | `backend/tests/auth.test.js`, `frontend/tests/Register.test.js`       | `User submits registration with password too short`   |
| US-1.1 | User submits registration with mismatched passwords | `frontend/tests/Register.test.js`                                     | `User submits registration with mismatched passwords` |
| US-1.1 | User registers with a duplicate username            | `backend/tests/auth.test.js`                                          | `User registers with a duplicate username`            |
| US-1.1 | User registers with a duplicate email               | `backend/tests/auth.test.js`                                          | `User registers with a duplicate email`               |
| US-1.2 | User signs in with valid credentials                | `backend/tests/auth.test.js`                                          | `User signs in with valid credentials`                |
| US-1.2 | User signs in with invalid password                 | `backend/tests/auth.test.js`, `frontend/tests/Login.test.js`          | `User signs in with invalid password`                 |
| US-1.2 | User signs in with missing username                 | `backend/tests/auth.test.js`, `frontend/tests/Login.test.js`          | `User signs in with missing username`                 |
| US-1.2 | User signs in with missing password                 | `backend/tests/auth.test.js`, `frontend/tests/Login.test.js`          | `User signs in with missing password`                 |
| US-1.3 | Signed-in user visits login page                    | `frontend/tests/router.test.js`                                       | `Signed-in user visits login page`                    |
| US-1.3 | API request includes session token                  | `backend/tests/authenticate.test.js`                                  | `API request includes session token`                  |
| US-1.3 | Protected API request succeeds with a valid session | `backend/tests/authenticate.test.js`                                  | `Protected API request succeeds with a valid session` |
| US-1.3 | Expired or invalid session token                    | `backend/tests/authenticate.test.js`                                  | `Expired or invalid session token`                    |
| US-1.4 | User signs out                                      | `backend/tests/auth.test.js`                                          | `User signs out`                                      |
| US-1.5 | Unauthenticated user accesses a protected route     | `backend/tests/authenticate.test.js`, `frontend/tests/router.test.js` | `Unauthenticated user accesses a protected route`     |


---



## Agent implementation request

Copy when asking Cursor to implement this feature (`@` this file):

```text
Implement Feature 1 from @features/feature-1-user-auth.md on branch `feature/1-user-auth`.

Follow layer order in @features/framework.md (models → routes → backend tests → frontend → frontend tests).
Map every Gherkin scenario in the Test Coverage Map; run `npm test` before finishing.
If API routes, payloads, schema, or product rules changed per this spec, update @features/reference/api.md, @features/reference/data-model.md, and/or @features/reference/behavior.md in the same PR to match shipped code.
Complete Definition of Done and the merge checklist in @features/framework.md.
Do not implement behavior not in this spec.
```

**Reference updates for this feature:** `features/reference/data-model.md`, `features/reference/api.md`, `features/reference/behavior.md`

---



## Definition of Done

- [x] Backend and frontend implemented per this spec (**FR-00N** satisfied)
- [x] **Success Criteria (SC-00N)** met
- [x] All mapped tests pass (`npm test`)
- [x] Test Coverage Map complete
- [x] `features/reference/data-model.md` updated (if schema changed)
- [x] `features/reference/api.md` updated (if API changed)
- [x] `features/reference/behavior.md` updated (if product rules changed)

---



## Out of Scope

- Password reset (`POST /todo/reset-password`)
- Email verification
- OAuth / social login
- Admin user management
- Full todo dashboard (Feature 2)

