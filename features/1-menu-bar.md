# Feature: Menu Bar & User Navigation

**Feature ID:** 1

**Branch pattern:** `feature/1-menu-bar` 

**Status:** Ready
**Created:** 2026-09-13 

**Input:** The user needs a way to navigate between screens and access their profile at all times, therefore there needs to be a menu bar.

---

## User Stories

### US-1.1: Navigate Using the Menu Bar

**As a** signed-in user
**I want to** select **Recipes** or **Ingredients** in the menu bar
**So that** I can move between those sections without typing a URL

**Priority:** P1  
**Independent test:** From a page that is not Recipes, select **Recipes** and land on the Recipes page; from a page that is not Ingredients, select **Ingredients** and land on the Ingredients page.  
**Acceptance scenarios:** see ### US-1.1 under Acceptance Criteria.

---

### US-1.2: See Branding and the Current Page Title

**As a** signed-in user
**I want to** see the OC logo and the title of the page I am viewing in the menu bar
**So that** I can tell which app I am in and which section I am on

**Priority:** P1  
**Independent test:** Load any page and confirm the menu bar shows the OC logo and the current page title.  
**Acceptance scenarios:** see ### US-1.2 under Acceptance Criteria.

---

### US-1.3: Open My Profile from the Menu Bar

**As a** signed-in user
**I want to** select my initials in the menu bar and see my name and email
**So that** I can confirm which account I am using

**Priority:** P1  
**Independent test:** While signed in, confirm the menu bar shows my initials; select them and see a profile card with my full name, email address, and a **Logout** button.  
**Acceptance scenarios:** see ### US-1.3 under Acceptance Criteria.

---

### US-1.4: Log Out from the Profile Card

**As a** signed-in user
**I want to** log out from the profile card
**So that** I can end my session on this device

**Priority:** P1  
**Independent test:** Open the profile card, select **Logout**, and confirm I am logged out.  
**Acceptance scenarios:** see ### US-1.4 under Acceptance Criteria.

---

### US-1.5: See Reusable Success and Failure Notifications

**As a** user
**I want to** see a notification at the bottom of the screen when an operation succeeds or fails, and dismiss it
**So that** I know whether my action worked without the message blocking the page

**Priority:** P1  
**Independent test:** Trigger a successful operation and see a green notification at the bottom of the screen; trigger a failed operation and see a red notification; dismiss it with **Close**. Confirm the same notification can appear on more than one page.  
**Acceptance scenarios:** see ### US-1.5 under Acceptance Criteria.

---

### US-1.6: Get Notified for Create, Update, Delete, and Logout

**As a** user
**I want to** receive a notification when Create, Update, Delete, or Logout succeeds or fails
**So that** I know the result of those operations wherever they happen in the app

**Priority:** P1  
**Independent test:** For each of Create, Update, Delete, and Logout, complete a successful attempt and a failed attempt and confirm a notification appears each time.  
**Acceptance scenarios:** see ### US-1.6 under Acceptance Criteria.

---

## Requirements

### Functional Requirements

- **FR-001**: The menu bar MUST provide a **Recipes** navigation option that takes the user to the Recipes page when selected.
- **FR-002**: The menu bar MUST provide an **Ingredients** navigation option that takes the user to the Ingredients page when selected.
- **FR-003**: The menu bar MUST display the **OC logo**.
- **FR-004**: The menu bar MUST display the **title of the page currently being viewed**.
- **FR-005**: The menu bar MUST display the user's **initials** as a profile button in the top right. Until a signed-in user exists, it MUST show placeholder initials **JD**.
- **FR-006**: When the user selects their initials, the application MUST display a small profile card containing the user's **full name, email address, and a Logout button**.
- **FR-007**: The profile card MUST provide a **Logout** button that allows the user to log out of the application.
- **FR-008**: The application MUST display a reusable notification at the **bottom of the screen** when an operation is successful or unsuccessful.
- **FR-009**: Successful operations MUST display the notification using a **green** visual style.
- **FR-010**: Unsuccessful operations MUST display the notification using a **red** visual style.
- **FR-011**: Notifications MUST include a **Close** button that allows the user to dismiss the notification.
- **FR-012**: The notification functionality MUST be implemented as a **separate reusable Vue function/component or file** so that it can be used on multiple pages throughout the application.
- **FR-013**: The application MUST display a notification when a **Create** operation succeeds or fails.
- **FR-014**: The application MUST display a notification when an **Update** operation succeeds or fails.
- **FR-015**: The application MUST display a notification when a **Delete** operation succeeds or fails.
- **FR-016**: The application MUST display a notification when a **Logout** operation succeeds or fails.
- **FR-017**: Selecting a menu bar navigation option MUST take the user to the corresponding page without requiring the user to manually enter a URL.
- **FR-018**: The menu bar MUST NOT provide a **Login** navigation option.
- **FR-019**: Opening the application MUST show the menu bar on the Recipes page and MUST NOT show a login screen.

