import { Router } from "express";
import { body, param } from "express-validator";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTaskStatus,
} from "../controllers/task.controller.js";
import validate from "../middleware/validate.middleware.js";

const taskRouter = Router();

taskRouter.get("/", getTasks);

taskRouter.post(
  "/",
  [
    body("title")
      .exists({ checkFalsy: true })
      .withMessage("Title is required")
      .bail()
      .isString()
      .withMessage("Title must be a string")
      .bail()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Title must be between 1 and 200 characters"),
  ],
  validate,
  createTask,
);

taskRouter.patch(
  "/:id",
  [
    param("id").isMongoId().withMessage("Invalid task id"),
    body("completed")
      .exists()
      .withMessage("Completed status is required")
      .bail()
      .isBoolean()
      .withMessage("Completed must be boolean"),
  ],
  validate,
  updateTaskStatus,
);

taskRouter.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid task id")],
  validate,
  deleteTask,
);

export default taskRouter;
