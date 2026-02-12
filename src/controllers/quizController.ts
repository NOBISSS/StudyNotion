import { Types } from "mongoose";
import { Quiz } from "../models/QuizModel.js";
import { StatusCode, type Handler } from "../types.js";
import { createQuizSchema } from "../validations/quizValidation.js";
import { isValidInstructor } from "./materialController.js";

export const createQuiz: Handler = async (req, res) => {
  try {
    const parsedQuizData = createQuizSchema.safeParse(req.body);
    const userId = new Types.ObjectId(req.userId);
    if (!userId) {
      res.status(StatusCode.Unauthorized).json({
        message: "Unauthorized. User ID is missing.",
      });
      return;
    }
    if (!parsedQuizData.success) {
      return res.status(StatusCode.InputError).json({
        message: parsedQuizData.error.issues[0]?.message,
      });
    }
    const { title, description, courseId, subSectionId, questions } =
      parsedQuizData.data;
    const course = await isValidInstructor(
      new Types.ObjectId(courseId),
      userId,
    );
    if (!course) {
      res.status(StatusCode.Unauthorized).json({
        message: "You are not authorized to add quiz to this course.",
      });
      return;
    }
    const quiz = await Quiz.create({
      title,
      description: description || "",
      courseId,
      subSectionId,
      questions,
    });
    res.status(StatusCode.Success).json({
      message: "Quiz created successfully",
      quiz,
    });
    return;
  } catch (err) {
    res.status(StatusCode.ServerError).json({
      message: "Something went wrong from ourside",
      error: err instanceof Error ? err.message : "Unknown error",
    });
    return;
  }
};
