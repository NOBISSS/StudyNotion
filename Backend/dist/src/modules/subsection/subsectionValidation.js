import { z } from "zod";
export const updateSubSectionSchema = z.object({
    title: z.string({ error: "Title is required" }).min(1, "Title is required"),
    description: z
        .string({ error: "Description is required" })
        .min(1, "Description is required"),
    isPreview: z.boolean({ error: "Is Preview is required" }),
});
//# sourceMappingURL=subsectionValidation.js.map