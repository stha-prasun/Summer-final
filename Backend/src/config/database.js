import mongoose from "mongoose";
import logger from "./logger.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    logger.info("Database Connected!!");
  } catch (error) {
    logger.error("Database connection failed", { error: error.message });
    process.exit(1);
  }
};

export default connectDB;