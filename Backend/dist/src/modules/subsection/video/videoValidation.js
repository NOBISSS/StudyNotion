import z from "zod";
export const videoUploadSchema = z.object({
    filename: z
        .string({ error: "Filename is required" })
        .min(1, "Filename is required"),
    type: z
        .string({ error: "Content type is required" })
        .min(1, "Content type is required"),
    metadata: z.object({
        title: z.string({ error: "Title is required" }).min(1, "Title is required"),
        courseId: z
            .string({ error: "Course ID is required" })
            .min(1, "Course ID is required"),
        sectionId: z
            .string({ error: "Section ID is required" })
            .min(1, "Section ID is required"),
        isPreview: z
            .enum(["true", "false"], { error: "isPreview must be a boolean value" })
            .default("false")
            .transform((val) => val === "true"),
        description: z.string().optional(),
    }),
});
//# sourceMappingURL=videoValidation.js.map