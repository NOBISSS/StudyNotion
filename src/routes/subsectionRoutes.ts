import { Router } from "express";
import QuizRouter from "./quizRoutes.js";
import materialRouter from "./materialRoutes.js";

const subsectionRouter = Router();

subsectionRouter.use("/quiz", QuizRouter);
subsectionRouter.use("/material", materialRouter);

export default subsectionRouter;
