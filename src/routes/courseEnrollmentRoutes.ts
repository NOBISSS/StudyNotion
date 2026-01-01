import { Router } from "express";
import {
  categoryPageDetails,
  createCategory,
  getAllCategory,
} from "../controllers/categoryController.js";
import { isAdmin, userMiddleware } from "../middlewares/userMiddleware.js";
import { EnrollInCourse, getAllEnrollments } from "../controllers/courseEnrollmentController.js";

const courseEnrollmentRouter = Router();

courseEnrollmentRouter.use(userMiddleware);

courseEnrollmentRouter.route("/enroll").post(EnrollInCourse);
courseEnrollmentRouter.route("/getall").get(getAllEnrollments);
// courseEnrollmentRouter.route("/pagedetails/:categoryId").get();

export { courseEnrollmentRouter };