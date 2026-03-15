import { Router } from "express";
import { upload } from "../../shared/middlewares/upload.js";
import {
  isInstructor,
  userMiddleware,
} from "../../shared/middlewares/userMiddleware.js";
import {
  createCourse,
  createCourseWithThumbnailURL,
  deleteCourse,
  getAllCourse,
  getAllCourseByEnrollmentsAndRatings,
  getAllCourseByEnrollmentsAndRatingsAndCategory,
  updateCourse,
} from "./courseController.js";
import { authorizeRoles } from "../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../shared/constants.js";

const courseRouter = Router();

courseRouter.use(userMiddleware);
courseRouter.route("/getall").get(getAllCourse);
courseRouter.route("/gettop").get(getAllCourseByEnrollmentsAndRatings);
courseRouter
  .route("/gettop/:categoryId")
  .get(getAllCourseByEnrollmentsAndRatingsAndCategory);
courseRouter.use(authorizeRoles(ROLES.INSTRUCTOR));
courseRouter.route("/create").post(upload.single("thumbnail"), createCourse);
courseRouter.route("/createcourse").post(createCourseWithThumbnailURL);
courseRouter.route("/delete/:courseId").delete(deleteCourse);
// courseRouter.route("/getcourse/:id").get();
courseRouter.route("/update/:courseId").put(updateCourse);

export { courseRouter };
