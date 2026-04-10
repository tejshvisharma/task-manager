import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import Task from "../models/task.model.js";

const getTasks = asyncHandler(async (_req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, { tasks }, "Tasks fetched successfully"));
});

const createTask = asyncHandler(async (req, res) => {
  const { title } = req.body;
  const task = await Task.create({ title });

  return res
    .status(201)
    .json(new ApiResponse(201, { task }, "Task created successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { completed, title } = req.body;

  const updateData = {};

  if (typeof completed === "boolean") {
    updateData.completed = completed;
  }

  if (typeof title === "string") {
    updateData.title = title.trim();
  }

  const task = await Task.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  let message = "Task updated successfully";

  if (
    Object.prototype.hasOwnProperty.call(updateData, "title") &&
    !Object.prototype.hasOwnProperty.call(updateData, "completed")
  ) {
    message = "Task title updated successfully";
  } else if (
    Object.prototype.hasOwnProperty.call(updateData, "completed") &&
    !Object.prototype.hasOwnProperty.call(updateData, "title")
  ) {
    message = "Task status updated successfully";
  }

  return res.status(200).json(new ApiResponse(200, { task }, message));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

export { getTasks, createTask, updateTask, deleteTask };
