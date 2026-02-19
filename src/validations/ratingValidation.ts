import z from "zod";

export const CourseRatingAndReviewSchema = z.object({
  courseId: z.string(),
  rating: z.number().min(1).max(5),
  review: z.string().min(10).max(500),
});