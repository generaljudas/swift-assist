# Express Backend for ZenithData

This is a Node.js Express backend for user authentication and PostgreSQL integration.

## Features
- User registration and login (with bcrypt password hashing)
- REST API endpoints for authentication and user data
- PostgreSQL database connection

## Setup
1. Install dependencies:
   ```powershell
   npm install
   ```
2. Configure your database connection in the `.env` file.
3. Start the server:
   ```powershell
   node index.js
   ```

The server will run on http://localhost:5000 by default.

## API Endpoints
- `POST /api/login` — Login with `{ username, password }`
- `POST /api/register` — Register with `{ username, email, password }`
- `GET /api/users/:id` — Get user info by ID

## Notes
- This backend is for local development. Do not expose sensitive credentials in production.
- All business logic and database access should be handled in this backend, not in the frontend.
