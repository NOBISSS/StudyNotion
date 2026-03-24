import { Router } from "express";
import {
  isAdmin,
  userMiddleware,
} from "../../shared/middlewares/userMiddleware.js";
import {
  categoryPageDetails,
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "./categoryController.js";
import { authorizeRoles } from "../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../shared/constants.js";

const categoryRouter = Router();

categoryRouter.route("/getall").get(getAllCategory);
categoryRouter.route("/pagedetails/:categoryId").get(categoryPageDetails);
categoryRouter.use(userMiddleware);

categoryRouter.use(authorizeRoles(ROLES.ADMIN));
categoryRouter.route("/create").post(createCategory);
categoryRouter.route("/update/:categoryId").put(updateCategory);
categoryRouter.route("/delete/:categoryId").delete(deleteCategory);

export { categoryRouter };
