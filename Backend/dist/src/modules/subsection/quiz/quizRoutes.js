import { Router } from "express";
import { isInstructor } from "../../../shared/middlewares/userMiddleware.js";
import { attemptQuiz, createQuiz, deleteQuiz, getQuizAttemptByUser, getQuizBySubSectionId, updateQuiz, } from "./quizController.js";
import { authorizeRoles } from "../../../shared/middlewares/role.middleware.js";
import { ROLES } from "../../../shared/constants.js";
const QuizRouter = Router();
QuizRouter.route("/get/:subSectionId").get(getQuizBySubSectionId);
QuizRouter.route("/attempt").post(authorizeRoles(ROLES.STUDENT), attemptQuiz);
QuizRouter.route("/getattempt/:quizId").get(authorizeRoles(ROLES.STUDENT), getQuizAttemptByUser);
QuizRouter.use(authorizeRoles(ROLES.INSTRUCTOR));
QuizRouter.route("/add").post(createQuiz);
QuizRouter.route("/delete/:subSectionId").post(deleteQuiz);
QuizRouter.route("/update/:subSectionId").put(updateQuiz);
export default QuizRouter;
//# sourceMappingURL=quizRoutes.js.map