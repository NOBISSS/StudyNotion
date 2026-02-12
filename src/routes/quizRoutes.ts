import { Router } from "express";
import { createQuiz } from "../controllers/quizController.js";
import { isInstructor } from "../middlewares/userMiddleware.js";

const QuizRouter = Router();

QuizRouter.use(isInstructor);
QuizRouter.route("/add").post(createQuiz);

export default QuizRouter;