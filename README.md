# Task Manager (MERN Assignment)

This is a small full-stack Task Manager built for a short interview assignment.

The goal was to keep the solution simple, readable, and complete for core CRUD behavior while still adding a few practical extras.

## Objective

Build a task app where a user can:

- Create a task
- View all tasks
- Update task state
- Delete a task

## What Is Implemented

### Core Requirements

- Frontend task list UI
- Add-task form
- Mark as completed
- Delete task
- Loading and error states
- Backend REST API
- Request validation
- Clear JSON success/error responses
- Clean route/controller/model structure

### Bonus Items Implemented

- Filter tasks by All / Completed / Incomplete
- Edit task title
- Persist tasks after refresh (client-side localStorage)
- Docker setup for frontend + backend + MongoDB

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Validation: express-validator
- Containerization: Docker + Docker Compose

## Project Structure

```
task manager/
	client/   # React frontend
	server/   # Express API
```

## Local Setup

### Prerequisites

- Node.js 20+
- npm
- MongoDB (local or Atlas)

If you want to run everything through Docker instead, jump to the Docker section below.

### 1) Backend Setup

From the project root:

```bash
cd server
npm install
```

Create a `.env` file inside `server/` (if not already present):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/task-manager
CLIENT_URL=http://localhost:5173
```

Run backend:

```bash
npm start
```

### 2) Frontend Setup

Open a second terminal from the project root:

```bash
cd client
npm install
npm run dev
```

App URL:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Docker Setup (Optional)

This project supports running the full stack (frontend + backend + MongoDB) in one command.

From the project root:

```bash
docker compose up --build
```

This starts:

- Frontend container (Vite): http://localhost:5173
- MongoDB container
- Backend container

Backend API is available at: http://localhost:5000

To stop containers:

```bash
docker compose down
```

To stop and remove volume data as well:

```bash
docker compose down -v
```

## Tests

Basic API tests are included for the backend (create, list, update, delete, and validation behavior).

Run tests:

```bash
cd server
npm test
```

## API Endpoints

| Method | Endpoint   | Description                 |
| ------ | ---------- | --------------------------- |
| GET    | /tasks     | Return all tasks            |
| POST   | /tasks     | Create a task               |
| PATCH  | /tasks/:id | Update task status or title |
| DELETE | /tasks/:id | Delete a task               |

Detailed API examples are available in `server/API_DOCUMENTATION.md`.

## Response Format

Success response shape:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "data": {}
}
```

Error response shape:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": []
}
```

## Assumptions and Trade-offs

- The assignment was intentionally time-boxed, so I prioritized clarity over adding many abstractions.
- I used MongoDB for persistence instead of in-memory storage to reflect a realistic API setup.
- The UI is intentionally minimal; behavior and reliability were prioritized over advanced design.
- Test coverage is intentionally basic and focused on backend API flows for this assignment scope.
- Client persistence via localStorage is included for UX convenience, even though server data is the source of truth.

## Notes

- If CORS issues appear, verify `CLIENT_URL` in `server/.env` matches your frontend URL.
- If MongoDB is not running locally, use Docker or point `MONGO_URI` to Atlas.
- The compose file is configured so the backend uses the internal MongoDB service host (`mongo`) automatically.
