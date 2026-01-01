import { model, Schema } from "mongoose";
import { OtpTemp } from "../mail/templates/OTPTemplate.js";
import { sendMail } from "../utils/mailer.js";

const OTPSchema = new Schema({
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  password: { type: String },
  accountType: {
    type: String,
    enum: {
      values: ["student", "instructor", "admin"],
      message: "{VALUE} is not supported",
    },
    default: "student",
  },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  otp: { type: Number, required: true },
  type: { type: String, enum: ["forget", "signup"] },
  createdAt: { type: Date, default: Date.now() },
});

OTPSchema.pre("save", async function () {
  if (this.isNew) {
    await sendMail(this.email, this.subject, OtpTemp(this.otp));
  }
});

export const OTP = model("OTP", OTPSchema);
