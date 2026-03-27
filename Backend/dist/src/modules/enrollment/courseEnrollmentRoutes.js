import { Router } from "express";
import { ROLES } from "../../shared/constants.js";
import { authorizeRoles } from "../../shared/middlewares/role.middleware.js";
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js";
import { EnrollInCourse, getAllEnrollments, getUserEnrollments, } from "./courseEnrollmentController.js";
const courseEnrollmentRouter = Router();
courseEnrollmentRouter.use(userMiddleware);
courseEnrollmentRouter.route("/enroll").post(authorizeRoles(ROLES.STUDENT), EnrollInCourse);
courseEnrollmentRouter.route("/getmy").get(authorizeRoles(ROLES.STUDENT), getUserEnrollments);
courseEnrollmentRouter.route("/getall").get(authorizeRoles(ROLES.ADMIN), getAllEnrollments);
export { courseEnrollmentRouter };
//# sourceMappingURL=courseEnrollmentRoutes.js.map