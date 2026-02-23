import { Router } from "express";
import { isInstructor } from "../../../shared/middlewares/userMiddleware.js";
import {
  addMaterial,
  deleteMaterial,
  getMaterial,
  updateMaterial,
} from "./materialController.js";

const materialRouter = Router();

materialRouter.use(isInstructor);
materialRouter.route("/add").post(addMaterial);
materialRouter.route("/get/:materialId").get(getMaterial);
materialRouter.route("/delete/:subsectionId").delete(deleteMaterial);
materialRouter.route("/update/:subsectionId").put(updateMaterial);

export default materialRouter;
