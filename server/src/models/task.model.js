import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
  },
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
