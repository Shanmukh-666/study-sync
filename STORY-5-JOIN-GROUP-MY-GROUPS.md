# Story 5 - Join Group & My Groups

**Name:** M.V.Yamini  
**Register Number:** 24B91A0767

## 1. Story

> As a student, I want to join an existing study group and view all groups I created or joined so that I can participate in collaborative learning.

## 2. Objective

As **Member 5**, I implemented the Join Group and My Groups feature for StudySync. Authenticated students can join an available study group only when they are not already a member and when the group still has space. The backend also exposes an authenticated route that returns all groups where the current user is either the creator or a member, so the user can see their own groups in one place.

This story builds on the existing authentication, group creation, and group discovery flow already implemented in the project.

## 3. Completed Work

| Requirement | Status | Implementation |
| --- | --- | --- |
| Create join route | Complete | `POST /api/groups/:id/join` |
| Protect join route | Complete | JWT Bearer token authentication using existing middleware |
| Validate group ID | Complete | Reject invalid or non-integer group IDs |
| Return 404 for missing group | Complete | Express route returns `404 Group not found` |
| Prevent duplicate joining | Complete | Reject if user already exists in `members` relation |
| Prevent self-creator join | Complete | Reject if user is the group creator |
| Enforce member limit | Complete | Reject when group `currentMembers >= memberLimit` |
| Connect joined user as member | Complete | Add authenticated user into `Group.members` using Prisma relation |
| Create My Groups API | Complete | `GET /api/groups/my` |
| Return authenticated user groups | Complete | Groups where user is creator or member |
| Expose safe group payload | Complete | Returns group fields and creator/member metadata without exposing sensitive data |
| Create JoinGroupButton component | Complete | `frontend/src/components/JoinGroupButton.jsx` |
| Add Join Group button to dashboard cards | Complete | Displayed on existing group card/list cards |
| Create My Groups page | Complete | `frontend/src/pages/MyGroups.jsx` |
| Add frontend route | Complete | `/my-groups` in `frontend/src/App.jsx` |
| Add sidebar/dashboard navigation | Complete | My Groups link included in dashboard header |
| Verify backend behavior | Complete | Smoke-tested join, duplicate rejection, full-group rejection, and My Groups fetch |

## 4. Technology

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL with Prisma ORM
* **Authentication:** JSON Web Token (JWT) via existing middleware
* **Frontend:** React, React Router, Vite
* **Testing:** PowerShell curl and Node HTTP smoke tests

## 5. Files Changed

| File | Responsibility |
| --- | --- |
| `backend/routes/groups.js` | Added `GET /api/groups/my`, `POST /api/groups/:id/join`, and safe group-list response support |
| `backend/lib/prisma.js` | Fixed Prisma client runtime import compatibility for the local environment |
| `frontend/src/components/JoinGroupButton.jsx` | Join Group UI component for authentication, loading, success, failure, full-group, and disabled states |
| `frontend/src/pages/MyGroups.jsx` | My Groups page that fetches and renders groups created/joined by the current user |
| `frontend/src/App.jsx` | Added `/my-groups` route |
| `frontend/src/pages/Dashboard.jsx` | Integrated the Story 4 group cards/list with the Join Group button and member count display |

## 6. Backend API

The group routes are registered in `backend/server.js`:

```js
app.use("/api/groups", groupRoutes);
```

### Join an Existing Group

```text
POST /api/groups/:id/join
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

Example request:

```text
POST /api/groups/3/join
```

Successful response:

```json
{
  "message": "Joined group successfully",
  "groupId": 3
}
```

Validation and error responses:

| Status | Message | Meaning |
| --- | --- | --- |
| `400` | `A valid group ID is required` | Invalid group ID path parameter |
| `404` | `Group not found` | The target group does not exist |
| `409` | `You have already joined this group` | Duplicate join attempt |
| `409` | `You are already the creator of this group` | Creator tries to join own group |
| `400` | `Group is full` | Group reached member limit |
| `401` | `Authentication required` / `Invalid or expired token` | Missing or invalid JWT |

### My Groups

```text
GET /api/groups/my
Authorization: Bearer <jwt-token>
```

Successful response:

```json
{
  "groups": [
    {
      "id": 1,
      "subject": "Math",
      "name": "Math Club",
      "description": "Weekly math study group",
      "memberLimit": 4,
      "currentMembers": 3,
      "creator": {
        "id": 1,
        "email": "student@example.com"
      }
    }
  ]
}
```

The response is filtered so it only contains groups where the logged-in user is either the group creator or a member.

## 7. Frontend Join Group Flow

Created:

```text
frontend/src/components/JoinGroupButton.jsx
```

The component:

1. Reads the stored JWT from `localStorage`.
2. Uses the existing backend token format.
3. Sends `POST /api/groups/:id/join` with `Authorization: Bearer <token>`.
4. Shows `Joining...` while a request is pending.
5. Shows `Join Group` when the group has space.
6. Shows `Group Full` and disables the button when the group is full.
7. Shows backend error messages when a join fails.
8. Shows a success message after a successful join and triggers a card refresh.

## 8. My Groups Frontend Page

Created:

```text
frontend/src/pages/MyGroups.jsx
```

The page:

1. Reads the stored auth token from `localStorage`.
2. Calls `GET /api/groups/my`.
3. Shows a loading message while fetching.
4. Shows an error block if the request fails.
5. Shows an empty state if there are no groups.
6. Displays group cards with subject, name, description, creator, current member count, and member limit.

## 9. Dashboard Integration

The Story 4 dashboard group list is integrated with the join button using the existing card/list structure. The join control is rendered with a `JoinGroupButton` component and the count displayed as:

```text
currentMembers / memberLimit
```

This allows the UI to show whether a group is available or full without redesigning the existing layout.

## 10. Testing Performed

I verified the join and My Groups backend behavior locally with HTTP smoke tests using the live backend server.

The test flow covered:

1. Register two users.
2. Login both users using JWT.
3. Create a group with a creator.
4. Join that group using a second user.
5. Confirm duplicate join is rejected with `409`.
6. Confirm creator trying to join own group is rejected with `409`.
7. Confirm `GET /api/groups/my` returns groups for creator and member.

The backend list endpoint also confirmed that `currentMembers` is exposed by the group response for the frontend display.
