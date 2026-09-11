# Story 2 - User Authentication

**Name:** Kagga Devi Sri  
**Register Number:** 24B91A5716

## 1. Story

> As a student, I want to create an account and log in securely so that I can use StudySync to manage my study groups.

## 2. Objective

As **Member 2**, I implemented the authentication flow for StudySync. Users can register with an email address and password, log in with those credentials, and log out from the frontend. Passwords are stored as bcrypt hashes, and successful login returns a JSON Web Token (JWT) for client-side authentication.

This story builds on the User model and project setup completed in Story 1.

## 3. Completed Work

| Requirement | Status | Implementation |
| --- | --- | --- |
| Create registration API | Complete | `POST /api/auth/register` |
| Create login API | Complete | `POST /api/auth/login` |
| Hash passwords using Bcrypt | Complete | Bcrypt hash with 10 salt rounds |
| Generate JWT | Complete | JWT expires after 1 hour |
| Create Sign Up page | Complete | `frontend/src/pages/Signup.jsx` |
| Create Login page | Complete | `frontend/src/pages/Login.jsx` |
| Connect frontend and backend | Complete | Frontend calls the Express API on port 3000 |
| Implement logout | Complete | Removes the token and user from `localStorage` |

## 4. Technology

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL with Prisma ORM
* **Password security:** Bcrypt
* **Token authentication:** JSON Web Token (JWT)
* **Frontend:** React, React Router, Vite, Tailwind CSS

## 5. Files Changed

| File | Responsibility |
| --- | --- |
| `backend/routes/auth.js` | Registration and login API routes |
| `backend/server.js` | Mounts authentication routes at `/api/auth` |
| `frontend/src/pages/Signup.jsx` | Sign-up form and registration request |
| `frontend/src/pages/Login.jsx` | Login form, JWT storage, and dashboard navigation |
| `frontend/src/components/logout.jsx` | Logout confirmation, local data cleanup, and redirect |
| `frontend/src/App.jsx` | Routes for login, sign-up, and dashboard pages |

## 6. Backend API

Authentication routes are registered in `backend/server.js`:

```js
app.use("/api/auth", authRoutes);
```

### Register a User

```text
POST /api/auth/register
Content-Type: application/json
```

Request body:

```json
{
	"email": "student@example.com",
	"password": "password123"
}
```

Successful response: `201 Created`

```json
{
	"message": "User registered successfully",
	"user": {
		"id": 1,
		"email": "student@example.com"
	}
}
```

Validation and error responses:

| Status | Message | Meaning |
| --- | --- | --- |
| `400` | `Email and password are required` | One or both fields are missing |
| `409` | `User already exists` | The email is already registered |
| `500` | `Registration failed` | Unexpected server or database error |

### Log In

```text
POST /api/auth/login
Content-Type: application/json
```

Request body:

```json
{
	"email": "student@example.com",
	"password": "password123"
}
```

Successful response: `200 OK`

```json
{
	"message": "Login successful",
	"token": "<jwt-token>",
	"user": {
		"id": 1,
		"email": "student@example.com"
	}
}
```

Validation and error responses:

| Status | Message | Meaning |
| --- | --- | --- |
| `400` | `Email and password are required` | One or both fields are missing |
| `401` | `Invalid email or password` | The credentials do not match |
| `500` | `Login failed` | Unexpected server or database error |

## 7. Password Hashing

Passwords are never stored as plain text. During registration, `auth.js` hashes the password before creating the database record:

```js
const hashedPassword = await bcrypt.hash(password, 10);
```

During login, the submitted password is compared with the stored hash:

```js
const passwordMatch = await bcrypt.compare(password, user.password);
```

The database `User.password` field therefore contains the bcrypt hash rather than the original password.

## 8. JWT Generation

After the credentials are verified, the backend creates a JWT containing the user's ID and email:

```js
const token = jwt.sign(
	{
		userId: user.id,
		email: user.email,
	},
	process.env.JWT_SECRET,
	{
		expiresIn: "1h",
	}
);
```

The signing secret must be configured locally in `backend/.env`:

```env
DATABASE_URL="your-postgresql-connection-string"
PORT=3000
JWT_SECRET="your-development-secret"
```

`JWT_SECRET` must not be committed to the repository or exposed to the frontend.

## 9. Frontend Authentication Flow

### Sign Up

The page in `frontend/src/pages/Signup.jsx`:

1. Collects the user's email and password.
2. Sends a `POST` request to `http://localhost:3000/api/auth/register`.
3. Displays the API response message.
4. Clears the form after successful registration.
5. Redirects the user to `/login`.

The password field includes a show/hide control using `lucide-react` icons.

### Login

The page in `frontend/src/pages/Login.jsx`:

1. Collects the user's email and password.
2. Sends a `POST` request to `http://localhost:3000/api/auth/login`.
3. Stores the returned JWT in `localStorage` under `token`.
4. Stores the returned user object in `localStorage` under `user`.
5. Redirects the user to `/dashboard` after a successful login.

Stored values:

```text
localStorage.token
localStorage.user
```

### Logout

The `LogoutButton` component in `frontend/src/components/logout.jsx`:

1. Asks the user to confirm the logout action.
2. Removes `token` from `localStorage`.
3. Removes `user` from `localStorage`.
4. Redirects the browser to `/login`.

The current implementation uses client-side logout because JWT authentication is stateless. There is no separate `POST /logout` backend endpoint.

## 10. Frontend Routes

| Route | Component | Purpose |
| --- | --- | --- |
| `/` | `Login` | Default login page |
| `/login` | `Login` | Login page |
| `/signup` | `Signup` | Registration page |
| `/dashboard` | `Dashboard` | Initial page shown after login |

## 11. Running the Feature Locally

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

Before testing registration or login, make sure PostgreSQL is available, Prisma is configured, and `backend/.env` contains valid `DATABASE_URL` and `JWT_SECRET` values.

## 12. Manual Acceptance Checks

| Check | Expected result |
| --- | --- |
| Submit sign-up with empty fields | Browser validation prevents submission |
| Register a new email and password | API returns `201`; user is redirected to login |
| Register the same email again | API returns `409` with `User already exists` |
| Log in with an unknown email | API returns `401` with `Invalid email or password` |
| Log in with the wrong password | API returns `401` with `Invalid email or password` |
| Log in with valid credentials | JWT and user are stored; user is redirected to dashboard |
| Click Logout and confirm | Stored auth data is removed; user is redirected to login |
| Check the database password value | Password is stored as a bcrypt hash, not plain text |

## 13. Completion Summary

  Completed by **Kagga Devi Sri (24B91A5716)**  

1.Implemented registration and login APIs for StudySync.   
2.Added Bcrypt password hashing and JWT generation with one-hour expiry.  
3.Created and connected the Sign Up and Login pages to the backend.  
4.Implemented local authentication storage, dashboard navigation, and logout.  
5.The feature is ready for the remaining team members.



