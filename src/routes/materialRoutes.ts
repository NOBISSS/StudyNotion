import { Router } from "express";
import { addMaterial, deleteMaterial, getMaterial } from "../controllers/materialController.js";
import { isInstructor } from "../middlewares/userMiddleware.js";

const materialRouter = Router();

materialRouter.use(isInstructor);
materialRouter.route("/add").post(addMaterial);
materialRouter.route("/get").get(getMaterial);
materialRouter.route("/delete/:subsectionId").delete(deleteMaterial);

export default materialRouter;