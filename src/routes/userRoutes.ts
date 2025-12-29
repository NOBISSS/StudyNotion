import { Router } from "express";
import {
    changePassword,
    getUser,
    refreshTokens,
  resenedOTP,
  signin,
  signout,
  signupOTPVerification,
  signupWithOTP,
} from "../controllers/userController.js";
import { verifyJWT } from "../middlewares/user.middleware.js";
export const userRouter = Router();

userRouter.route("/signup").post(signupWithOTP);
userRouter.route("/signup/verify").post(signupOTPVerification);
userRouter.route("/resendotp").post(resenedOTP);
userRouter.route("/login").post(signin);

userRouter.use(verifyJWT);

userRouter.route("/logout").post(signout);
userRouter.route("/password").put(changePassword);
userRouter.route("/refreshtoken").post(refreshTokens);
userRouter.route("/getuser").get(getUser);
