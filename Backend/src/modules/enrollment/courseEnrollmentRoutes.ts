import { Router } from "express";
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js";
import {
  EnrollInCourse,
  getAllEnrollments,
} from "./courseEnrollmentController.js";

const courseEnrollmentRouter = Router();

courseEnrollmentRouter.use(userMiddleware);

courseEnrollmentRouter.route("/enroll").post(EnrollInCourse);
courseEnrollmentRouter.route("/getall").get(getAllEnrollments);
// courseEnrollmentRouter.route("/pagedetails/:categoryId").get();

export { courseEnrollmentRouter };
