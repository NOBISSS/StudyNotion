import { Router } from "express";
import {
    deleteReview,
  getAllReviews,
  rateAndReviewCourse,
  updateReview,
} from "../controllers/ratingsAndReviewController.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";

const reviewRouter = Router();

reviewRouter.use(userMiddleware);

reviewRouter.route("/review").post(rateAndReviewCourse);
reviewRouter.route("/getall").get(getAllReviews);
reviewRouter.route("/update/:reviewId").put(updateReview);
reviewRouter.route("/delete/:reviewId").delete(deleteReview);

export { reviewRouter };
