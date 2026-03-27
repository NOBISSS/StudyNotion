import z from "zod";
export const CourseRatingAndReviewSchema = z.object({
    courseId: z.string({ error: "Course ID is required" }),
    rating: z.number({ error: "Rating is required" }).min(1).max(5),
    review: z.string({ error: "Review is required" }).min(10).max(500),
});
//# sourceMappingURL=ratingValidation.js.map