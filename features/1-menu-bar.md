# Feature: Menu Bar & User Navigation

**Feature ID:** 1

**Branch pattern:** `feature/1-menu-bar` 

**Status:** {Draft | Ready | Shipped}
**Created:** 2026-09-13 

**Input:** The user needs a way to navigate between screens and access their profile at all times, therefore there needs to be a menu bar.

---

## User Stories

### US-1.1: Navigate Using the Menu Bar

**As a** user **I want to** use the menu bar to navigate between the main sections of the recipe app **So that** I can quickly access recipes, saved recipes, and other important areas of the app.

**Priority:** P1  
**Independent test:** Select each menu bar option and verify that it navigates to the correct section of the recipe app.

**Acceptance scenarios:** see ### US-1.1 under Acceptance Criteria.

---



## Requirements



### Functional Requirements

- **FR-001**: The menu bar MUST provide a **Recipes** navigation option that takes the user to the Recipes page when selected.
- **FR-002**: The menu bar MUST provide an **Ingredients** navigation option that takes the user to the Ingredients page when selected.
- **FR-003**: The menu bar MUST display the **OC logo**.
- **FR-004**: The menu bar MUST display the **title of the page currently being viewed**.
- **FR-005**: The menu bar MUST display the logged-in user's **initials** as a profile button.
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
- **FR-016**: The application MUST display a notification when a **Login** operation succeeds or fails.
- **FR-017**: The application MUST display a notification when a **Logout** operation succeeds or fails.
- **FR-018**: Selecting a menu bar navigation option MUST take the user to the corresponding page without requiring the user to manually enter a URL.

---



## Assumptions

- This is Feature 1, so there are no other application features implemented yet.
- The user must be logged in for the profile section to display their initials, full name, and email.
- User account information, including initials, full name, and email address, is available to the application after login.
- The Recipes and Ingredients pages are valid navigation destinations, even if their full functionality has not yet been implemented.
- The OC logo is a static element and does not require user interaction unless otherwise specified.
- The current page title can be determined by the application and displayed in the menu bar.
- The notification system will be designed as a reusable Vue component or function so that future features can use it.
- Create, Update, Delete, Login, and Logout operations will use the notification system when those operations are implemented.
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
- **SC-006**: Successful Create, Update, Delete, Login, and Logout operations display a green notification.
- **SC-007**: Unsuccessful Create, Update, Delete, Login, and Logout operations display a red notification.
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



## Acceptance Criteria (Gherkin)



### US-1.1 — Menu Bar Navigation



#### Scenario: User navigates to the Recipes page

- **Given** I am logged into the recipe application
- **And** I am viewing a page that is not the Recipes page
- **When** I select **Recipes** from the menu bar
- **Then** I am navigated to the Recipes page
- **And** the menu bar displays **Recipes** as the current page title



#### Scenario: User navigates to the Ingredients page

- **Given** I am logged into the recipe application
- **And** I am viewing a page that is not the Ingredients page
- **When** I select **Ingredients** from the menu bar
- **Then** I am navigated to the Ingredients page
- **And** the menu bar displays **Ingredients** as the current page title



#### Scenario: Menu bar displays the OC logo

- **Given** I am viewing a page in the recipe application
- **When** the page loads
- **Then** I see the OC logo in the menu bar



#### Scenario: Menu bar displays the current page title

- **Given** I am viewing a page in the recipe application
- **When** the page loads
- **Then** the menu bar displays the title of the current page

