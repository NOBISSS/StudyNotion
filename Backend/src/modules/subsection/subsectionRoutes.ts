import { Router } from "express";
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js";
import materialRouter from "../../routes/materialRoutes.js";
import QuizRouter from "../../routes/quizRoutes.js";
import videoRouter from "../../routes/videoRoutes.js";
import { getAllSubsections } from "./subsectionController.js";

const subsectionRouter = Router();

subsectionRouter.use(userMiddleware);
subsectionRouter.route("/getall/:sectionId").get(getAllSubsections);
subsectionRouter.use("/quiz", QuizRouter);
subsectionRouter.use("/material", materialRouter);
subsectionRouter.use("/video", videoRouter);

export default subsectionRouter;
