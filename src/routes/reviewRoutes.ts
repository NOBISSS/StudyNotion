import { Router } from "express";
import {
  getAllReviews,
  rateAndReviewCourse,
  updateReview,
} from "../controllers/ratingsAndReviewController.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";

const reviewRouter = Router();

reviewRouter.use(userMiddleware);

reviewRouter.route("/review").post(rateAndReviewCourse);
reviewRouter.route("/getall").get(getAllReviews);
reviewRouter.route("/update").put(updateReview);

export { reviewRouter };