---

## Assumptions

- This is Feature 1, so there are no other application features implemented yet.
- The user must be logged in for a real profile; until authentication exists, the menu bar shows a placeholder profile (**JD** / Jane Doe / jane@example.com) with the same card and **Logout** behavior.
- When a signed-in user is available, that user's initials, full name, and email replace the placeholder.
- The Recipes and Ingredients pages are valid navigation destinations, even if their full functionality has not yet been implemented.
- The OC logo is a static element and does not require user interaction unless otherwise specified.
- The current page title can be determined by the application and displayed in the menu bar.
- The notification system will be designed as a reusable Vue component or function so that future features can use it.
- Create, Update, Delete, and Logout operations will use the notification system when those operations are implemented.
- Users can only access their own profile information.

## Edge Cases

- **User closes a notification** → The notification MUST disappear without affecting the operation that generated it.
- **Multiple notifications** → The application MUST handle multiple notifications without causing the menu bar or page content to become unusable.
- **Navigation to the current page** → Selecting the menu option for the page the user is already viewing MUST NOT cause an error.

## Success Criteria

- **SC-001**: Every Gherkin scenario has at least one automated test before merge.
- **SC-002**: Users can navigate to the Recipes and Ingredients pages using the menu bar.
- **SC-003**: The menu bar displays the OC logo and the title of the current page.
- **SC-004**: The logged-in user's initials are displayed correctly in the profile button.
- **SC-005**: Selecting the profile button displays the user's full name, email address, and Logout button.
- **SC-006**: Successful Create, Update, Delete, and Logout operations display a green notification.
- **SC-007**: Unsuccessful Create, Update, Delete, and Logout operations display a red notification.
- **SC-008**: Users can close notifications using the Close button.
- **SC-009**: The notification functionality can be reused by other pages without duplicating its implementation.
- **SC-010**: No user can access another user's profile information through the menu bar.

---

## Data Ownership & Isolation (foundation)

Feature 1 establishes identity; Features 2–3 enforce per-user data boundaries.

- Each user account is a separate tenant boundary for recipes lists and items.
- No API in this feature returns another user's profile or session.
- Later features must never expose lists or recipes across users — not in list responses, detail views, or error messages that confirm another user's resource exists.

---

## Key Entities

- **Notification**: A temporary message displayed to communicate whether an operation was successful or unsuccessful. Notifications are reusable across the application and are not user-owned data.

## Screen Requirements

- Menu bar is shown on Feature 1 pages, including when the app first loads.
- The application opens on **Recipes** (`/recipes`). `/` redirects there. There is no login screen in this feature.
- Menu bar contains: OC logo (static), current page title, **Recipes**, **Ingredients**, and a profile circle in the top right (placeholder **JD** until a signed-in user exists). The menu bar MUST NOT include a **Login** control.
- Selecting **Recipes** goes to `/recipes`. Selecting **Ingredients** goes to `/ingredients`.
- Selecting initials opens a profile card with full name, email, and **Logout**. The placeholder uses **Jane Doe** and **jane@example.com**.
- Reusable notifications appear at the bottom of the screen (`AppNotification` + `useNotification`), green for success and red for failure, with a **Close** button.

## Acceptance Criteria (Gherkin)

### US-1.1 — Navigate Using the Menu Bar

#### Scenario: User navigates to the Recipes page

- **Given** I am logged into the recipe application
- **When** I select **Recipes** from the menu bar
- **Then** I am navigated to the Recipes page

#### Scenario: User navigates to the Ingredients page

- **Given** I am logged into the recipe application
- **When** I select **Ingredients** from the menu bar
- **Then** I am navigated to the Ingredients page

#### Scenario: User selects the menu option for the current page

- **Given** I am logged into the recipe application
- **When** I select **Recipes** from the menu bar
- **Then** I remain on the Recipes page

#### Scenario: Menu bar does not include a Login option

- **Given** I am viewing a page with the menu bar
- **When** the page loads
- **Then** I do not see a **Login** option in the menu bar

#### Scenario: Application opens on Recipes with the menu bar

- **Given** I open the application
- **When** the app loads
- **Then** I am on the Recipes page
- **And** I see the menu bar
- **And** I do not see a login screen

### US-1.2 — See Branding and the Current Page Title

#### Scenario: Menu bar displays the OC logo

- **Given** I am viewing a page in the recipe application
- **When** the page loads
- **Then** I see the OC logo in the menu bar

