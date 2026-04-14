import { z } from "zod";
export const materialSchema = z.object({
    title: z.string({ error: "Title is required" }).min(1, "Title is required"),
    materialType: z.string({ error: "Material type is required" }).nonempty("Material type is required"),
    mimeType: z.string().optional(),
    description: z.string().optional(),
    materialSize: z.number().optional(),
    materialS3Key: z.string({ error: "Material S3 Key is required" }).min(1, "Material S3 Key is required"),
    URLExpiration: z.date().optional(),
    courseId: z.string({ error: "Course is required" }).min(1, "Course is required"),
    sectionId: z.string({ error: "Section is required" }).min(1, "Section is required"),
});
//# sourceMappingURL=materialValidation.js.map