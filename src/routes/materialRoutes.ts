import { Router } from "express";
import { addMaterial } from "../controllers/materialController.js";
import { isInstructor } from "../middlewares/userMiddleware.js";

const materialRouter = Router();

materialRouter.use(isInstructor);
materialRouter.route("/add").post(addMaterial);

export default materialRouter;