import { Router } from "express";
import { authorizeRoles } from "../../shared/middlewares/role.middleware.js";
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js";
import { instructorDashboard, studentDashboard, adminDashboard } from "./dashboardController.js";
import { ROLES } from "../../shared/constants.js";
const dashboardRouter = Router();
dashboardRouter.use(userMiddleware);
dashboardRouter
    .route("/instructor")
    .get(authorizeRoles(ROLES.INSTRUCTOR), instructorDashboard);
dashboardRouter
    .route("/student")
    .get(authorizeRoles(ROLES.STUDENT), studentDashboard);
dashboardRouter
    .route("/admin")
    .get(authorizeRoles(ROLES.ADMIN), adminDashboard);
export default dashboardRouter;
//# sourceMappingURL=dashboardRoutes.js.map