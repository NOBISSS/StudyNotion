import { Router } from "express";
import { attemptQuiz, createQuiz, deleteQuiz, getQuizBySubSectionId, updateQuiz } from "../controllers/quizController.js";
import { isInstructor } from "../middlewares/userMiddleware.js";

const QuizRouter = Router();

QuizRouter.use(isInstructor);
QuizRouter.route("/add").post(createQuiz);
QuizRouter.route("/delete/:subSectionId").post(deleteQuiz);
QuizRouter.route("/get/:subSectionId").get(getQuizBySubSectionId);
QuizRouter.route("/update/:subSectionId").put(updateQuiz);
QuizRouter.route("/attempt").post(attemptQuiz);

export default QuizRouter;