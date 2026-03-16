import { Router } from "express";
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js";

import {
  changePassword,
  deleteAccount,
  forgetOTPVerification,
  forgetWithOTP,
  getUser,
  refreshTokens,
  resendOTP,
  signin,
  signout,
  signupOTPVerification,
  signupWithOTP,
} from "./authController.js";
const authRouter = Router();

authRouter.route("/signup").post(signupWithOTP);
authRouter.route("/signup/verify").post(signupOTPVerification);
authRouter.route("/forgotpassword").post(forgetWithOTP);
authRouter.route("/forgotpassword/verify").post(forgetOTPVerification);
authRouter.route("/resendotp").post(resendOTP);
authRouter.route("/login").post(signin);
authRouter.route("/refreshtoken").post(refreshTokens);

authRouter.use(userMiddleware);

authRouter.route("/logout").post(signout);
authRouter.route("/changepassword").put(changePassword);
authRouter.route("/getuser").get(getUser);
authRouter.route("/deleteaccount").delete(deleteAccount);

export default authRouter;