import { Router } from "express";
import QuizRouter from "./quizRoutes.js";
import materialRouter from "./materialRoutes.js";
import videoRouter from "./videoRoutes.js";

const subsectionRouter = Router();

subsectionRouter.use("/quiz", QuizRouter);
subsectionRouter.use("/material", materialRouter);
subsectionRouter.use("/video", videoRouter);

export default subsectionRouter;
