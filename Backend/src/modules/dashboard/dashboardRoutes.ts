import { Router } from "express";
import { authorizeRoles } from "../../shared/middlewares/role.middleware.js";
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js";
import { instructorDashboard } from "./dashboardController.js";
import { ROLES } from "../../shared/constants.js";

const dashboardRouter = Router();

dashboardRouter.use(userMiddleware);
dashboardRouter
  .route("/instructor")
  .get(authorizeRoles(ROLES.INSTRUCTOR), instructorDashboard);

export default dashboardRouter;
