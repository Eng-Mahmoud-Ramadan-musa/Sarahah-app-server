import { Schema, model } from "mongoose";

const otpSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"],
    },
    otp: {
      type: String,
      required: [true, "OTP is required"],
      minlength: [6, "OTP must be at least 6 characters"],
      maxlength: [6, "OTP must be at most 6 characters"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

export const OTP = model("OTP", otpSchema);
