# Story 3 - Group Creation

**Name:** K Surya Prasanth  
**Register Number:** 24B91A05C5

## 1. Story

> As a student, I want to create a study group by providing group details so that I can collaborate with other students for learning.

## 2. Objective

As **Member 3**, I implemented the group creation feature for StudySync. Authenticated users can create a study group by providing the subject, group name, description, and member limit.

The feature uses JWT authentication to identify the logged-in user and Prisma to store the group in the PostgreSQL database.

This story builds on the authentication flow completed in Story 2.

## 3. Completed Work

| Requirement | Status | Implementation |
| --- | --- | --- |
| Create authentication middleware | Complete | `backend/middleware/authMiddleware.js` |
| Create group creation API | Complete | `POST /api/groups` |
| Protect group creation API | Complete | JWT Bearer token authentication |
| Validate group details | Complete | Subject, name, and member limit validation |
| Store group in database | Complete | Prisma + PostgreSQL |
| Create Create Group page | Complete | `frontend/src/pages/CreateGroup.jsx` |
| Add Create Group frontend route | Complete | `/create-group` |
| Connect frontend and backend | Complete | Frontend calls the Express API on port 3000 |
| Test group creation | Complete | Group created successfully using authenticated request |
| Push Story 3 branch | Complete | `feature/story-3-group-creation` |
| Create Pull Request | Complete | Story 3 Pull Request to `main` |

## 4. Technology

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL with Prisma ORM
* **Authentication:** JSON Web Token (JWT)
* **Frontend:** React, React Router, Vite
* **Testing:** PowerShell REST API requests and browser testing
* **Version Control:** Git and GitHub

## 5. Files Changed

| File | Responsibility |
| --- | --- |
| `backend/middleware/authMiddleware.js` | Verifies the JWT Bearer token and identifies the logged-in user |
| `backend/routes/groups.js` | Group creation API and validation |
| `backend/server.js` | Mounts group routes at `/api/groups` |
| `frontend/src/pages/CreateGroup.jsx` | Create Study Group form and API request |
| `frontend/src/App.jsx` | Adds the `/create-group` frontend route |

## 6. Authentication Middleware

Created:

```text
backend/middleware/authMiddleware.js
```

The middleware:

1. Reads the `Authorization` header.
2. Checks for the `Bearer <token>` format.
3. Verifies the JWT using `JWT_SECRET`.
4. Stores the decoded user information in `req.user`.
5. Allows the request to continue when the token is valid.
6. Returns `401 Unauthorized` when the token is missing, invalid, or expired.

The middleware is used to protect the group creation API.

## 7. Backend API

The group routes are registered in `backend/server.js`:

```js
app.use("/api/groups", groupRoutes);
```

### Create a Study Group

```text
POST /api/groups
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

Request body:

```json
{
	"subject": "Java",
	"name": "Java Study Group",
	"description": "Group for learning Java and DSA",
	"memberLimit": 5
}
```

Successful response: `201 Created`

```json
{
	"message": "Group created successfully",
	"group": {
		"id": 1,
		"subject": "Java",
		"name": "Java Study Group",
		"description": "Group for learning Java and DSA",
		"memberLimit": 5
	}
}
```

The actual response also contains the group fields stored by Prisma, including the creator and optional group information.

## 8. Validation and Authentication

The API checks that the following required fields are provided:

```text
subject
name
memberLimit
```

The member limit must be greater than zero.

The API also requires a valid JWT token. The `creatorId` is taken from the authenticated user's token instead of being supplied directly by the frontend.

This prevents a user from creating a group on behalf of another user.

## 9. Database Implementation

The group is stored using Prisma.

The existing `Group` model contains fields for:

```text
id
subject
name
description
memberLimit
location
meetingLink
scheduledAt
creatorId
```

The group creation request currently stores the details entered in the Create Group form and associates the group with the authenticated user through `creatorId`.

The PostgreSQL database was synchronized successfully using Prisma migration.

## 10. Frontend Create Group Flow

Created:

```text
frontend/src/pages/CreateGroup.jsx
```

The page contains:

- Subject
- Group Name
- Description
- Member Limit
- Create Group button

The frontend:

1. Collects the group details from the user.
2. Reads the JWT token from `localStorage`.
3. Sends the group details to `POST /api/groups`.
4. Sends the token in the `Authorization` header.
5. Displays a success message after the group is created.

Example:

```text
Group created successfully!
```

## 11. Frontend Route

Updated:

```text
frontend/src/App.jsx
```

Added:

```text
/create-group
```

The page is available locally at:

```text
http://localhost:5173/create-group
```

The Create Group page was tested in the browser and the success message was displayed after creating the group.

## 12. Testing

### Database Test

The Prisma migration was executed successfully.

Result:

```text
Your database is now in sync with your schema.
```

### Authentication Test

A test user was registered successfully and a JWT token was generated.

### Group Creation API Test

The generated JWT token was used in the `Authorization` header.

Test values used:

```text
Subject: Java
Group Name: Java Study Group
Description: Group for learning Java and DSA
Member Limit: 5
```

Result:

```text
Group created successfully
```

The group received an ID from the database and was associated with the authenticated user.

### Frontend Test

The Create Study Group page was opened at:

```text
http://localhost:5173/create-group
```

After submitting the form, the page displayed:

```text
Group created successfully!
```

## 13. Running the Feature Locally

Start the backend:

```bash
cd backend
npm install
npm run dev
```

The backend runs at:

```text
http://localhost:3000
```

Start the frontend in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL, normally:

```text
http://localhost:5173
```

Before testing group creation, make sure PostgreSQL is available, Prisma is configured, `backend/.env` contains a valid `DATABASE_URL` and `JWT_SECRET`, and the backend is running.

## 14. Manual Acceptance Checks

| Check | Expected result |
| --- | --- |
| Open Create Group page | Create Study Group form is displayed |
| Enter subject, group name, description, and member limit | Values are accepted |
| Submit valid group details with a valid JWT | Group is created successfully |
| Check the database | Created group is stored in PostgreSQL |
| Create group without authentication | Request is rejected with `401` |
| Enter member limit less than or equal to zero | Request is rejected |
| Successfully create group from frontend | `Group created successfully!` is displayed |

## 15. GitHub Workflow

Created feature branch:

```text
feature/story-3-group-creation
```

Changes were committed using:

```bash
git commit -m "Implement Story 3 group creation"
```

The branch was pushed to GitHub using:

```bash
git push
```

A Pull Request was created from:

```text
feature/story-3-group-creation
```

to:

```text
main
```

Pull Request:

```text
Implement Story 3 group creation
```

## 16. Completion Summary

Completed by **K Surya Prasanth (24B91A05C5)**.

1. Implemented JWT authentication middleware for protected group creation.
2. Created the `POST /api/groups` backend API.
3. Added validation for group details and member limit.
4. Connected the group to the authenticated user through `creatorId`.
5. Created the Create Study Group frontend page.
6. Added the `/create-group` frontend route.
7. Tested database synchronization, JWT authentication, API group creation, and frontend group creation.
8. Committed and pushed the Story 3 changes to the `feature/story-3-group-creation` branch.
9. Created a Pull Request to merge Story 3 into `main`.

## 17. Final Result

**Story 3 - Group Creation is implemented and tested successfully.**

An authenticated student can create a study group by entering the required group details. The request is protected using JWT authentication, and the created group is stored in the PostgreSQL database using Prisma.
