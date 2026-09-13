# Story 4 - Group Discovery & Search

**Name:** Lahari Kayitha
**Register Number:** 24B91A0747

## 1. Story

> As a student, I want to search for study groups by subject so that I can find one that matches my course.

## 2. Objective

As **Member 4**, I implemented group discovery and search for StudySync. Authenticated students can browse all existing study groups, search by group name, subject, or description, view member capacity, and open a group details page.

This story implements the Group Discovery & Search requirements from the BRD and TDD. It builds on authentication from Story 2 and group creation from Story 3. Joining a group is handled by Story 5.

## 3. Completed Work

| Requirement                             | Status   | Implementation                                       |
| --------------------------------------- | -------- | ---------------------------------------------------- |
| Create group listing API                | Complete | `GET /api/groups`                                    |
| Protect group listing                   | Complete | JWT Bearer authentication                            |
| Return all groups by default            | Complete | Prisma group query                                   |
| Support subject filtering               | Complete | Optional `subject` query parameter                   |
| Build Browse Groups page                | Complete | `frontend/src/pages/Dashboard.jsx`                   |
| Display groups as cards                 | Complete | Responsive Tailwind card grid                        |
| Add search input                        | Complete | Client-side search on name, subject, and description |
| Show current member count               | Complete | `currentMembers / memberLimit`                       |
| Link cards to group details             | Complete | `/groups/:id` route                                  |
| Handle loading, error, and empty states | Complete | Dashboard UI states                                  |

## 4. Technology

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JSON Web Token (JWT)
- **Frontend:** React, React Router, Vite, Tailwind CSS

## 5. Files Changed

| File                               | Responsibility                                                         |
| ---------------------------------- | ---------------------------------------------------------------------- |
| `backend/routes/groups.js`         | Authenticated group listing, subject filtering, and safe response data |
| `backend/server.js`                | Mounts routes at `/api/groups`                                         |
| `frontend/src/pages/Dashboard.jsx` | Browse page, search input, tabs, and group cards                       |
| `frontend/src/App.jsx`             | Registers dashboard and group details routes                           |

## 6. Backend API

### Browse Groups

```text
GET /api/groups
Authorization: Bearer <jwt-token>
```

The endpoint returns all groups by default, ordered with the newest groups first.

### Filter by Subject

```text
GET /api/groups?subject=Math
Authorization: Bearer <jwt-token>
```

The `subject` query parameter is optional. When supplied, only groups with the matching subject are returned.

Successful response: `200 OK`

```json
{
  "groups": [
    {
      "id": 1,
      "subject": "Math",
      "name": "Math Study Group",
      "description": "Weekly problem-solving sessions",
      "memberLimit": 5,
      "currentMembers": 2,
      "memberIds": [],
      "scheduledAt": null,
      "location": null,
      "meetingLink": null,
      "creator": {
        "id": 1,
        "email": "student@example.com"
      }
    }
  ]
}
```

| Status | Message                                                 | Meaning                             |
| ------ | ------------------------------------------------------- | ----------------------------------- |
| `401`  | `Authentication required` or `Invalid or expired token` | No valid JWT was supplied           |
| `500`  | `Failed to fetch groups`                                | Unexpected server or database error |

Sensitive user data, including passwords, is not returned.

## 7. Browse Groups Frontend Flow

The dashboard:

1. Reads the JWT from `localStorage`.
2. Calls `GET /api/groups`.
3. Shows a loading state while groups are fetched.
4. Shows an error state when the request fails.
5. Displays all groups by default.
6. Filters visible cards using the search input.
7. Provides All Groups, My Groups, and Joined Groups tabs.
8. Shows a no-results message when no card matches.
9. Opens `/groups/:id` when a card is selected.

## 8. Group Card Information

Each card displays:

- Subject
- Group name
- Description preview, when available
- Current member count and member limit
- Scheduled date and time, when available
- Physical location, when available
- Link to group details
- Join control supplied by Story 5

The capacity is shown as:

```text
currentMembers / memberLimit
```

The backend calculates the current count using the creator plus the joined members.

## 9. Manual Acceptance Checks

| Check                                        | Expected result                                     |
| -------------------------------------------- | --------------------------------------------------- |
| Open the dashboard with a valid JWT          | All existing groups are visible by default          |
| Search for an existing group name or subject | Matching groups remain visible                      |
| Search for a value with no matches           | A no-results message is displayed                   |
| Inspect a group card                         | Name, subject, and current member count are visible |
| Select a group card                          | The group details page opens                        |
| Call the API without a valid JWT             | The request is rejected with `401`                  |
| Resize the browser to mobile width           | The group list remains usable and readable          |

## 10. Completion Summary

Story 4 provides the discovery layer for StudySync. Students can browse groups, filter the list, review capacity information, and open group details before joining a group.
