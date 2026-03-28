import { Router } from "express";
import { upload } from "../../shared/middlewares/upload.js";
import { isAdmin, userMiddleware } from "../../shared/middlewares/userMiddleware.js";
import {
  createUser,
  getInstructors,
  getStudents,
  getUsers,
  updateProfile,
  updateProfilePhoto,
} from "./userController.js";
import { authorizeRoles } from "../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../shared/constants.js";
import { submitContactForm } from "../contact/Contact.js";

const userRouter = Router();


userRouter.use(userMiddleware);
userRouter.route("/updateprofile").put(updateProfile);
userRouter
.route("/changeprofilephoto")
.put(upload.single("profilephoto"), updateProfilePhoto);

userRouter.use(authorizeRoles(ROLES.ADMIN));
userRouter.route("/create").post(createUser);
userRouter.route("/getall").get(getUsers);
userRouter.route("/getinstructors").get(getInstructors);
userRouter.route("/getstudents").get(getStudents);
userRouter.route("/contact").post(submitContactForm);
export default userRouter;