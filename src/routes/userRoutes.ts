import { Router } from "express";
import {
  resenedOTP,
  signupOTPVerification,
  signupWithOTP,
} from "../controllers/userController.js";
export const userRouter = Router();

userRouter.route("/signup").post(signupWithOTP);
userRouter.route("/signup/verify").post(signupOTPVerification);
userRouter.route("/resendotp").post(resenedOTP);
userRouter.post("/login");
userRouter.post("/password");
userRouter.post("/logout");
