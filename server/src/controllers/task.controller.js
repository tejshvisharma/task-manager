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

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const task = await Task.findByIdAndUpdate(
    id,
    { completed },
    { new: true, runValidators: true },
  );

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { task }, "Task status updated successfully"));
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

export { getTasks, createTask, updateTaskStatus, deleteTask };
