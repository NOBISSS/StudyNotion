export const ACCOUNT_TYPE = {
  INSTRUCTOR: "instructor",
  STUDENT: "student",
  ADMIN: "admin",
};

export const COURSE_STATUS = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  SCHEDULED:"Scheduled",
};

export const getImage = (name) =>
  `https://res.cloudinary.com/dc9ukfxel/image/upload/v1774845893/${name}`;

export const LEVEL=["Beginner", "Intermediate", "Advance", "Beginner-to-Advance"];

// let API_URL;
// let GOOGLE_CLIENT_ID;
// let GITHUB_CLIENT_ID;
// let GITHUB_REDIRECT_URI;
// if (location.hostname === "localhost") {
//   API_URL = "http://localhost:3000/api/v1";
//   GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID_DEV;
//   GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID_DEV;
//   GITHUB_REDIRECT_URI = "http://localhost:5000/auth/github";
// } else {
//   GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
//   GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
//   GITHUB_REDIRECT_URI = import.meta.env.VITE_FRONTEND_URL;
//   if (import.meta.env.VITE_BACKEND_URL) {
//     API_URL = import.meta.env.VITE_BACKEND_URL;
//   } else {
//     API_URL = "/api/v1";
//   }
// }
// export const BACKEND_URL = location.hostname=="localhost" ? "http://localhost:3000/api/v1" : "/api/v1" ;

//export const googleClientId = GOOGLE_CLIENT_ID;
//export const githubClientId= GITHUB_CLIENT_ID;
// export const githubRedirectUri=location.hostname=="localhost" ? "http://localhost:3000/auth/github/callback" : "https://study-notion-two-taupe.vercel.app/auth/github/callback";


export const BACKEND_URL=import.meta.env.VITE_BASE_URL;
// export const githubRedirectUri=import.meta.VITE_GITHUB_URL;


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