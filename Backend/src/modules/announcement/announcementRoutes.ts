import { Router } from "express";
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js";
import { authorizeRoles } from "../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../shared/constants.js";
import { getAnnouncements, makeAnnouncement } from "./announcementController.js";

const announcementRouter = Router();

announcementRouter.use(userMiddleware);

announcementRouter.get("/getall/:courseId",getAnnouncements);
announcementRouter.get("/getread/:courseId",getAnnouncements);
announcementRouter.get("/getunread/:courseId",getAnnouncements);

announcementRouter.use(authorizeRoles(ROLES.INSTRUCTOR));
announcementRouter.post("/announce",makeAnnouncement);
announcementRouter.put("/update/:annoucementId",makeAnnouncement);
announcementRouter.delete("/delete/:annoucementId",makeAnnouncement);