import { Router } from "express";
import {
  categoryPageDetails,
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../controllers/categoryController.js";
import { isAdmin, userMiddleware } from "../middlewares/userMiddleware.js";

const categoryRouter = Router();

categoryRouter.use(userMiddleware);
categoryRouter.use(isAdmin);

categoryRouter.route("/create").post(createCategory);
categoryRouter.route("/update/:categoryId").put(updateCategory);
categoryRouter.route("/delete/:categoryId").delete(deleteCategory);
categoryRouter.route("/getall").get(getAllCategory);
categoryRouter.route("/pagedetails/:categoryId").get(categoryPageDetails);

export { categoryRouter };