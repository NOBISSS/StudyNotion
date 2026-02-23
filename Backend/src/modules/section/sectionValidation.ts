import z from "zod";

export const createSectionSchema = z.object({
  name: z
    .string({ error: "Section name is required" })
    .min(1, "Section name is required"),
  courseId: z.string(),
  order: z.number().min(0, "Order must be a non-negative number"),
});