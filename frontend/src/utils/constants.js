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
