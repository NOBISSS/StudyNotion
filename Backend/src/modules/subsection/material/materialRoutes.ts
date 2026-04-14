import { Router } from "express";
import { isInstructor } from "../../../shared/middlewares/userMiddleware.js";
import {
  addMaterial,
  deleteMaterial,
  getMaterial,
  updateMaterial,
} from "./materialController.js";
import { authorizeRoles } from "../../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../../shared/constants.js";

const materialRouter = Router();
materialRouter.route("/get/:subsectionId").get(getMaterial);

materialRouter.use(authorizeRoles(ROLES.INSTRUCTOR));
materialRouter.route("/add").post(addMaterial);
materialRouter.route("/delete/:subsectionId").delete(deleteMaterial);
materialRouter.route("/update/:subsectionId").put(updateMaterial);

export default materialRouter;
