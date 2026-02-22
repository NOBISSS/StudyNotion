import { Router } from "express";
import QuizRouter from "./quizRoutes.js";
import materialRouter from "./materialRoutes.js";
import videoRouter from "./videoRoutes.js";
import { userMiddleware } from "../middlewares/userMiddleware.js";
import { getAllSubsections } from "../controllers/subsectionController.js";

const subsectionRouter = Router();

subsectionRouter.use(userMiddleware);
subsectionRouter.route("/getall/:sectionId").get(getAllSubsections);
subsectionRouter.use("/quiz", QuizRouter);
subsectionRouter.use("/material", materialRouter);
subsectionRouter.use("/video", videoRouter);

export default subsectionRouter;
