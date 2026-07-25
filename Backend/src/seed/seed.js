import mongoose from "mongoose";
import { config } from "dotenv";

config();

import { Admin } from "../modules/admin/admin.model.js";

const MONGO_URI = process.env.MONGO_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Missing required environment variables: MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD");
  process.exit(1);
}

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to database");

    const existing = await Admin.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log(`Admin already exists: ${ADMIN_EMAIL}`);
    } else {
      const admin = await Admin.create({
        name: "Super Admin",
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        role: "admin",
      });
      console.log(`Admin created: ${admin.email}`);
    }
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from database");
  }
};

seed();
