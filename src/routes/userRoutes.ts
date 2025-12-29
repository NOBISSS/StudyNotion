import { Router } from "express";
import {
  changePassword,
  deleteAccount,
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
  updateProfilePhoto,
} from "../controllers/userController.js";
import { upload } from "../middlewares/upload.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";
export const userRouter = Router();

userRouter.route("/signup").post(signupWithOTP);
userRouter.route("/signup/verify").post(signupOTPVerification);
userRouter.route("/forgotpassword").post(forgetWithOTP);
userRouter.route("/forgotpassword/verify").post(forgetOTPVerification);
userRouter.route("/resendotp").post(resenedOTP);
userRouter.route("/login").post(signin);

userRouter.use(userMiddleware);

userRouter.route("/logout").post(signout);
userRouter.route("/password").put(changePassword);
userRouter.route("/updateprofile").put(updateProfile);
userRouter
  .route("/changeprofilephoto")
  .put(upload.single("profilephoto"), updateProfilePhoto);
userRouter.route("/refreshtoken").post(refreshTokens);
userRouter.route("/getuser").get(getUser);
userRouter.route("/deleteaccount").delete(deleteAccount);
