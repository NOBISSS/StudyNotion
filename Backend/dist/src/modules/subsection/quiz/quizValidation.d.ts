import z from "zod";
export declare const createQuizSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    courseId: z.ZodString;
    sectionId: z.ZodString;
    questions: z.ZodArray<z.ZodObject<{
        question: z.ZodString;
        options: z.ZodArray<z.ZodString>;
        correctAnswer: z.ZodString;
        points: z.ZodNumber;
    }, z.z.core.$strip>>;
}, z.z.core.$strip>;
export declare const updateQuizSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    questions: z.ZodArray<z.ZodObject<{
        questionId: z.ZodOptional<z.ZodString>;
        question: z.ZodString;
        options: z.ZodOptional<z.ZodArray<z.ZodObject<{
            optionId: z.ZodOptional<z.ZodString>;
            optionText: z.ZodString;
        }, z.z.core.$strip>>>;
        optionsOnly: z.ZodOptional<z.ZodArray<z.ZodString>>;
        correctAnswer: z.ZodString;
        points: z.ZodNumber;
    }, z.z.core.$strip>>;
}, z.z.core.$strip>;
export declare const attemptQuizSchema: z.ZodObject<{
    quizId: z.ZodString;
    answers: z.ZodArray<z.ZodObject<{
        questionId: z.ZodString;
        answer: z.ZodString;
    }, z.z.core.$strip>>;
}, z.z.core.$strip>;
//# sourceMappingURL=quizValidation.d.ts.map