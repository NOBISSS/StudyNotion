import z from "zod";

export const createCommentSchema = z.object({
    subSectionId: z.string().min(1, "SubSection ID is required"),
    message: z.string().min(1, "Message is required"),
});