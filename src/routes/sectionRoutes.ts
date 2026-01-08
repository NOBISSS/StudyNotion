import { Router } from "express";
import {
  categoryPageDetails,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import { changeSectionOrder, createSection, removeSection } from "../controllers/sectionController.js";
import { isInstructor, userMiddleware } from "../middlewares/userMiddleware.js";

const sectionRouter = Router();

sectionRouter.use(userMiddleware);
sectionRouter.use(isInstructor);

sectionRouter.route("/create").post(createSection);
sectionRouter.route("/update/:sectionId").put(updateCategory);
sectionRouter.route("/remove/:sectionId").delete(removeSection);
sectionRouter.route("/getall").get(getAllCategory);
sectionRouter.route("/changeorder/:sectionId").put(changeSectionOrder);

export { sectionRouter };
