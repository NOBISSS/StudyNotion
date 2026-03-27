import { CourseEnrollment } from "../enrollment/CourseEnrollment.js";
export async function isEnrolled(userId, courseId) {
    return await CourseEnrollment.exists({ userId, courseId }) ? true : false;
}
//# sourceMappingURL=subsection.utils.js.map