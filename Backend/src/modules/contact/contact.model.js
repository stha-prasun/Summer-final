import mongoose from "mongoose";

const contactModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Contact = mongoose.model("Contact", contactModel);