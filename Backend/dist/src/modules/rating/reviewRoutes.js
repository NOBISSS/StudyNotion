import { Router } from "express";
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js";
import { deleteReview, getAllReviews, rateAndReviewCourse, updateReview, } from "./ratingsAndReviewController.js";
import { authorizeRoles } from "../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../shared/constants.js";
const reviewRouter = Router();
reviewRouter.route("/getall/:courseId").get(getAllReviews);
reviewRouter.use(userMiddleware);
reviewRouter.use(authorizeRoles(ROLES.STUDENT));
reviewRouter.route("/review").post(rateAndReviewCourse);
reviewRouter.route("/update/:reviewId").put(updateReview);
reviewRouter.route("/delete/:reviewId").delete(deleteReview);
export { reviewRouter };
//# sourceMappingURL=reviewRoutes.js.map