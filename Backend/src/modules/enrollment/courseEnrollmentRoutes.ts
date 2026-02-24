import { Router } from "express";
import { isAdmin, userMiddleware } from "../../shared/middlewares/userMiddleware.js";
import {
  EnrollInCourse,
  getAllEnrollments,
  getUserEnrollments,
} from "./courseEnrollmentController.js";

const courseEnrollmentRouter = Router();

courseEnrollmentRouter.use(userMiddleware);

courseEnrollmentRouter.route("/enroll").post(EnrollInCourse);
courseEnrollmentRouter.route("/getmy").get(getUserEnrollments);
courseEnrollmentRouter.route("/getall").get(isAdmin,getAllEnrollments);
// courseEnrollmentRouter.route("/pagedetails/:categoryId").get();

export { courseEnrollmentRouter };
