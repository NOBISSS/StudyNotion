import { Router } from "express";
import { getAllCategory } from "../controllers/categoryController.js";
import {
  changeSectionOrder,
  createSection,
  getAllSections,
  removeSection,
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

export { sectionRouter };
