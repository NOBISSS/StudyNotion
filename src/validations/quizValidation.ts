import z from "zod";

export const createQuizSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  courseId: z.string().min(1, "Course ID is required"),
  sectionId: z.string().min(1, "Section ID is required"),
  questions: z
    .array(
      z.object({
        question: z.string().min(1, "Question is required"),
        options: z
          .array(z.string().min(1, "Option cannot be empty"))
          .min(2, "At least two options are required"),
        correctAnswer: z.string().min(1, "Correct answer is required"),
        points: z.number().min(1, "Points must be at least 1"),
      }),
    )
    .min(1, "At least one question is required"),
});
export const updateQuizSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  questions: z
    .array(
      z.object({
        questionId: z.string().optional(),
        question: z.string().min(1, "Question is required"),
        options: z
          .array(z.object({
            optionId: z.string().optional(),
            optionText: z.string().min(1, "Option cannot be empty"),
          }))
          .min(2, "At least two options are required"),
        correctAnswer: z.string().min(1, "Correct answer is required"),
        points: z.number().min(1, "Points must be at least 1"),
      }),
    )
    .min(1, "At least one question is required"),
});
export const attemptQuizSchema = z.object({
  quizId: z.string().min(1, "Quiz ID is required"),
  answers: z.array(
    z.object({
      questionId: z.string().min(1, "Question ID is required"),
      answer: z.string().min(1, "Answer is required"),
    }),
  ),
});