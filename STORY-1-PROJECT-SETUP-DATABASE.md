# Story 1 — Project Setup & Database

**Name:** Shanmukha Sai Sankar Motupalli
**Register Number:** 25B95A6119

## 1. Story

> As the Team, we want the project and database ready so that everyone else can start building their feature.

## 2. Objective

As **Member 1 / Team Lead**, I established the shared technical foundation for the StudySync application. I set up the backend, frontend, PostgreSQL database, Prisma ORM, initial database schema, migration, project structure, and GitHub repository so that the remaining team members can continue development from a common working setup.

Story 1 covers the initial project and database foundation. The feature implementation for authentication, group creation, group discovery, joining, scheduling, and group deletion is handled by the respective team members in Stories 2–6.

## 3. Completed Work

| Requirement                       | Status     |
| --------------------------------- | ---------- |
| Node.js + Express server          | Complete   |
| React + Vite app                  | Complete   |
| Tailwind CSS                      | Configured |
| PostgreSQL                        | Configured |
| Prisma ORM                        | Configured |
| User model                        | Complete   |
| Group model                       | Complete   |
| Initial Prisma migration          | Complete   |
| Prisma/PostgreSQL connection test | Complete   |
| Shared GitHub repository          | Complete   |
| Both apps run locally             | Verified   |
| Root `.gitignore`                 | Complete   |
| Root `README.md`                  | Complete   |
| Team members added to repository  | Complete   |
| Project handoff                   | Complete   |

## 4. Technology

* **Frontend:** React, Vite, Tailwind CSS
* **Backend:** Node.js, Express.js, Nodemon
* **Database:** PostgreSQL
* **ORM:** Prisma 7.x
* **Authentication for Story 2:** Bcrypt + JWT

## 5. Project Structure

```text
study-sync/
├── README.md
├── STORY-1-PROJECT-SETUP-DATABASE.md
├── .gitignore
├── backend/
│   ├── lib/
│   │   └── prisma.js
│   ├── prisma/
│   │   ├── migrations/
│   │   │   ├── 20260820161442_init/
│   │   │   │   └── migration.sql
│   │   │   └── migration_lock.toml
│   │   ├── schema.prisma
│   │   ├── prisma.config.ts
│   │   ├── server.js
│   │   └── package.json
│   └── .env                 # Local only; never commit
└── frontend/
    ├── src/
    ├── public/
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## 6. Backend Setup

I created and configured the Node.js + Express backend.

**Server file:**

```text
backend/server.js
```

**Default port:**

```text
3000
```

The backend can be started with:

```bash
cd backend
npm install
npm run dev
```

### Existing Test Endpoints

| Method | Endpoint   | Purpose                                 |
| ------ | ---------- | --------------------------------------- |
| GET    | `/`        | Confirms Express server is running      |
| GET    | `/test-db` | Confirms Prisma/PostgreSQL connectivity |

The database connectivity was successfully tested using `/test-db`.

Expected response:

```json
{
  "message": "Database connected successfully"
}
```

## 7. Backend Environment

The backend uses a local environment file:

```text
backend/.env
```

Example:

```env
DATABASE_URL="your-postgresql-connection-string"
PORT=3000
```

The `.env` file is kept local and is not committed to GitHub.

Each developer can configure their own PostgreSQL connection through their local `.env` file.

## 8. Prisma Setup

I configured Prisma for the PostgreSQL database.

**Prisma schema:**

```text
backend/prisma/schema.prisma
```

**Prisma configuration:**

```text
backend/prisma.config.ts
```

Current generator:

```prisma
generator client {
  provider = "prisma-client-js"
}
```

The project uses PostgreSQL as the database provider.

Prisma 7 uses the PostgreSQL driver adapter configured in:

```text
backend/lib/prisma.js
```

## 9. Database Schema

The database structure required for the complete StudySync application was created as part of Story 1.

### User

```prisma
model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String

  createdGroups Group[] @relation("GroupCreator")
  joinedGroups  Group[] @relation("GroupMembers")
}
```

### User Fields

| Field           | Type      | Meaning                                             |
| --------------- | --------- | --------------------------------------------------- |
| `id`            | `Int`     | Unique user ID                                      |
| `email`         | `String`  | Unique account email                                |
| `password`      | `String`  | Password value stored by the auth feature as a hash |
| `createdGroups` | `Group[]` | Groups created by this user                         |
| `joinedGroups`  | `Group[]` | Groups joined by this user                          |

### Group

```prisma
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

### Group Fields

| Field         | Type        | Meaning                      |
| ------------- | ----------- | ---------------------------- |
| `id`          | `Int`       | Unique group ID              |
| `subject`     | `String`    | Subject/course               |
| `name`        | `String`    | Group name                   |
| `description` | `String?`   | Optional group description   |
| `memberLimit` | `Int`       | Maximum allowed members      |
| `location`    | `String?`   | Optional physical location   |
| `meetingLink` | `String?`   | Optional online meeting link |
| `scheduledAt` | `DateTime?` | Optional session date/time   |
| `creatorId`   | `Int`       | ID of group creator          |
| `creator`     | `User`      | Creator relation             |
| `members`     | `User[]`    | Users who joined the group   |

### Why `scheduledAt` is Optional

The scheduling functionality belongs to Story 6. Therefore, a group can be created before a schedule is added.

