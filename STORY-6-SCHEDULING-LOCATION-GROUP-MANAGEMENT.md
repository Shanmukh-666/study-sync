# Story 6 - Scheduling, Location & Group Management

**Name:** Purnasai Koppadi
**Register Number:** 24B91A61B7

## 1. Story

> As a group creator, I want to set a schedule and location for my study group and manage the group if plans change.

## 2. Objective

As **Member 6**, I implemented scheduling, meeting information, group details, leaving a group, and creator-only group deletion for StudySync. Group creators can provide a session date and time, a physical location, or an online meeting link. Students can view these details from the group details page.

This story implements the Scheduling, Location & Group Management requirements from the BRD and TDD. It builds on group creation from Story 3 and authentication from Story 2.

## 3. Completed Work

| Requirement                        | Status   | Implementation                            |
| ---------------------------------- | -------- | ----------------------------------------- |
| Store session date and time        | Complete | Optional `scheduledAt` field in Prisma    |
| Store physical meeting location    | Complete | Optional `location` field in Prisma       |
| Store online meeting link          | Complete | Optional `meetingLink` field in Prisma    |
| Fetch group details                | Complete | `GET /api/groups/:id`                     |
| Display schedule and location/link | Complete | `frontend/src/pages/GroupDetails.jsx`     |
| Allow joined members to leave      | Complete | `DELETE /api/groups/:id/leave`            |
| Delete a group as creator          | Complete | `DELETE /api/groups/:id`                  |
| Restrict deletion to creator       | Complete | Authenticated creator ownership check     |
| Add creator delete control         | Complete | Delete button shown only to creator       |
| Add member leave control           | Complete | Leave button shown only to joined members |

## 4. Technology

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JSON Web Token (JWT)
- **Frontend:** React, React Router, Vite, Tailwind CSS

## 5. Files Changed

| File                                  | Responsibility                                              |
| ------------------------------------- | ----------------------------------------------------------- |
| `backend/prisma/schema.prisma`        | Defines `scheduledAt`, `location`, and `meetingLink` fields |
| `backend/routes/groups.js`            | Group details, leave, and creator-only delete APIs          |
| `frontend/src/pages/CreateGroup.jsx`  | Collects schedule and meeting information during creation   |
| `frontend/src/pages/GroupDetails.jsx` | Displays group information and management actions           |
| `frontend/src/App.jsx`                | Registers the `/groups/:id` route                           |

## 6. Database Fields

The `Group` model supports the following optional fields:

```prisma
location    String?
meetingLink String?
scheduledAt DateTime?
```

These fields are optional so a group can be created before its meeting details are finalized.

## 7. Backend API

All group management routes require:

```text
Authorization: Bearer <jwt-token>
```

### Get Group Details

```text
GET /api/groups/:id
```

The response includes the group, creator metadata, members, schedule, location, and meeting link.

### Leave a Group

```text
DELETE /api/groups/:id/leave
```

Only a joined member can leave. The creator cannot leave their own group.

Successful response:

```json
{
  "message": "Left group successfully"
}
```

### Delete a Group

```text
DELETE /api/groups/:id
```

Only the authenticated creator can delete the group.

Successful response:

```json
{
  "message": "Group deleted successfully"
}
```

Validation and error responses:

| Status | Message                                        | Meaning                             |
| ------ | ---------------------------------------------- | ----------------------------------- |
| `400`  | Leave validation message                       | Invalid leave action                |
| `401`  | Authentication error                           | Missing or invalid JWT              |
| `403`  | `Only the group creator can delete this group` | Non-creator attempted deletion      |
| `404`  | `Group not found`                              | The group does not exist            |
| `500`  | Operation failure message                      | Unexpected server or database error |

## 8. Frontend Group Details Flow

The page in `frontend/src/pages/GroupDetails.jsx`:

1. Reads the group ID from the URL.
2. Fetches details using the authenticated API request.
3. Displays the subject, name, description, and creator.
4. Displays the scheduled date and time when present.
5. Displays the physical location when present.
6. Displays an online meeting link when present.
7. Shows Delete Group only to the creator.
8. Shows Leave Group only to a joined non-creator member.
9. Confirms destructive actions before submitting them.
10. Returns to the dashboard after a successful delete or leave operation.

## 9. Manual Acceptance Checks

| Check                                            | Expected result                                             |
| ------------------------------------------------ | ----------------------------------------------------------- |
| Create a group with schedule and location        | Details are saved and displayed on the details page         |
| Create a group with an online meeting link       | A Join Meeting link is displayed                            |
| Open a group details page without authentication | The request is rejected or login is required                |
| View a group as its creator                      | Delete Group is visible                                     |
| View a group as a non-creator                    | Delete Group is not available                               |
| Attempt to delete another user's group           | API returns `403` and the group remains                     |
| Leave a group as a joined member                 | Membership is removed and the user returns to the dashboard |
| Attempt to leave as the creator                  | The request is rejected                                     |
| Delete a group as its creator                    | The group is removed and the dashboard opens                |

## 10. Completion Summary

Story 6 completes the group management workflow. StudySync now supports session planning, meeting information, group details, member departure, and secure creator-only deletion.
