import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI?.trim();

  if (!MONGO_URI) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    if (
      error?.code === 8000 ||
      /bad auth|authentication failed/i.test(error?.message)
    ) {
      console.error(
        "❌ MongoDB authentication failed. Verify Atlas DB username, password, and DB user permissions.",
      );
    }
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
