import { Types } from "mongoose";
import { Quiz } from "../models/QuizModel.js";
import { SubSection } from "../models/SubSectionModel.js";
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
    const questionsWithIds = questions.map((q) => ({
      ...q,
      questionId: new Types.ObjectId(),
      options: q.options.map((option) => ({
        optionId: new Types.ObjectId(),
        optionText: option,
      })),
    }));
    const quiz = await Quiz.create({
      title,
      description: description || "",
      courseId,
      subSectionId,
      questions: questionsWithIds,
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
export const deleteQuiz: Handler = async (req, res) => {
  try {
    const subsectionId = req.params.subSectionId;
    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) {
      res
        .status(StatusCode.NotFound)
        .json({ message: "Subsection not found." });
      return;
    }
    const course = await isValidInstructor(
      new Types.ObjectId(subsection.courseId),
      new Types.ObjectId(req.userId),
    );
    if (!course) {
      res.status(StatusCode.Unauthorized).json({
        message: "You are not authorized to delete quiz from this course.",
      });
      return;
    }
    const quiz = await Quiz.findOneAndUpdate(
      { subSectionId: subsection._id, courseId: subsection.courseId },
      { isActive: false },
    );
    if (!quiz) {
      return res
        .status(StatusCode.NotFound)
        .json({ message: "Quiz not found for the given subsection ID." });
    }
    subsection.isActive = false;
    await subsection.save();
    res
      .status(StatusCode.Success)
      .json({ message: "Quiz deleted successfully." });
    return;
  } catch (err) {
    res.status(StatusCode.ServerError).json({
      message: "Something went wrong from ourside",
      error: err instanceof Error ? err.message : "Unknown error",
    });
    return;
  }
};
export const getQuizBySubSectionId: Handler = async (req, res) => {
  try {
    const subSectionId = req.params.subSectionId;
    const quiz = await Quiz.findOne({
      subSectionId: new Types.ObjectId(subSectionId),
      isActive: true,
    });
    if (!quiz) {
      res
        .status(StatusCode.NotFound)
        .json({ message: "Quiz not found for the given subsection ID." });
      return;
    }
    res.status(StatusCode.Success).json({
      message: "Quiz retrieved successfully.",
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