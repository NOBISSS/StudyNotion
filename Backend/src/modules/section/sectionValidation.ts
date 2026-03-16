import z from "zod";

export const createSectionSchema = z.object({
  name: z
    .string({ error: "Section name is required" })
    .min(1, "Section name is required"),
  courseId: z.string({ error: "Course ID is required" }),
  order: z.number({ error: "Order is required" }).min(0, "Order must be a non-negative number"),
});