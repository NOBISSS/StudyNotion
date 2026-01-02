import express from "express";
import { forgetOTPVerificationRedis, forgetWithOTPRedis, resendOTP, signupOTPVerification, signupWithOTP } from "../controllers/userController.js";
import { verifyOtpSession } from "../middlewares/verifyOtpSession.js";
export const userRedisRouter=express.Router();

userRedisRouter.post("/signup",signupWithOTP);
userRedisRouter.post("/signup/verify",verifyOtpSession,signupOTPVerification);
userRedisRouter.post("/forgotpassword",forgetWithOTPRedis);
userRedisRouter.post("/forgotpassword/verify",verifyOtpSession,forgetOTPVerificationRedis);
userRedisRouter.post("/resendotp",verifyOtpSession,resendOTP); 
