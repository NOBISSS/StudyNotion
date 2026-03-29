import z from "zod";
export declare const courseInputSchema: z.ZodObject<{
    courseName: z.ZodString;
    courseDescription: z.ZodString;
    category: z.ZodString;
    coursePlan: z.ZodOptional<z.ZodString>;
    price: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    thumbnailImage: z.ZodOptional<z.ZodURL>;
    level: z.ZodEnum<{
        Beginner: "Beginner";
        Intermediate: "Intermediate";
        Advance: "Advance";
        "Beginner-to-Advance": "Beginner-to-Advance";
    }>;
    whatYouWillLearn: z.ZodOptional<z.ZodString>;
    tag: z.ZodOptional<z.ZodArray<z.ZodString>>;
    instructorId: z.ZodOptional<z.ZodString>;
    instructions: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.z.core.$strip>;
//# sourceMappingURL=courseValidation.d.ts.map