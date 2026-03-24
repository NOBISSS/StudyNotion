import { Router } from "express";
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js";
import { authorizeRoles } from "../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../shared/constants.js";
import { makeAnnouncement } from "./announcementController.js";

const announcementRouter = Router();

announcementRouter.use(userMiddleware);

announcementRouter.get("/getall/:courseId");
announcementRouter.get("/getread/:courseId");
announcementRouter.get("/getunread/:courseId");

announcementRouter.use(authorizeRoles(ROLES.INSTRUCTOR));
announcementRouter.post("/announce",makeAnnouncement);
announcementRouter.put("/update/:annoucementId",makeAnnouncement);
announcementRouter.delete("/delete/:annoucementId",makeAnnouncement);