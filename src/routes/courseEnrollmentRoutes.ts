import { Router } from "express";
import {
  EnrollInCourse,
  getAllEnrollments,
} from "../controllers/courseEnrollmentController.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";

const courseEnrollmentRouter = Router();

courseEnrollmentRouter.use(userMiddleware);

courseEnrollmentRouter.route("/enroll").post(EnrollInCourse);
courseEnrollmentRouter.route("/getall").get(getAllEnrollments);
// courseEnrollmentRouter.route("/pagedetails/:categoryId").get();

export { courseEnrollmentRouter };
