import { Router } from "express";
import { instructorDashboard } from "./dashboardController.js";

const dashboardRouter = Router();

dashboardRouter.route("/instructor").get(instructorDashboard);

export default dashboardRouter;