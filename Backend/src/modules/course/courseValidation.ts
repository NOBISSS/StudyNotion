import z from "zod";

export const courseInputSchema = z.object({
  courseName: z
    .string({ error: "Course name is required" })
    .min(3, { error: "Course name must be at least 3 characters long" })
    .max(100, { error: "Course name must be at most 100 characters long" }),
  description: z
    .string({ error: "Description is required" })
    .min(10, { error: "Description must be at least 10 characters long" })
    .max(1000, { error: "Description must be at most 1000 characters long" }),
  categoryId: z.string({ error: "Category ID is required" }),
  typeOfCourse: z.enum(["Free", "Paid"], {
    error: "Type of course must be either Free or Paid",
  }),
  coursePlan: z.string().optional(),
  price: z
    .number({ error: "Price is required" })
    .min(0, { error: "Price cannot be negative" })
    .optional(),
  // thumbnailUrl: z
  //   .url({ error: "Thumbnail URL must be a valid URL" })
  //   .optional(),
  level: z.enum(
    ["Beginner", "Intermediate", "Advance", "Beginner-to-Advance"],
    {
      error:
        "Level must be one of Beginner, Intermediate, Advance, or Beginner-to-Advance",
    }
  ),
  tag: z.array(z.string()).optional(),
});