import { Router } from "express";
import {
  createCourse,
  getAllCourse,
  getAllCourseByEnrollmentsAndRatings,
  getAllCourseByEnrollmentsAndRatingsAndCategory,
} from "../controllers/courseController.js";
import { upload } from "../middlewares/upload.js";
import { isInstructor, userMiddleware } from "../middlewares/userMiddleware.js";

const courseRouter = Router();

courseRouter.use(userMiddleware);
courseRouter.route("/getall").get(getAllCourse);
courseRouter.route("/gettopcourses").get(getAllCourseByEnrollmentsAndRatings);
courseRouter
  .route("/gettopcourses/:categoryId")
  .get(getAllCourseByEnrollmentsAndRatingsAndCategory);
courseRouter.use(isInstructor);
courseRouter.route("/create").post(upload.single("thumbnail"), createCourse);
// courseRouter.route("/delete/:id").delete();
// courseRouter.route("/getcourse/:id").get();
// courseRouter.route("/update/:id").post();

export { courseRouter };
