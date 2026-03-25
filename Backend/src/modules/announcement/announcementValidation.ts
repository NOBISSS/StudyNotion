import {z} from 'zod';

export const announcementValidation = z.object({
  title: z.string({error: "Title is required"}).min(1, "Title is required"),
  message: z.string({error: "Message is required"}).min(1, "Message is required"),
  courseId: z.string({error: "Course ID is required"}).min(1, "Course ID is required"),
});