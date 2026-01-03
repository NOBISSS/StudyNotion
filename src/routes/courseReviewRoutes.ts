import { Router } from "express";
import {
  getAllReviews,
  rateAndReviewCourse,
} from "../controllers/ratingsAndReviewController.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";

const courseReviewRouter = Router();

courseReviewRouter.use(userMiddleware);

courseReviewRouter.route("/review").post(rateAndReviewCourse);
courseReviewRouter.route("/getall").get(getAllReviews); 
// courseReviewRouter.route("/pagedetails/:categoryId").get();

export { courseReviewRouter };
