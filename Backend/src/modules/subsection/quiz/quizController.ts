import { Types } from "mongoose";
import { ApiResponse } from "../../../shared/lib/ApiResponse.js";
import { AppError } from "../../../shared/lib/AppError.js";
import { asyncHandler } from "../../../shared/lib/asyncHandler.js";
import { isValidInstructor } from "../material/materialController.js";
import { isEnrolled } from "../subsection.utils.js";
import { SubSection } from "../SubSectionModel.js";
import QuizAttempt from "./QuizAttemptModel.js";
import { Quiz } from "./QuizModel.js";
import {
  attemptQuizSchema,
  createQuizSchema,
  updateQuizSchema,
} from "./quizValidation.js";
import { Section } from "../../section/SectionModel.js";
import { Course } from "../../course/CourseModel.js";

export const createQuiz = asyncHandler(async (req, res) => {
  const parsedQuizData = createQuizSchema.safeParse(req.body);
  const userId = new Types.ObjectId(req.userId);
  if (!userId) {
    throw AppError.unauthorized("User ID is required");
  }
  if (!parsedQuizData.success) {
    throw AppError.badRequest(
      parsedQuizData.error.issues[0]?.message || "Invalid input data",
    );
  }
  const { title, description, courseId, sectionId, questions } =
    parsedQuizData.data;
  const course = await isValidInstructor(
    new Types.ObjectId(courseId),
    userId,
    req.user?.accountType,
  );
  if (!course) {
    throw AppError.unauthorized(
      "You are not authorized to add quiz to this course.",
    );
  }
  const questionsWithIds = questions.map((q) => {
    return {
      ...q,
      questionId: new Types.ObjectId(),
      options: q.options.map((option) => ({
        optionId: new Types.ObjectId(),
        optionText: option,
      })),
    };
  });
  const correctAnswerIds = questionsWithIds.map((q) => {
    const correctOption = q.options.find(
      (o) => o.optionText.toLowerCase() === q.correctAnswer.toLowerCase(),
    );
    return correctOption ? correctOption.optionId : null;
  });
  questionsWithIds.forEach((q, index) => {
    q.correctAnswer = correctAnswerIds[index]?.toString() || "";
  });
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
  await Section.findByIdAndUpdate(sectionId, {
    $push: { subSectionIds: subSection._id },
  });
  await Course.findByIdAndUpdate(courseId, {
    $inc: { totalQuizzes: 1, totalSubsections: 1 },
  });
  ApiResponse.created(
    res,
    {
      quiz,
    },
    "Quiz created successfully",
  );
});
export const deleteQuiz = asyncHandler(async (req, res) => {
  const subsectionId = req.params.subSectionId;
  if(!subsectionId || typeof subsectionId !== "string") {
    throw AppError.badRequest("Subsection ID is required");
  }
  const subsection = await SubSection.findById(subsectionId);
  if (!subsection) {
    throw AppError.notFound("Subsection not found.");
  }
  const course = await isValidInstructor(
    new Types.ObjectId(subsection.courseId),
    new Types.ObjectId(req.userId),
    req.user?.accountType,
  );
  if (!course) {
    throw AppError.unauthorized(
      "You are not authorized to delete quiz of this course.",
    );
  }
  const quiz = await Quiz.findOneAndUpdate(
    { subSectionId: subsection._id, courseId: subsection.courseId },
    { isActive: false },
  );
  if (!quiz) {
    throw AppError.notFound("Quiz not found for the given subsection ID.");
  }
  subsection.isActive = false;
  await subsection.save();
  await Section.findByIdAndUpdate(subsection.sectionId, {
    $pull: { subSectionIds: subsection._id },
  });
  await Course.findByIdAndUpdate(quiz.courseId, {
    $inc: { totalQuizzes: -1, totalSubsections: -1 },
  });
  ApiResponse.success(res, {}, "Quiz deleted successfully.");
});
export const getQuizBySubSectionId = asyncHandler(async (req, res) => {
  const subSectionId = req.params.subSectionId;
  if(!subSectionId || typeof subSectionId !== "string") {
    throw AppError.badRequest("Subsection ID is required");
  }
  const userId = new Types.ObjectId(req.userId);
  // const quiz = await Quiz.findOne({
  //   subSectionId: new Types.ObjectId(subSectionId),
  //   isActive: true,
  // });
  const quiz = await Quiz.findOne({
    subSectionId: new Types.ObjectId(subSectionId),
    isActive: true,
  }).select("-questions.correctAnswer");

  if (!quiz) {
    throw AppError.notFound("Quiz not found for the given subsection ID.");
  }
  if (!(await isEnrolled(userId.toString(), quiz.courseId.toString()))) {
    throw AppError.unauthorized(
      "You are not enrolled in the course for this quiz.",
    );
  }
  ApiResponse.success(
    res,
    {
      quiz,
    },
    "Quiz retrieved successfully.",
  );
});
export const updateQuiz = asyncHandler(async (req, res) => {
  const parsedQuizData = updateQuizSchema.safeParse(req.body);
  const subsectionId = req.params.subSectionId;
  if(!subsectionId || typeof subsectionId !== "string") {
    throw AppError.badRequest("Subsection ID is required");
  }
  if (!parsedQuizData.success) {
    throw AppError.badRequest(
      parsedQuizData.error.issues[0]?.message || "Invalid input data",
    );
  }
  const { title, description, questions } = parsedQuizData.data;
  const questionsWithIds = questions.map((q) => {
    let questionId = q.questionId ? q.questionId : new Types.ObjectId();
    const optionsWithIds = q.options
      ? q.options.map((option) => {
          let optionId = option.optionId
            ? option.optionId
            : new Types.ObjectId();
          return {
            optionId,
            optionText: option.optionText,
          };
        })
      : q.optionsOnly
        ? q.optionsOnly.map((optionText) => {
            return {
              optionId: new Types.ObjectId(),
              optionText,
            };
          })
        : [];
    return {
      questionId,
      question: q.question,
      options: optionsWithIds,
      correctAnswer:
        optionsWithIds.find(
          (o) =>
            o.optionText.toLowerCase() == q.correctAnswer.toLowerCase() ||
            o.optionId.toString() == q.correctAnswer,
        )?.optionId || null,
      points: q.points,
    };
  });
  const subsection = await SubSection.findByIdAndUpdate(
    subsectionId,
    { title, description },
    { returnDocument: "after" },
  );
  const quiz = await Quiz.findOneAndUpdate(
    { subSectionId: new Types.ObjectId(subsectionId) },
    { title, description, questions: questionsWithIds },
    { returnDocument: "after" },
  );
  if (!quiz) {
    throw AppError.notFound("Quiz not found for the given subsection ID.");
  }
  ApiResponse.success(
    res,
    {
      quiz,
    },
    "Quiz updated successfully",
  );
});
export const attemptQuiz = asyncHandler(async (req, res) => {
  const parsedAttemptData = attemptQuizSchema.safeParse(req.body);
  const userId = new Types.ObjectId(req.userId);
  if (!parsedAttemptData.success) {
    throw AppError.badRequest(
      parsedAttemptData.error.issues[0]?.message || "Invalid input data",
    );
  }
  const { quizId, answers } = parsedAttemptData.data;
  const quiz = await Quiz.findById(new Types.ObjectId(quizId));
  if (!quiz) {
    throw AppError.notFound("Quiz not found for the given quiz ID.");
  }
  if (!(await isEnrolled(userId.toString(), quiz.courseId.toString()))) {
    throw AppError.unauthorized(
      "You are not enrolled in the course for this quiz.",
    );
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
    const isCorrect = question.correctAnswer.toString() === answer.answer;
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
  ApiResponse.success(
    res,
    {
      quizAttempt,
    },
    "Quiz attempt recorded successfully.",
  );
});
export const getQuizAttemptByUser = asyncHandler(async (req, res) => {
  const userId = new Types.ObjectId(req.userId);
  const quizId = req.params.quizId;
  if (!quizId || !userId || typeof quizId !== "string") {
    throw AppError.badRequest("Quiz ID and User ID are required.");
  }
  const quizAttempts = await QuizAttempt.find({ userId, quizId: new Types.ObjectId(quizId) })
    .populate("quizId", "title")
    .sort({ createdAt: -1, score: -1 });
  ApiResponse.success(
    res,
    {
      quizAttempts,
    },
    "Quiz attempts retrieved successfully.",
  );
});
