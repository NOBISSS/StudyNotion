import express from "express";
import { resendOTP, signupOTPVerification, signupWithOTP } from "../controllers/userController.js";
import { verifyOtpSession } from "../middlewares/verifyOtpSession.js";
export const userRedisRouter=express.Router();

userRedisRouter.post("/signup",signupWithOTP);
userRedisRouter.post("/signup/verify",verifyOtpSession,signupOTPVerification);
userRedisRouter.post("/resendotp",verifyOtpSession,resendOTP); 
