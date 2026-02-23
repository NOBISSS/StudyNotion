import { Router } from "express";
import { userMiddleware } from "../middlewares/userMiddleware.js";
import {
  deleteReview,
  getAllReviews,
  rateAndReviewCourse,
  updateReview,
} from "../modules/rating/ratingsAndReviewController.js";

const reviewRouter = Router();

reviewRouter.use(userMiddleware);

reviewRouter.route("/review").post(rateAndReviewCourse);
reviewRouter.route("/getall/:courseId").get(getAllReviews);
reviewRouter.route("/update/:reviewId").put(updateReview);
reviewRouter.route("/delete/:reviewId").delete(deleteReview);

export { reviewRouter };
