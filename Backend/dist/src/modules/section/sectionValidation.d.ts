import z from "zod";
export declare const createSectionSchema: z.ZodObject<{
    sectionName: z.ZodString;
    courseId: z.ZodString;
    order: z.ZodOptional<z.ZodNumber>;
}, z.z.core.$strip>;
//# sourceMappingURL=sectionValidation.d.ts.map