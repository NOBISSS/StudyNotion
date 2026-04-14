import { z } from "zod";
export declare const materialSchema: z.ZodObject<{
    title: z.ZodString;
    materialType: z.ZodString;
    mimeType: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    materialSize: z.ZodOptional<z.ZodNumber>;
    materialS3Key: z.ZodString;
    URLExpiration: z.ZodOptional<z.ZodDate>;
    courseId: z.ZodString;
    sectionId: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=materialValidation.d.ts.map