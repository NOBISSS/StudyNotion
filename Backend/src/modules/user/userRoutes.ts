import { Router } from "express";
import { upload } from "../../shared/middlewares/upload.js";
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js";
import {
  changePassword,
  createUser,
  deleteAccount,
  forgetOTPVerificationRedis,
  forgetWithOTPRedis,
  getUser,
  getUsers,
  refreshTokens,
  resendOTP,
  signin,
  signout,
  signupOTPVerification,
  signupWithOTP,
  updateProfile,
  updateProfilePhoto,
} from "./userController.js";
import { isAdmin } from "../../shared/middlewares/userMiddleware.js";
export const userRouter = Router();
// export const router=Router();
// router.post("/signup",signupWithOTP);
// router.post("/signup/verify",verifyOtpSession,signupOTPVerification);
// router.post("/resendotp",verifyOtpSession,resendOTP);

userRouter.route("/signup").post(signupWithOTP);
userRouter.route("/signup/verify").post(signupOTPVerification);
userRouter.route("/forgotpassword").post(forgetWithOTPRedis);
userRouter.route("/forgotpassword/verify").post(forgetOTPVerificationRedis);
userRouter.route("/resendotp").post(resendOTP);
userRouter.route("/login").post(signin);

userRouter.route("/create").post(userMiddleware,isAdmin, createUser);
userRouter.route("/getall").get(userMiddleware,isAdmin, getUsers);

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
