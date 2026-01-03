import { Router } from "express";
import {
  categoryPageDetails,
  createCategory,
  getAllCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import { isAdmin, userMiddleware } from "../middlewares/userMiddleware.js";

const categoryRouter = Router();

categoryRouter.use(userMiddleware);
categoryRouter.use(isAdmin);

categoryRouter.route("/create").post(createCategory);
categoryRouter.route("/update/:categoryId").post(updateCategory);
categoryRouter.route("/getall").get(getAllCategory);
categoryRouter.route("/pagedetails/:categoryId").get(categoryPageDetails);

export { categoryRouter };