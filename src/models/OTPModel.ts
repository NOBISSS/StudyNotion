import { model, Schema } from "mongoose";
import { sendMail } from "../utils/mailer.js";
import bcrypt from "bcrypt";

const OTPSchema = new Schema({
  username: { type: String, required: true, trim: true },
  password: { type: String },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  otp: { type: Number, required: true },
  type: { type: String, enum: ["forget", "signup"] },
  createdAt: { type: Date, default: Date.now() },
});

OTPSchema.pre("save", async function () {
  if (this.isNew) {
    await sendMail(this.email, this.subject, this.username, this.otp);
  }
});

export const OTP = model("OTP", OTPSchema);
