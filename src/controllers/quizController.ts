import { Types } from "mongoose";
import { Quiz } from "../models/QuizModel.js";
import { SubSection } from "../models/SubSectionModel.js";
import { StatusCode, type Handler } from "../types.js";
import { attemptQuizSchema, createQuizSchema, updateQuizSchema } from "../validations/quizValidation.js";
import { isValidInstructor } from "./materialController.js";
import QuizAttempt from "../models/QuizAttemptModel.js";

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
    const { title, description, courseId, sectionId, questions } =
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
    const subSection = await SubSection.create({
      title,
      description: description || "",
      courseId,
      contentType: "quiz",
      sectionId,
    });
    const quiz = await Quiz.create({
      title,
      description: description || "",
      courseId,
      subSectionId: subSection._id,
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
    }).select("-questions.correctAnswer");
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
export const updateQuiz: Handler = async (req, res) => {
  try{
    const parsedQuizData = updateQuizSchema.safeParse(req.body);
    const subsectionId = req.params.subSectionId;
    if (!subsectionId) {
      res.status(StatusCode.InputError).json({
        message: "Quiz/Subsection ID is required in the URL parameters.",
      });
      return;
    }
    if (!parsedQuizData.success) {
      res.status(StatusCode.InputError).json({
        message: parsedQuizData.error.issues[0]?.message,
      });
      return;
    }
    const { title, description, questions } = parsedQuizData.data;
    const questionsWithIds = questions.map((q) => {
      let questionId = q.questionId ? q.questionId : new Types.ObjectId();
      const optionsWithIds = q.options.map((option) => {
        let optionId = option.optionId ? option.optionId : new Types.ObjectId();
        return {
          optionId,
          optionText: option.optionText,
        };
      });
      return {
        questionId,
        question: q.question,
        options: optionsWithIds,
        correctAnswer: q.correctAnswer,
        points: q.points,
      };
    });
    const quiz = await Quiz.findOneAndUpdate(
      { subSectionId: new Types.ObjectId(subsectionId) },
      { title, description, questions: questionsWithIds },
      { new: true }
    );
    if (!quiz) {
      res.status(StatusCode.NotFound).json({
        message: "Quiz not found for the given subsection ID.",
      });
      return;
    }
    res.status(StatusCode.Success).json({
      message: "Quiz updated successfully.",
      quiz,
    });
    return;
  }catch (err) {
    res.status(StatusCode.ServerError).json({
      message: "Something went wrong from ourside",
        error: err instanceof Error ? err.message : "Unknown error",
    });
    return;
  }
}
export const attemptQuiz: Handler = async (req, res) => {
  try{
    const parsedAttemptData = attemptQuizSchema.safeParse(req.body);
    if (!parsedAttemptData.success) {
      res.status(StatusCode.InputError).json({
        message: parsedAttemptData.error.issues[0]?.message,
      });
      return;
    }
    const { quizId, answers } = parsedAttemptData.data;
    const quiz = await Quiz.findById(new Types.ObjectId(quizId));
    if (!quiz) {
      res.status(StatusCode.NotFound).json({
        message: "Quiz not found for the given quiz ID.",
      });
      return;
    }
    let score = 0;
    const answersWithCorrectness = answers.map((answer) => {
      const question = quiz.questions.find(
        (q) => q.questionId.toString() === answer.questionId,
      );
      if (!question) {
        return {
          questionId: new Types.ObjectId(answer.questionId),
          answer: new Types.ObjectId(answer.answer),
          isCorrect: false,
        };
      }
      const isCorrect =
        question.correctAnswer.toString() === answer.answer;
      if (isCorrect) {
        score += question.points;
      }
      return {
        questionId: new Types.ObjectId(answer.questionId),
        answer: new Types.ObjectId(answer.answer),
        isCorrect,
      };
    });
    const quizAttempt = await QuizAttempt.create({
      userId: new Types.ObjectId(req.userId),
      quizId: new Types.ObjectId(quizId),
      score,
      answers: answersWithCorrectness,
    });
    res.status(StatusCode.Success).json({
      message: "Quiz attempt recorded successfully.",
      quizAttempt,
    });
    return;
  }
  catch (err) {
    res.status(StatusCode.ServerError).json({
      message: "Something went wrong from ourside",
        error: err instanceof Error ? err.message : "Unknown error",
    });
    return;
  }
}