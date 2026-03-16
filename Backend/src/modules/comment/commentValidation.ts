import z from "zod";

export const createCommentSchema = z.object({
    subSectionId: z.string({ error: "SubSection ID is required" }).min(1, "SubSection ID is required"),
    message: z.string({ error: "Message is required" }).min(1, "Message is required"),
});