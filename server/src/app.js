import express from "express";

import cors from "cors";

import dotenv from "dotenv";

dotenv.config();

import errorHandler from "./middleware/ErrorHandler.middleware.js";

const app = express();

const rawClientUrl = process.env.CLIENT_URL || process.env.API_BASE_URL;
const allowedOrigin = (() => {
  if (!rawClientUrl) return "http://localhost:5173";
  try {
    return new URL(rawClientUrl).origin;
  } catch {
    return rawClientUrl;
  }
})();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: [allowedOrigin],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["Set-Cookie", "*"],
  }),
);
app.use(express.static("public"));

import healthCheckRouter from "./routes/healthCheck.router.js";
import taskRouter from "./routes/task.router.js";

app.use("/healthcheck", healthCheckRouter);
app.use("/tasks", taskRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} for specified method not found`,
  });
});

app.use(errorHandler);

export default app;
