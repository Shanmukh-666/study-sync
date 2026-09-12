# STORY 5 – JOIN GROUP & MY GROUPS

## Student Details

- **Name:** M.V.Yamini
- **Register Number:** 24B91A0767
- **Story:** Story 5 – Join Group & My Groups

---

## 1. User Story

As a student, I want to join available study groups and view the groups I have created or joined, so that I can easily manage my study groups.

---

## 2. Objective

The objective of Story 5 is to:

- Allow authenticated users to join a study group.
- Prevent users from joining a group when the member limit has been reached.
- Prevent a user from joining the same group more than once.
- Provide a My Groups page where users can view groups they created or joined.
- Prepare a reusable Join Group button for integration with the group cards from Story 4.

---

## 3. Technology Used

### Frontend
- React
- Vite
- Tailwind CSS
- JavaScript

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL

### Authentication
- JWT
- Existing authentication middleware

---

## 4. Completed Work

### 4.1 Join Group Backend API

Implemented:

`POST /api/groups/:id/join`

The endpoint:

1. Checks whether the user is authenticated.
2. Validates the group ID.
3. Checks whether the group exists.
4. Checks whether the user has already joined the group.
5. Checks the group member limit.
6. Adds the authenticated user to the group's members.
7. Returns a success or error message.

### 4.2 Full Group Validation

The creator is counted as a group member even though the creator is stored separately using `creatorId`.

The join operation is blocked when adding another member would exceed the configured `memberLimit`.

The API returns:

`This group is full`

when the group cannot accept another member.

### 4.3 My Groups Backend API

Implemented:

`GET /api/groups/my`

This endpoint returns groups where the authenticated user is:

- The creator of the group, or
- A member of the group.

The response also includes creator and member information.

---

## 5. Frontend Implementation

### 5.1 JoinGroupButton Component

Created:

`frontend/src/components/JoinGroupButton.jsx`

The component:

- Displays **Join Group** when a group has space.
- Displays **Joining...** while the request is being processed.
- Displays **Group Full** when the group is full.
- Sends the JWT token with the request.
- Displays success/error messages.
- Supports an `onJoined` callback after a successful join.

### 5.2 My Groups Page

Created:

`frontend/src/pages/MyGroups.jsx`

The page:

- Fetches the user's groups from the backend.
- Sends the JWT token for authentication.
- Displays loading and error states.
- Displays groups created or joined by the user.
- Shows the current member count.
- Shows the configured member limit.
- Provides navigation to the Dashboard and My Groups pages.

### 5.3 Routing

Updated:

`frontend/src/App.jsx`

Added the route:

`/my-groups`

which displays the My Groups page.

---

## 6. Story 4 Integration Dependency

The Join Group button is required to appear on the group cards from Story 4.

For Story 5:

- The reusable `JoinGroupButton` component has been implemented.
- It is ready to be integrated into the group cards.
- The actual integration depends on the group-list/card UI being implemented under Story 4.

Therefore, the Story 5 implementation does **not** claim that the button has already been integrated into the Story 4 cards.

---

## 7. Authentication

All Story 5 protected APIs use the existing JWT authentication middleware.

The frontend retrieves the token from local storage and sends it using:

`Authorization: Bearer <token>`

This ensures that users can only join groups and view their own groups after authentication.

---

## 8. Files Changed

### Backend

- `backend/routes/groups.js`

Added:

- Join Group API
- My Groups API

The existing Story 3 group creation implementation was retained while adding the Story 5 functionality.

### Frontend

- `frontend/src/components/JoinGroupButton.jsx`
- `frontend/src/pages/MyGroups.jsx`
- `frontend/src/App.jsx`

---

## 9. API Summary

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/groups/:id/join` | Join a study group |
| GET | `/api/groups/my` | Get groups created or joined by the logged-in user |

---

## 10. Testing Performed

The Story 5 APIs were manually tested using authenticated requests.

### Join Group

- A user successfully joined an available group.
- A user attempting to join the same group again was rejected.
- A user attempting to join a full group was rejected with a clear message.

### My Groups

- Initially, the API returned an empty list when the user had no groups.
- After creating/joining groups, the groups appeared in the My Groups response.
- Creator and member information was returned correctly.

---

## 11. Acceptance Criteria

| Requirement | Status |
|---|---|
| Authenticated user can join a group | Completed |
| Full group cannot accept new members | Completed |
| Duplicate group joining is prevented | Completed |
| Joined/created groups appear in My Groups | Completed |
| Join button component is implemented | Completed |
| Join button integrated into Story 4 group cards | Pending Story 4 UI integration |

---

## 12. Completion Summary

Story 5 backend and frontend functionality has been implemented.

The Join Group API handles authentication, duplicate membership, group existence, and member-limit validation. The My Groups API and frontend page allow users to view groups they created or joined.

The reusable Join Group button is also implemented and is ready to be connected to the group cards from Story 4 once that UI is available.
