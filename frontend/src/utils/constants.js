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

let API_URL;
if (location.hostname === "localhost") {
  API_URL = "http://localhost:3000/api/v1";
} else {
  if (import.meta.env.VITE_BACKEND_URL) {
    API_URL = import.meta.env.VITE_BACKEND_URL;
  } else {
    API_URL = "https://apistudynotion.mohammedarafat.me/api/v1";
  }
}
export const BACKEND_URL = API_URL;
// export const BACKEND_URL=location.hostname==="localhost"?"http://localhost:3000/api/v1":"/api/v1";
//export const BACKEND_URL = "http://localhost:3000/api/v1";
