import { Router } from "express";
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js";
import {
  deleteReview,
  getAllReviews,
  getGlobalReviews,
  rateAndReviewCourse,
  updateReview,
} from "./ratingsAndReviewController.js";
import { authorizeRoles } from "../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../shared/constants.js";

const reviewRouter = Router();

reviewRouter.route("/getall/:courseId").get(getAllReviews);
reviewRouter.route("/global").get(getGlobalReviews);
reviewRouter.use(userMiddleware);

reviewRouter.use(authorizeRoles(ROLES.STUDENT));
reviewRouter.route("/review").post(rateAndReviewCourse);
reviewRouter.route("/update/:reviewId").put(updateReview);
reviewRouter.route("/delete/:reviewId").delete(deleteReview);

export { reviewRouter };
