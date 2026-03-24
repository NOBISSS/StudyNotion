import { Router } from "express";
import { userMiddleware } from "../../shared/middlewares/userMiddleware.js";
import materialRouter from "./material/materialRoutes.js";
import QuizRouter from "./quiz/quizRoutes.js";
import { getAllSubsections } from "./subsectionController.js";
import videoRouter from "./video/videoRoutes.js";

const subsectionRouter = Router();

subsectionRouter.route("/getall/:sectionId").get(getAllSubsections);
subsectionRouter.use(userMiddleware);
subsectionRouter.use("/quiz", QuizRouter);
subsectionRouter.use("/material", materialRouter);
subsectionRouter.use("/video", videoRouter);

export default subsectionRouter;
