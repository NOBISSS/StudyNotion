import { Router } from "express";
import { ROLES } from "../../shared/constants.js";
import { authorizeRoles } from "../../shared/middlewares/role.middleware.js";
import { upload } from "../../shared/middlewares/upload.js";
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js";
import { submitContactForm } from "../contact/Contact.js";
import { createUser, getInstructors, getStudents, getUsers, updateProfile, updateProfilePhoto, } from "./userController.js";
const userRouter = Router();
userRouter.route("/contact").post(submitContactForm);
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
export default userRouter;
//# sourceMappingURL=userRoutes.js.map