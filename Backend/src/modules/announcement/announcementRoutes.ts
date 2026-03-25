import { Router } from "express";
import { ROLES } from "../../shared/constants.js";
import { authorizeRoles } from "../../shared/middlewares/role.middleware.js";
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js";
import {
  deleteAnnouncement,
  getAnnouncements,
  makeAnnouncement,
  markAnnouncementReadOrUnread,
  updateAnnouncement,
} from "./announcementController.js";

const announcementRouter = Router();

announcementRouter.use(userMiddleware);

announcementRouter.get("/getall/:courseId", getAnnouncements);
announcementRouter.get("/getread/:courseId", getAnnouncements);
announcementRouter.get("/getunread/:courseId", getAnnouncements);
announcementRouter.post(
  "/markread/:announcementId",
  markAnnouncementReadOrUnread,
);
announcementRouter.post(
  "/markunread/:announcementId",
  markAnnouncementReadOrUnread,
);

announcementRouter.use(authorizeRoles(ROLES.INSTRUCTOR));
announcementRouter.post("/announce", makeAnnouncement);
announcementRouter.put("/update/:annoucementId", updateAnnouncement);
announcementRouter.delete("/delete/:annoucementId", deleteAnnouncement);
