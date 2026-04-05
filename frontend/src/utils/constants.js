export const ACCOUNT_TYPE = {
  INSTRUCTOR: "instructor",
  STUDENT: "student",
  ADMIN: "admin",
};

export const COURSE_STATUS = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
};

export const LEVEL=["Beginner", "Intermediate", "Advance", "Beginner-to-Advance"];

export const BACKEND_URL=location.hostname==="localhost"?"http://localhost:3000/api/v1":"/api/v1";
//export const BACKEND_URL = "http://localhost:3000/api/v1";

export const tips = [
  'Set the Course Price option or make it free.',
  'Standard size for the course thumbnail is 1024×576.',
  'Video section controls the course overview video.',
  'Course Builder is where you create & organize a course.',
  'Add Topics in the Course Builder section to create lessons, quizzes, and assignments.',
  'Information from the Additional Data section shows up on the course single page.',
  'Make Announcements to notify any important updates.',
  'Notes to all enrolled students at once.',
]