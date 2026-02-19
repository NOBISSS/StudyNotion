import { Router } from "express";
import QuizRouter from "./quizRoutes.js";

const subsectionRouter = Router();

subsectionRouter.use("/quiz", QuizRouter);

export default subsectionRouter;
