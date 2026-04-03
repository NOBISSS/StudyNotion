import z from "zod";
export declare const videoUploadSchema: z.ZodObject<{
    filename: z.ZodString;
    type: z.ZodString;
    metadata: z.ZodObject<{
        title: z.ZodString;
        courseId: z.ZodString;
        sectionId: z.ZodString;
        isPreview: z.ZodPipe<z.ZodDefault<z.ZodEnum<{
            true: "true";
            false: "false";
        }>>, z.ZodTransform<boolean, "true" | "false">>;
        description: z.ZodOptional<z.ZodString>;
        isEditing: z.ZodPipe<z.ZodDefault<z.ZodEnum<{
            true: "true";
            false: "false";
        }>>, z.ZodTransform<boolean, "true" | "false">>;
        subsectionId: z.ZodOptional<z.ZodString>;
    }, z.z.core.$strip>;
}, z.z.core.$strip>;
//# sourceMappingURL=videoValidation.d.ts.map