# Story 1 — Project Setup & Database

**Name:** Shanmukha Sai Sankar Motupalli  
**Register Number:** 25B95A6119

## 1. Story

> As the Team, we want the project and database ready so that everyone else can start building their feature.

## 2. Objective

This story establishes the shared foundation for the complete StudySync application. After handoff, Members 2–6 should be able to clone the repository, install dependencies, configure their local database environment, start both applications, and immediately work on their assigned story.

Story 1 does **not** implement authentication, group creation, group discovery, joining, scheduling, or group deletion.

## 3. Acceptance Criteria

| Requirement | Status |
|---|---|
| Node.js + Express server | Complete |
| React + Vite app | Complete |
| Tailwind CSS | Configured |
| PostgreSQL | Configured |
| Prisma ORM | Configured |
| User model | Complete |
| Group model | Complete |
| Initial Prisma migration | Complete |
| Prisma/PostgreSQL connection test | Complete |
| Shared GitHub repository | Handoff step |
| Both apps run locally | Verified |

## 4. Technology

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js, Nodemon
- **Database:** PostgreSQL
- **ORM:** Prisma 7.x
- **Authentication for Story 2:** Bcrypt + JWT

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

## 6. Backend Details

### Server

File:

```text
backend/server.js
```

Default port:

```text
3000
```

Start:

```bash
cd backend
npm install
npm run dev
```

### Existing test endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Confirms Express server is running |
| GET | `/test-db` | Confirms Prisma/PostgreSQL connectivity |

Expected database test response:

```json
{
  "message": "Database connected successfully"
}
```

## 7. Backend Environment

Create this file locally:

```text
backend/.env
```

Example:

```env
DATABASE_URL="your-postgresql-connection-string"
PORT=3000
```

### Important

- Each developer uses their own local `.env`.
- Never commit `.env`.
- Never put the real database password in documentation or source control.

## 8. Prisma Setup

Prisma schema:

```text
backend/prisma/schema.prisma
```

Prisma config:

```text
backend/prisma.config.ts
```

Current generator:

```prisma
generator client {
  provider = "prisma-client-js"
}
```

PostgreSQL is the database provider.

Prisma 7 uses the PostgreSQL driver adapter in `backend/lib/prisma.js`.

## 9. Exact Database Schema

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

### User fields

| Field | Type | Meaning |
|---|---|---|
| `id` | `Int` | Unique user ID |
| `email` | `String` | Unique account email |
| `password` | `String` | Password value stored by the auth feature as a hash |
| `createdGroups` | `Group[]` | Groups created by this user |
| `joinedGroups` | `Group[]` | Groups joined by this user |

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

### Group fields

| Field | Type | Meaning |
|---|---|---|
| `id` | `Int` | Unique group ID |
| `subject` | `String` | Subject/course |
| `name` | `String` | Group name |
| `description` | `String?` | Optional group description |
| `memberLimit` | `Int` | Maximum allowed members |
| `location` | `String?` | Optional physical location |
| `meetingLink` | `String?` | Optional online meeting link |
| `scheduledAt` | `DateTime?` | Optional session date/time |
| `creatorId` | `Int` | ID of group creator |
| `creator` | `User` | Creator relation |
| `members` | `User[]` | Users who joined the group |

### Why is `scheduledAt` optional?

Scheduling belongs to Story 6. A group can therefore be created before the creator adds a schedule. Keep this field consistent unless the team deliberately changes the data contract and migration.

## 10. Relationships

```text
User
├── createdGroups ───────> Group
│                           └── creator ───> User
└── joinedGroups ────────> Group
                            └── members ───> User
```

Relationship names used by Prisma:

```text
GroupCreator
GroupMembers
```

Later stories should use the existing relationship design rather than creating duplicate relations.

## 11. Migration

Initial migration:

```text
backend/prisma/migrations/20260820161442_init/migration.sql
```

Migration directory:

```text
backend/prisma/migrations/
```

The migration is part of the project source and should be committed to GitHub. Other developers should apply the existing migration to their local database instead of manually recreating the tables.

## 12. Prisma Client

File:

```text
backend/lib/prisma.js
```

The backend uses:

- `@prisma/client`
- `@prisma/adapter-pg`
- `pg`

Connection flow:

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

The connection was verified using `/test-db`.

## 13. Frontend Details

Location:

```text
frontend/
```

Stack:

```text
React + Vite + Tailwind CSS
```

Start:

```bash
cd frontend
npm install
npm run dev
```

The Vite terminal prints the local URL, normally:

```text
http://localhost:5173
```

The frontend has been verified to run locally.

## 14. Remaining Story Ownership

| Story | Feature | Owner |
|---|---|---|
| 1 | Project Setup & Database | Member 1 |
| 2 | User Authentication | Member 2 |
| 3 | Group Creation | Member 3 |
| 4 | Group Discovery & Search | Member 4 |
| 5 | Join Group & My Groups | Member 5 |
| 6 | Scheduling, Location & Group Management | Member 6 |

## 15. API Contract Roadmap

| Method | Endpoint | Story |
|---|---|---|
| POST | `/api/auth/register` | 2 |
| POST | `/api/auth/login` | 2 |
| GET | `/api/groups` | 4 |
| POST | `/api/groups` | 3 |
| POST | `/api/groups/:id/join` | 5 |
| DELETE | `/api/groups/:id` | 6 |

These application endpoints are intentionally not implemented in Story 1.

## 16. Instructions for Members 2–6

1. Clone the shared GitHub repository.
2. Enter `backend/` and run `npm install`.
3. Enter `frontend/` and run `npm install`.
4. Create your own `backend/.env` with a valid PostgreSQL `DATABASE_URL` and `PORT=3000`.
5. Run the backend with `npm run dev`.
6. Run the frontend with `npm run dev`.
7. Verify `GET /` and `GET /test-db`.
8. Pull the latest `main` before creating your feature branch.
9. Work only on your assigned story unless coordinated with the team.
10. Use Pull Requests to merge work into `main`.

## 17. Git Workflow

Recommended branches:

```text
feature/story-2-auth
feature/story-3-group-creation
feature/story-4-group-discovery
feature/story-5-join-groups
feature/story-6-group-management
```

Workflow:

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

## 18. Files That Must Not Be Committed

The root `.gitignore` should exclude:

```text
node_modules/
.env
.env.*
dist/
*.log
```

Never commit secrets or local dependency folders.

## 19. Story 1 Handoff Checklist

- [x] Node.js + Express server created
- [x] React + Vite frontend created
- [x] Tailwind CSS configured
- [x] PostgreSQL configured
- [x] Prisma configured
- [x] User model created
- [x] Group model created
- [x] Initial migration created
- [x] Prisma/PostgreSQL connectivity verified
- [ ] Root `.gitignore` committed
- [ ] Root `README.md` committed
- [ ] Initial project pushed to shared GitHub repository
- [ ] All five members added to repository
- [ ] At least one other member clones and verifies the project

## 20. Handoff Boundary

After Story 1 is handed off, Member 1 should not implement the feature work assigned to Members 2–6 unless the team explicitly reallocates a story.

Story 2–6 are responsible for:

- Authentication
- Group creation
- Group discovery/search
- Joining and My Groups
- Scheduling/location/group management

The purpose of this document is to give those members the exact project, database, configuration, and collaboration information they need to start immediately.
