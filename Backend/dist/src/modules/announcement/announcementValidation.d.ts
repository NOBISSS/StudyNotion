import { z } from 'zod';
export declare const announcementValidation: z.ZodObject<{
    title: z.ZodString;
    message: z.ZodString;
    courseId: z.ZodString;
}, z.core.$strip>;
export declare const updateAnnouncementValidation: z.ZodObject<{
    title: z.ZodString;
    message: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=announcementValidation.d.ts.map