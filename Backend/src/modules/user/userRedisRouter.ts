import express from "express";
import { verifyOtpSession } from "../../shared/middlewares/verifyOtpSession.js";
import {
  forgetOTPVerificationRedis,
  forgetWithOTPRedis,
  resendOTP,
  signupOTPVerification,
  signupWithOTP,
} from "./userController.js";
export const userRedisRouter = express.Router();

userRedisRouter.post("/signup", signupWithOTP);
userRedisRouter.post("/signup/verify", verifyOtpSession, signupOTPVerification);
userRedisRouter.post("/forgotpassword", forgetWithOTPRedis);
userRedisRouter.post(
  "/forgotpassword/verify",
  verifyOtpSession,
  forgetOTPVerificationRedis,
);
userRedisRouter.post("/resendotp", verifyOtpSession, resendOTP);
