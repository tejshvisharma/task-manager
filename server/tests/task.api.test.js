import mongoose from "mongoose";
import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { MongoMemoryServer } from "mongodb-memory-server";

import app from "../src/app.js";
import Task from "../src/models/task.model.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

beforeEach(async () => {
  await Task.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Task API", () => {
  it("creates a task", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Write tests" });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.task.title).toBe("Write tests");
    expect(res.body.data.task.completed).toBe(false);
    expect(typeof res.body.data.task.id).toBe("string");
  });

  it("returns validation error when title is missing", async () => {
    const res = await request(app).post("/tasks").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Validation failed");
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it("returns all tasks", async () => {
    await Task.create([{ title: "Task A" }, { title: "Task B" }]);

    const res = await request(app).get("/tasks");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.tasks)).toBe(true);
    expect(res.body.data.tasks.length).toBe(2);
  });

  it("updates task completed status", async () => {
    const task = await Task.create({ title: "Toggle me" });

    const res = await request(app)
      .patch(`/tasks/${task.id}`)
      .send({ completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.task.completed).toBe(true);
  });

  it("updates task title", async () => {
    const task = await Task.create({ title: "Old title" });

    const res = await request(app)
      .patch(`/tasks/${task.id}`)
      .send({ title: "New title" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.task.title).toBe("New title");
  });

  it("deletes a task", async () => {
    const task = await Task.create({ title: "Delete me" });

    const res = await request(app).delete(`/tasks/${task.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const deleted = await Task.findById(task.id);
    expect(deleted).toBeNull();
  });
});
