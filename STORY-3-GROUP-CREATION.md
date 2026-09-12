# Story 3 - Study Group Creation

**Name:** \[K.SURYA PRASANTH\]\
**Register Number:** \[24B91A05C5\]

## 1. Story

> As a user, I want to create a study group so that other students can
> find and join it.

## 2. Objective

As **Member 3**, I implemented the study group creation flow for
StudySync. Logged-in users can create a study group by providing a
subject, group name, description, and member limit. The group is
associated with the authenticated user and stored in the PostgreSQL
database using Prisma ORM.

This story builds on the authentication and database setup completed in
Story 1 and Story 2.

## 3. Completed Work

  --------------------------------------------------------------------------------------
  Requirement             Status                  Implementation
  ----------------------- ----------------------- --------------------------------------
  Create group creation   Complete                `POST /api/groups`
  API                                             

  Protect group creation  Complete                JWT authentication middleware
  API                                             

  Create group creation   Complete                `frontend/src/pages/CreateGroup.jsx`
  form                                            

  Add subject             Complete                Subject input field

  Add group name          Complete                Group name input field

  Add description         Complete                Description input field

  Add member limit        Complete                Member limit input field

  Connect frontend and    Complete                Frontend calls the Express API
  backend                                         

  Associate group with    Complete                JWT `userId` stored as `creatorId`
  logged-in user                                  

  Save group in database  Complete                Prisma `group.create()`
  --------------------------------------------------------------------------------------

## 4. Technology

-   **Backend:** Node.js, Express.js
-   **Database:** PostgreSQL with Prisma ORM
-   **Authentication:** JSON Web Token (JWT)
-   **Frontend:** React, React Router, Vite, Tailwind CSS

## 5. Files Changed

  ----------------------------------------------------------------------------
  File                                     Responsibility
  ---------------------------------------- -----------------------------------
  `backend/routes/groups.js`               Group creation API

  `backend/middleware/authMiddleware.js`   Verifies JWT and protects
                                           authenticated routes

  `backend/server.js`                      Mounts group routes at
                                           `/api/groups`

  `backend/prisma/schema.prisma`           Defines the existing `Group` model
                                           and creator relationship

  `frontend/src/pages/CreateGroup.jsx`     Group creation form and API request

  `frontend/src/App.jsx`                   Registers the Create Group frontend
                                           route
  ----------------------------------------------------------------------------

> If the frontend files use different names in the final implementation,
> update this table to match the actual project structure.

## 6. Backend API

The group creation route is registered in `backend/server.js`:

``` js
app.use("/api/groups", groupRoutes);
```

### Create a Study Group

``` text
POST /api/groups
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

Request body:

``` json
{
  "subject": "Data Structures",
  "name": "DSA Warriors",
  "description": "Study DSA together",
  "memberLimit": 10
}
```

The `creatorId` is **not supplied by the frontend**. It is obtained from
the authenticated JWT.

Successful response: `201 Created`

``` json
{
  "message": "Group created successfully",
  "group": {
    "id": 1,
    "subject": "Data Structures",
    "name": "DSA Warriors",
    "description": "Study DSA together",
    "memberLimit": 10,
    "creatorId": 1
  }
}
```

### Validation and error responses

  ------------------------------------------------------------------------------------------------
  Status                  Message                                          Meaning
  ----------------------- ------------------------------------------------ -----------------------
  `400`                   `Subject, name, and member limit are required`   Required group
                                                                           information is missing

  `400`                   `Member limit must be greater than 0`            Invalid member limit

  `401`                   `Authentication required`                        JWT token is missing

  `401`                   `Invalid or expired token`                       JWT token is invalid or
                                                                           expired

  `500`                   `Failed to create group`                         Unexpected server or
                                                                           database error
  ------------------------------------------------------------------------------------------------

## 7. JWT Authentication

Only logged-in users can create study groups.

The login API from Story 2 returns a JWT containing:

``` js
{
  userId: user.id,
  email: user.email
}
```

The group route is protected using:

``` js
router.post("/", authMiddleware, async (req, res) => {
  // create group
});
```

The authentication middleware reads the request header:

``` text
Authorization: Bearer <jwt-token>
```

It verifies the token using `JWT_SECRET`.

After successful verification, the decoded token is available through:

``` js
req.user
```

The logged-in user's ID is then used while creating the group:

``` js
creatorId: req.user.userId
```

This prevents a client from choosing another user's ID as the group
creator.

## 8. Database Implementation

The existing Prisma `Group` model contains the fields required by this
story:

``` prisma
model Group {
  id          Int     @id @default(autoincrement())
  subject     String
  name        String
  description String?
  memberLimit Int

  location    String?
  meetingLink String?
  scheduledAt DateTime?

  creatorId Int

  creator User @relation("GroupCreator", fields: [creatorId], references: [id])

  members User[] @relation("GroupMembers")
}
```

A new group is saved using Prisma:

``` js
const group = await prisma.group.create({
  data: {
    subject,
    name,
    description,
    memberLimit: Number(memberLimit),
    creatorId: req.user.userId,
  },
});
```

The `creatorId` connects the newly created group with the authenticated
`User`.

## 9. Frontend Group Creation Flow

The Create Group page:

1.  Displays a form for creating a study group.
2.  Collects the subject.
3.  Collects the group name.
4.  Collects an optional description.
5.  Collects the member limit.
6.  Reads the JWT from `localStorage`.
7.  Sends the group details to `POST /api/groups`.
8.  Sends the JWT in the `Authorization` header.
9.  Displays a success or error message after the API response.

Example request:

``` js
fetch("http://localhost:3000/api/groups", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  body: JSON.stringify({
    subject,
    name,
    description,
    memberLimit,
  }),
});
```

## 10. Frontend Form

The form contains the following fields:

``` text
Create Study Group

