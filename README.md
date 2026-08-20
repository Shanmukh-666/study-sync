# StudySync

StudySync is a web application that helps students create and join study groups based on subjects or courses. Students can discover relevant groups, join available groups, and view scheduling and meeting information.

## Project Objective

Build a simple, responsive study-group platform where students can:

- Create study groups for specific subjects or courses
- Discover groups by subject
- Join groups while respecting member limits
- View scheduled session information
- View a physical meeting location or online meeting link
- Manage groups they created

## Team

- **Team size:** 6 members
- **Development model:** One end-to-end story per team member
- **Collaboration:** Shared GitHub repository with feature branches and Pull Requests

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- Nodemon for development

### Database
- PostgreSQL
- Prisma ORM

### Authentication
- JWT
- Bcrypt

> JWT and Bcrypt are implemented as part of Story 2 (User Authentication).

## Project Structure

```text
study-sync/
├── README.md
├── STORY-1-PROJECT-SETUP-DATABASE.md
├── backend/
│   ├── lib/
│   │   └── prisma.js
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── prisma.config.ts
│   ├── server.js
│   ├── package.json
│   └── .env                  # Local only; never commit
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    ├── package-lock.json
    └── vite.config.js
```

## Team Stories

| Story | Feature | Owner |
|---|---|---|
| 1 | Project Setup & Database | Member 1 |
| 2 | User Authentication | Member 2 |
| 3 | Group Creation | Member 3 |
| 4 | Group Discovery & Search | Member 4 |
| 5 | Join Group & My Groups | Member 5 |
| 6 | Scheduling, Location & Group Management | Member 6 |

## API Roadmap

| Method | Endpoint | Story | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | 2 | Register a new user |
| POST | `/api/auth/login` | 2 | Authenticate and return JWT |
| GET | `/api/groups` | 4 | Browse groups and optionally filter by subject |
| POST | `/api/groups` | 3 | Create a study group |
| POST | `/api/groups/:id/join` | 5 | Join a group if space is available |
| DELETE | `/api/groups/:id` | 6 | Delete a group as its creator |

## Getting the Project

Clone the shared repository:

```bash
git clone <REPOSITORY_URL>
cd study-sync
```

Install dependencies:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Backend Setup

Create `backend/.env` locally:

```env
DATABASE_URL="your-postgresql-connection-string"
PORT=3000
```

Do not commit `.env` or expose database credentials.

Start the backend:

```bash
cd backend
npm run dev
```

Default backend URL:

```text
http://localhost:3000
```

Health check:

```text
GET http://localhost:3000/
```

Expected response:

```text
StudySync Backend is Running
```

Database test:

```text
GET http://localhost:3000/test-db
```

Expected response:

```json
{
  "message": "Database connected successfully"
}
```

## Frontend Setup

```bash
cd frontend
npm run dev
```

Open the local URL shown by Vite, normally:

```text
http://localhost:5173
```

## Database

The project uses PostgreSQL with Prisma.

- Prisma schema: `backend/prisma/schema.prisma`
- Prisma config: `backend/prisma.config.ts`
- Initial migrations: `backend/prisma/migrations/`

### Models

#### User

- `id`
- `email`
- `password`
- `createdGroups`
- `joinedGroups`

#### Group

- `id`
- `subject`
- `name`
- `description`
- `memberLimit`
- `location`
- `meetingLink`
- `scheduledAt`
- `creatorId`
- `creator`
- `members`

See `STORY-1-PROJECT-SETUP-DATABASE.md` for the exact schema and handoff details.

## Security Rules

- Never commit `.env` files.
- Never commit database passwords or credential-bearing connection strings.
- Passwords must be hashed with Bcrypt when Story 2 is implemented.
- JWT secrets must be stored in environment variables.
- Protected APIs must validate authentication before restricted operations.

## Development Workflow

1. Pull the latest `main`.
2. Create a feature branch for the assigned story.
3. Implement only the assigned story.
4. Test locally.
5. Commit and push the branch.
6. Open a Pull Request.
7. Review and merge into `main`.

Recommended branches:

```text
feature/story-2-auth
feature/story-3-group-creation
feature/story-4-group-discovery
feature/story-5-join-groups
feature/story-6-group-management
```

## Current Status

**Story 1 — Project Setup & Database**

- Node.js + Express backend: complete
- React + Vite frontend: complete
- Tailwind CSS: configured
- PostgreSQL: configured
- Prisma schema: configured
- Prisma migration: created
- Database connectivity test: working
- GitHub handoff: complete after repository push/team verification

The remaining five members should use the existing setup rather than recreating the project foundation.
