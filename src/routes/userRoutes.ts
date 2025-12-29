import { Router } from "express";
import {
  changePassword,
  forgetOTPVerification,
  forgetWithOTP,
  getUser,
  refreshTokens,
  resenedOTP,
  signin,
  signout,
  signupOTPVerification,
  signupWithOTP,
  updateProfile,
} from "../controllers/userController.js";
import { verifyJWT } from "../middlewares/user.middleware.js";
export const userRouter = Router();

userRouter.route("/signup").post(signupWithOTP);
userRouter.route("/signup/verify").post(signupOTPVerification);
userRouter.route("/forgotpassword").post(forgetWithOTP);
userRouter.route("/forgotpassword/verify").post(forgetOTPVerification);
userRouter.route("/resendotp").post(resenedOTP);
userRouter.route("/login").post(signin);

userRouter.use(verifyJWT);

userRouter.route("/logout").post(signout);
userRouter.route("/password").put(changePassword);
userRouter.route("/updateprofile").put(updateProfile);
userRouter.route("/refreshtoken").post(refreshTokens);
userRouter.route("/getuser").get(getUser);
