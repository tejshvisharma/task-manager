# Task Manager API Documentation

Base URL:

- Local: `http://localhost:5000`

## Common Response Format

Success response:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Success message",
  "data": {}
}
```

Validation or error response:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "msg": "Title is required",
      "path": "title",
      "location": "body"
    }
  ]
}
```

## Task Model

```ts
type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};
```

## Endpoints

### 0) Healthcheck

- Method: `GET`
- Endpoint: `/healthcheck`
- Description: Returns server health status.

Success example:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Server is up and running",
  "data": null
}
```

### 1) Get all tasks

- Method: `GET`
- Endpoint: `/tasks`
- Description: Returns all tasks in descending order of creation time.

Success example:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Tasks fetched successfully",
  "data": {
    "tasks": [
      {
        "id": "67f6b8f5f1d7f31f8bcf0001",
        "title": "Finish assignment",
        "completed": false,
        "createdAt": "2026-04-10T10:20:00.000Z"
      }
    ]
  }
}
```

### 2) Create a task

- Method: `POST`
- Endpoint: `/tasks`
- Description: Creates a new task.

Request body:

```json
{
  "title": "Finish assignment"
}
```

Validation rules:

- `title` is required.
- `title` must be a string.
- `title` length must be between 1 and 200.

Success example:

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Task created successfully",
  "data": {
    "task": {
      "id": "67f6b8f5f1d7f31f8bcf0001",
      "title": "Finish assignment",
      "completed": false,
      "createdAt": "2026-04-10T10:20:00.000Z"
    }
  }
}
```

### 3) Update task

- Method: `PATCH`
- Endpoint: `/tasks/:id`
- Description: Updates task fields (`title`, `completed`) by id.

Request body:

```json
{
  "title": "Finish assignment docs",
  "completed": true
}
```

You can send only `title`, only `completed`, or both.

Validation rules:

- `id` must be a valid MongoDB ObjectId.
- At least one of `title` or `completed` is required.
- `title` must be a string with length between 1 and 200.
- `completed` must be a boolean.

Success example:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "id": "67f6b8f5f1d7f31f8bcf0001",
      "title": "Finish assignment",
      "completed": true,
      "createdAt": "2026-04-10T10:20:00.000Z"
    }
  }
}
```

### 4) Delete task

- Method: `DELETE`
- Endpoint: `/tasks/:id`
- Description: Deletes a task.

Validation rules:

- `id` must be a valid MongoDB ObjectId.

Success example:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Task deleted successfully",
  "data": {}
}
```

## Status Codes

- `200`: Success for fetch, update, and delete.
- `201`: Success for create.
- `400`: Validation error.
- `404`: Task not found.
- `500`: Internal server error.