#### Scenario: Menu bar displays the current page title

- **Given** I am viewing a page in the recipe application
- **When** the page loads
- **Then** the menu bar displays the title of the current page

#### Scenario: Page title updates after navigation

- **Given** I am logged into the recipe application
- **And** I am viewing a page that is not the Recipes page
- **When** I select **Recipes** from the menu bar
- **Then** the menu bar displays **Recipes** as the current page title

### US-1.3 — Open My Profile from the Menu Bar

#### Scenario: Menu bar displays the signed-in user's initials

- **Given** I am logged into the recipe application as a user whose name produces initials **JD**
- **When** the page loads
- **Then** the menu bar displays **JD** as the profile button

#### Scenario: User opens the profile card

- **Given** I am logged into the recipe application
- **And** my full name and email address are available to the application
- **When** I select my initials in the menu bar
- **Then** I see a profile card
- **And** the profile card displays my full name, email address, and a **Logout** button

### US-1.4 — Log Out from the Profile Card

#### Scenario: User logs out from the profile card

- **Given** I am logged into the recipe application
- **And** the profile card is open
- **When** I select **Logout**
- **Then** I am logged out of the application

### US-1.5 — See Reusable Success and Failure Notifications

#### Scenario: Successful operation shows a green notification at the bottom of the screen

- **Given** I am using the recipe application
- **When** an operation succeeds
- **Then** a notification is displayed at the bottom of the screen
- **And** the notification uses a green visual style

#### Scenario: Unsuccessful operation shows a red notification at the bottom of the screen

- **Given** I am using the recipe application
- **When** an operation fails
- **Then** a notification is displayed at the bottom of the screen
- **And** the notification uses a red visual style

#### Scenario: User closes a notification

- **Given** a notification is displayed at the bottom of the screen
- **When** I select **Close** on the notification
- **Then** the notification disappears
- **And** the operation that generated it is not undone

#### Scenario: Multiple notifications do not block the page

- **Given** more than one notification is displayed
- **When** I view the page
- **Then** the menu bar remains usable
- **And** the page content remains usable

#### Scenario: The same notification can appear on more than one page

- **Given** I am viewing the Recipes page
- **And** a notification is displayed at the bottom of the screen
- **When** I navigate to the Ingredients page
- **And** an operation succeeds or fails on that page
- **Then** a notification is displayed at the bottom of the Ingredients page
- **And** it uses the same notification behavior as on the Recipes page

### US-1.6 — Get Notified for Create, Update, Delete, and Logout

#### Scenario: Successful Create shows a notification

- **Given** I am using the recipe application
- **When** a Create operation succeeds
- **Then** a notification is displayed

#### Scenario: Unsuccessful Create shows a notification

- **Given** I am using the recipe application
- **When** a Create operation fails
- **Then** a notification is displayed

#### Scenario: Successful Update shows a notification

- **Given** I am using the recipe application
- **When** an Update operation succeeds
- **Then** a notification is displayed

#### Scenario: Unsuccessful Update shows a notification

- **Given** I am using the recipe application
- **When** an Update operation fails
- **Then** a notification is displayed

#### Scenario: Successful Delete shows a notification

- **Given** I am using the recipe application
- **When** a Delete operation succeeds
- **Then** a notification is displayed

#### Scenario: Unsuccessful Delete shows a notification

- **Given** I am using the recipe application
- **When** a Delete operation fails
- **Then** a notification is displayed

#### Scenario: Successful Logout shows a notification

- **Given** I am logged into the recipe application
- **When** a Logout operation succeeds
- **Then** a notification is displayed

#### Scenario: Unsuccessful Logout shows a notification

- **Given** I am logged into the recipe application
- **When** a Logout operation fails
- **Then** a notification is displayed

---

## Test Coverage Map

Each scenario above must map to at least one automated test.