The field is kept optional so the existing database structure supports the complete feature flow.

## 10. Database Relationships

The User and Group models were configured with the required relationships:

```text
User
├── createdGroups ───────> Group
│                           └── creator ───> User
└── joinedGroups ────────> Group
                            └── members ───> User
```

The Prisma relationship names are:

```text
GroupCreator
GroupMembers
```

The remaining stories use this existing relationship design.

## 11. Initial Migration

I created the initial Prisma migration:

```text
backend/prisma/migrations/20260820161442_init/migration.sql
```

Migration directory:

```text
backend/prisma/migrations/
```

The migration is committed as part of the project so that the same database structure can be recreated by the other team members on their local PostgreSQL databases.

## 12. Prisma Client

The Prisma client configuration is located at:

```text
backend/lib/prisma.js
```

The backend uses:

* `@prisma/client`
* `@prisma/adapter-pg`
* `pg`

The database connection flow is:

```text
Express
  ↓
lib/prisma.js
  ↓
PrismaClient
  ↓
PrismaPg
  ↓
PostgreSQL
```

I verified the Prisma/PostgreSQL connection successfully through the `/test-db` endpoint.

## 13. Frontend Setup

I created and configured the React frontend using Vite and Tailwind CSS.

Location:

```text
frontend/
```

Technology:

```text
React + Vite + Tailwind CSS
```

The frontend can be started with:

```bash
cd frontend
npm install
npm run dev
```

The Vite development server normally provides:

```text
http://localhost:5173
```

The frontend was verified to run successfully.

## 14. Remaining Story Ownership

After completing the project foundation, the remaining feature work is divided among the other five team members:

| Story | Feature                                 | Owner                                     |
| ----- | --------------------------------------- | ----------------------------------------- |
| 1     | Project Setup & Database                | Member 1 — Shanmukha Sai Sankar Motupalli |
| 2     | User Authentication                     | Member 2                                  |
| 3     | Group Creation                          | Member 3                                  |
| 4     | Group Discovery & Search                | Member 4                                  |
| 5     | Join Group & My Groups                  | Member 5                                  |
| 6     | Scheduling, Location & Group Management | Member 6                                  |

## 15. API Contract Roadmap

The API structure for the remaining stories was established as follows:

| Method | Endpoint               | Story |
| ------ | ---------------------- | ----- |
| POST   | `/api/auth/register`   | 2     |
| POST   | `/api/auth/login`      | 2     |
| GET    | `/api/groups`          | 4     |
| POST   | `/api/groups`          | 3     |
| POST   | `/api/groups/:id/join` | 5     |
| DELETE | `/api/groups/:id`      | 6     |

These application endpoints are intentionally left for their respective story owners.

## 16. Project Handoff

The shared project foundation has been completed and pushed to the GitHub repository.

The project is now ready for the remaining team members to continue development.

Each member can:

1. Clone the shared GitHub repository.
2. Enter `backend/` and run `npm install`.
3. Enter `frontend/` and run `npm install`.
4. Create their local `backend/.env`.
5. Configure a valid PostgreSQL `DATABASE_URL`.
6. Start the backend with `npm run dev`.
7. Start the frontend with `npm run dev`.
8. Verify `GET /` and `GET /test-db`.
9. Pull the latest `main` before starting their feature branch.
10. Implement their assigned story.
11. Push their feature branch.
12. Create a Pull Request for review.

## 17. Git Workflow

The feature branches are organized as follows:

```text
feature/story-2-auth
feature/story-3-group-creation
feature/story-4-group-discovery
feature/story-5-join-groups
feature/story-6-group-management
```

The development workflow is:

```text
main
 ↓
pull latest changes
 ↓
create feature branch
 ↓
implement assigned story
 ↓
test locally
 ↓
commit
 ↓
push
 ↓
Pull Request
 ↓
review
 ↓
merge into main
```

This keeps the work of each team member separated and allows the completed stories to be reviewed before being merged into the shared `main` branch.

## 18. Files That Must Not Be Committed

The root `.gitignore` contains the following exclusions:

```text
node_modules/
.env
.env.*
dist/
*.log
```

Local dependencies, environment files, database credentials, and other secrets are not committed to the repository.

## 19. Story 1 Completion Checklist

* [x] Node.js + Express server created
* [x] React + Vite frontend created
* [x] Tailwind CSS configured
* [x] PostgreSQL configured
* [x] Prisma configured
* [x] User model created
* [x] Group model created
* [x] Initial migration created
* [x] Prisma/PostgreSQL connectivity verified
* [x] Root `.gitignore` committed
* [x] Root `README.md` committed
* [x] Initial project pushed to shared GitHub repository
* [x] All five members added to repository
* [x] Project cloned/verified for team development
* [x] Story 1 completed and handed off

## 20. Story 1 Completion Summary

Story 1 has been completed by **Shanmukha Sai Sankar Motupalli (25B95A6119)**.

The StudySync development environment, shared project structure, PostgreSQL database, Prisma configuration, database schema, initial migration, frontend, backend, and GitHub collaboration setup are complete.

The project is now ready for Members 2–6 to implement their assigned features without changing the established project foundation unnecessarily.

Story 1 therefore serves as the completed base layer on which the remaining StudySync features will be developed and integrated.
