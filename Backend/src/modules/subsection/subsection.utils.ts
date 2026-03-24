import { CourseEnrollment } from "../enrollment/CourseEnrollment.js";

export async function isEnrolled(userId: string, courseId: string): Promise<boolean> {
    return await CourseEnrollment.exists({ userId, courseId }) ? true : false;
}