| Story | Scenario | Test file | Test name |
|-------|----------|-----------|-----------|
| US-1.1 | User navigates to the Recipes page | `frontend/tests/MenuBar.test.js` | `User navigates to the Recipes page` |
| US-1.1 | User navigates to the Ingredients page | `frontend/tests/MenuBar.test.js` | `User navigates to the Ingredients page` |
| US-1.1 | User selects the menu option for the current page | `frontend/tests/MenuBar.test.js` | `User selects the menu option for the current page` |
| US-1.1 | Menu bar does not include a Login option | `frontend/tests/MenuBar.test.js` | `Menu bar does not include a Login option` |
| US-1.1 | Application opens on Recipes with the menu bar | `frontend/tests/MenuBar.test.js` | `Application opens on Recipes with the menu bar` |
| US-1.2 | Menu bar displays the OC logo | `frontend/tests/MenuBar.test.js` | `Menu bar displays the OC logo` |
| US-1.2 | Menu bar displays the current page title | `frontend/tests/MenuBar.test.js` | `Menu bar displays the current page title` |
| US-1.2 | Page title updates after navigation | `frontend/tests/MenuBar.test.js` | `Page title updates after navigation` |
| US-1.3 | Menu bar displays the signed-in user's initials | `frontend/tests/MenuBar.test.js` | `Menu bar displays the signed-in user's initials` |
| US-1.3 | User opens the profile card | `frontend/tests/MenuBar.test.js` | `User opens the profile card` |
| US-1.4 | User logs out from the profile card | `frontend/tests/MenuBar.test.js` | `User logs out from the profile card` |
| US-1.5 | Successful operation shows a green notification at the bottom of the screen | `frontend/tests/AppNotification.test.js` | `Successful operation shows a green notification at the bottom of the screen` |
| US-1.5 | Unsuccessful operation shows a red notification at the bottom of the screen | `frontend/tests/AppNotification.test.js` | `Unsuccessful operation shows a red notification at the bottom of the screen` |
| US-1.5 | User closes a notification | `frontend/tests/AppNotification.test.js` | `User closes a notification` |
| US-1.5 | Multiple notifications do not block the page | `frontend/tests/AppNotification.test.js` | `Multiple notifications do not block the page` |
| US-1.5 | The same notification can appear on more than one page | `frontend/tests/AppNotification.test.js` | `The same notification can appear on more than one page` |
| US-1.6 | Successful Create shows a notification | `frontend/tests/OperationNotifications.test.js` | `Successful Create shows a notification` |
| US-1.6 | Unsuccessful Create shows a notification | `frontend/tests/OperationNotifications.test.js` | `Unsuccessful Create shows a notification` |
| US-1.6 | Successful Update shows a notification | `frontend/tests/OperationNotifications.test.js` | `Successful Update shows a notification` |
| US-1.6 | Unsuccessful Update shows a notification | `frontend/tests/OperationNotifications.test.js` | `Unsuccessful Update shows a notification` |
| US-1.6 | Successful Delete shows a notification | `frontend/tests/OperationNotifications.test.js` | `Successful Delete shows a notification` |
| US-1.6 | Unsuccessful Delete shows a notification | `frontend/tests/OperationNotifications.test.js` | `Unsuccessful Delete shows a notification` |
| US-1.6 | Successful Logout shows a notification | `frontend/tests/OperationNotifications.test.js` | `Successful Logout shows a notification` |
| US-1.6 | Unsuccessful Logout shows a notification | `frontend/tests/OperationNotifications.test.js` | `Unsuccessful Logout shows a notification` |

### Auditing coverage

```bash
# Find all tests for a story
rg "US-1.1" features/ backend/tests frontend/tests

# Find a scenario across spec and tests
rg "User navigates to the Recipes page" features/ backend/tests frontend/tests
```

Every `#### Scenario` in this spec must have ≥1 matching `it`. Every Feature 1 `it` must trace to a scenario.

## Agent implementation request

Copy when asking Cursor to implement this feature (`@` this file):

```text
Implement Feature 1 from @features/1-menu-bar.md on branch `feature/1-menu-bar`.

Follow layer order in @features/framework.md (models → routes → backend tests → frontend → frontend tests).
Map every Gherkin scenario in the Test Coverage Map; run `npm test` before finishing.
If API routes, payloads, schema, or product rules changed per this spec, update @features/reference/api.md, @features/reference/data-model.md, and/or @features/reference/behavior.md in the same PR to match shipped code.
Complete Definition of Done and the merge checklist in @features/framework.md.
Do not implement behavior not in this spec.
```

**Reference updates for this feature:** `behavior.md` (menu bar navigation, profile card, reusable notifications). Update `api.md` and/or `data-model.md` only if logout, session, or user profile fields change from shipped code.

## Definition of Done

*   [x] Backend and frontend implemented per this spec (**FR-00N** satisfied)
*   [x] **Success Criteria (SC-00N)** met
*   [x] All mapped tests pass (`npm test`)
*   [x] Test Coverage Map complete
*   [x] `features/reference/data-model.md` updated (if schema changed) — no schema change
*   [x] `features/reference/api.md` updated (if API changed) — no route/payload change
*   [x] `features/reference/behavior.md` updated (if product rules changed)

## Out of Scope

*   Login and account creation (no login screen in this feature)
*   Full recipe, ingredient, and step management as separately specified features
*   Making the OC logo a navigation control
*   A Saved Recipes destination (not in FR-001–FR-019)