Subject:
[ Data Structures ]

Group Name:
[ DSA Warriors ]

Description:
[ Study DSA together ]

Member Limit:
[ 10 ]

[ Create Group ]
```

The frontend should prevent submission when required fields are empty
and should display the API response to the user.

## 11. Frontend Route

The Create Group page can be registered as:

  Route             Component       Purpose
  ----------------- --------------- --------------------------
  `/create-group`   `CreateGroup`   Create a new study group

The page should only be accessible as part of the logged-in user flow.

## 12. Running the Feature Locally

### Start the backend

``` bash
cd backend
npm install
npm run dev
```

The backend runs at:

``` text
http://localhost:3000
```

### Start the frontend

Open a second terminal:

``` bash
cd frontend
npm install
npm run dev
```

The Vite frontend normally runs at:

``` text
http://localhost:5173
```

Before testing, make sure PostgreSQL is available and `backend/.env`
contains valid values:

``` env
DATABASE_URL="your-postgresql-connection-string"
PORT=3000
JWT_SECRET="your-development-secret"
```

Do not commit the real `.env` file or expose `JWT_SECRET`.

## 13. Manual Acceptance Checks

  -----------------------------------------------------------------------
  Check                               Expected result
  ----------------------------------- -----------------------------------
  Open Create Group without a JWT     API rejects the request with `401`

  Submit form with missing subject    Validation/API rejects the request

  Submit form with missing group name Validation/API rejects the request

  Submit form with missing member     Validation/API rejects the request
  limit                               

  Submit member limit as `0` or       API returns `400`
  negative                            

  Logged-in user submits valid group  API returns `201 Created`
  details                             

  Create a valid group                Group is saved in PostgreSQL

  Check the created group             `creatorId` matches the logged-in
                                      user's ID

  Try using an invalid JWT            API returns `401`

  Create group from frontend          Frontend successfully calls
                                      `/api/groups`

  After successful creation           Success message is displayed
  -----------------------------------------------------------------------

## 14. Git Workflow

The feature was developed on a separate branch:

``` bash
git checkout -b feature/story-3-group-creation
```

After completing and testing the feature:

``` bash
git status
git add .
git commit -m "Implement Story 3 group creation"
git push -u origin feature/story-3-group-creation
```

Then create a Pull Request from:

``` text
feature/story-3-group-creation
```

to:

``` text
main
```

## 15. Completion Summary

Completed by **\[K.SURYA PRASANTH\] (\[24B91A05C5\])**

1.  Implemented the study group creation API.
2.  Added JWT authentication protection so only logged-in users can
    create groups.
3.  Added subject, group name, description, and member limit fields.
4.  Connected the authenticated user's ID to the group's `creatorId`.
5.  Connected the frontend group creation form with the backend API.
6.  Saved created groups in PostgreSQL using Prisma.
7.  Added validation and error handling for group creation.
8.  Prepared the feature for other students to find and join groups in
    later stories.
