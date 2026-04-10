import { Router } from "express";
import { body, param } from "express-validator";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
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
    body("title")
      .optional()
      .isString()
      .withMessage("Title must be a string")
      .bail()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Title must be between 1 and 200 characters"),
    body("completed")
      .optional()
      .bail()
      .isBoolean()
      .withMessage("Completed must be boolean"),
    body().custom((value) => {
      const hasTitle = typeof value?.title !== "undefined";
      const hasCompleted = typeof value?.completed !== "undefined";

      if (!hasTitle && !hasCompleted) {
        throw new Error("At least one of title or completed is required");
      }

      return true;
    }),
  ],
  validate,
  updateTask,
);

taskRouter.delete(
  "/:id",
  [param("id").isMongoId().withMessage("Invalid task id")],
  validate,
  deleteTask,
);

export default taskRouter;
