import { Router } from "express";
import {
  changeSectionOrder,
  createSection,
  getAllSections,
  getRemovedSections,
  removeSection,
  undoRemoveSection,
  updateSection,
} from "../controllers/sectionController.js";
import { isInstructor, userMiddleware } from "../middlewares/userMiddleware.js";

const sectionRouter = Router();

sectionRouter.use(userMiddleware);
sectionRouter.use(isInstructor);

sectionRouter.route("/create").post(createSection);
sectionRouter.route("/update/:sectionId").put(updateSection);
sectionRouter.route("/remove/:sectionId").delete(removeSection);
sectionRouter.route("/getall/:courseId").get(getAllSections);
sectionRouter.route("/changeorder/:sectionId").put(changeSectionOrder);
sectionRouter.route("/removed/:courseId").get(getRemovedSections);
sectionRouter.route("/undoRemove/:sectionId").put(undoRemoveSection);

export { sectionRouter };
