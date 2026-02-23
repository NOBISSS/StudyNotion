import { z } from "zod";

export const materialSchema = z.object({
  title: z.string().min(1, "Title is required"),
  // contentUrl: z
  //   .url("Content URL must be a valid URL")
  //   .min(1, "Content URL is required"),
  materialType: z.string().nonempty("Material type is required"),
  description: z.string().optional(),
  materialSize: z.number().optional(),
  materialS3Key: z.string().min(1, "Material S3 Key is required"),
  URLExpiration: z.date().optional(),
  courseId: z.string().min(1, "Course is required"),
  sectionId: z.string().min(1, "Section is required"),
});
