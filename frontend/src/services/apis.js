import { BACKEND_URL } from "../utils/constants"

export const endPoints={
    SENDOTP_API:BACKEND_URL+"/auth/signup",
    // SIGNUP_API:BACKEND_URL+"/auth/signup",
    SIGNUP_VERIFY_API:BACKEND_URL+"/auth/signup/verify",
    RESEND_OTP_API:BACKEND_URL+"/auth/resendotp",
    FORGOT_PASSWORD_API:BACKEND_URL+"/auth/forgotpassword",
    FORGOT_PASSWORD_VERIFY_API:BACKEND_URL+"/auth/forgotpassword/verify",
    FORGOT_PASSWORD_RESET_PASSWORD_API:BACKEND_URL+"/auth/forgotpassword/reset",
    LOGIN_API:BACKEND_URL+"/auth/login", 
    RESETPASSTOKEN_API:BACKEND_URL+"/auth/reset-password-token",
    RESETPASSWORD_API:BACKEND_URL+"/auth/reset-password",
    LOGOUT_API:BACKEND_URL+"/auth/logout",
    REACTIVATE_ACCOUNT_SEND_OTP_API:BACKEND_URL+"/users/reactivate",
    REACTIVATE_ACCOUNT_VERIFY_API:BACKEND_URL+"/users/reactivate/verify",
    GITHUB_AUTH_API:BACKEND_URL+"/auth/github?code=",
}

export const contactUsEndpoints={
    CONTACT_US_API:BACKEND_URL+"/users/contact",
}

export const profileEndpoints={
    GET_USER_DETAILS_API:BACKEND_URL+"/profile/getuser",
    GET_USER_ENROLLED_COURSE_API:BACKEND_URL+"/enrollments/getmy",
    DELETE_ACCOUNT:BACKEND_URL+"/profile/deleteaccount",
    CHANGE_PASSWORD:BACKEND_URL+"/profile/changepassword",
    //TODO-ADD CLEAR WISHLIST API
}

export const cartEndPoints={
    ADD_WISHLIST_API:BACKEND_URL+"/wishlists/add",
    GET_WISHLIST_API:BACKEND_URL+"/wishlists/get",
    REMOVE_WISHLIST_API:BACKEND_URL+"/wishlists/remove/",
    REMOVE_ALL_WISHLIST_API:BACKEND_URL+"/wishlists/removeall",
}

export const studentEndpoints={
    COURSE_PAYMENT_API:BACKEND_URL+"/payment/capturePayment",
    COURSE_VERIFY_API:BACKEND_URL+"/payment/verifyPayment",
    SEND_PAYMENT_SUCCESS_EMAIL_API:"/password/sendPaymentSuccessEmail",
    PAYMENT_CREATE_ORDER_API: BACKEND_URL + "/payment/create-order",  // ← NEW
   PAYMENT_VERIFY_API:BACKEND_URL + "/payment/verify",         // ← NEW
}

export const courseEndpoints={
    GET_ALL_COURSE_API:BACKEND_URL+"/courses/getall",
    GET_TOP_COURSES_API:BACKEND_URL+"/courses/get-top",
    GET_TOP_COURSES_BY_CATEGORY_API:BACKEND_URL+"/courses/get-top/:categoryId",

    COURSE_DETAILS_API:BACKEND_URL+"/courses/getdetails",
    INSTRUCTOR_COURSE_DETAILS_API:BACKEND_URL+"/courses/getinstructorcourse/:courseId",
    
    COURSE_CATEGORIES_API:BACKEND_URL+"/categories/getall",
    DELETE_COURSE_API:BACKEND_URL+"/courses/delete/:courseId",
    GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BACKEND_URL+"/course/getFullCourseDetails",
    LECTURE_COMPLETION_API:BACKEND_URL+"/course/updateCourseProgress",
    CREATE_RATING_API:BACKEND_URL+"/course/createRating",


    //INSTRUCTUOR
    CREATE_COURSE_API:BACKEND_URL+"/courses/createcourse",//with 
    CREATE_COURSE_MULTER_API:BACKEND_URL+"/courses/create",//with MULTER For Thumbnail
    
    GET_ALL_INSTRUCTOR_COURSE_API:BACKEND_URL+"/courses/instructor/getall",
    EDIT_COURSE_API:BACKEND_URL+"/courses/update/:courseId",  
    PUT_PUBLISH_COURSE_API:BACKEND_URL+"/courses/publish/:courseId",
    PUT_DRAFT_COURSE_API:BACKEND_URL+"/courses/draft/:courseId",

    //SCHEDULE COURSE
    GET_SCHEDULE_COURSE_API:BACKEND_URL+"/courses/scheduled",
    PUT_SCHEDULE_COURSE_API:BACKEND_URL+"/courses/schedule/:courseId",

    // Course Progress API for students
    GET_COURSE_PROGRESS_API:BACKEND_URL+"/courses/getprogress/:courseId",
}

export const sectionEndpoints={
    CREATE_SECTION_API:BACKEND_URL+"/sections/create",
    GET_SECTION_API:BACKEND_URL+"/sections/getall/:courseId",//has to be updated while calling
    EDIT_SECTION_API:BACKEND_URL+"/sections/update/:sectionId",//has to be updated while calling
    DELETE_SECTION_API:BACKEND_URL+"/sections/remove/:sectionId",//has to be updated while calling
    CHANGE_ORDER_SECTION_API:BACKEND_URL+"/sections/changeorder/:sectionId",//has to be updated while calling
    UNDO_DELETION_SECTION_API:BACKEND_URL+"/sections/undolastremoved/:sectionId",//has to be updated while calling
}

//have to check
export const subSectionVideoEndpoints={
    GET_SUBSECTION_API:BACKEND_URL+"/subsections/getall/:sectionId",
    PUT_MARK_SUBSECTION_COMPLETED_API:BACKEND_URL+"/subsections/markcompleted/:subsectionId",
    GET_SUBSECTION_DETAILS_API:BACKEND_URL+"/subsections/video/getone/:subsectionId",
    POST_SAVE_VIDEO_PROGRESS_API:BACKEND_URL+"/subsections/video/saveprogress",
    CREATE_SUBSECTION_API:BACKEND_URL+"/subsections/create",
    EDIT_SUBSECTION_API:BACKEND_URL+"/subsections/update/:subsectionId",
    DELETE_SUBSECTION_API:BACKEND_URL+"/subsections/delete/:subsectionId",
}

export const subSectionMaterialEndpoints={
    CREATE_MATERIAL_API:BACKEND_URL+"/subsections/material/add",
    GET_MATERIAL_API:BACKEND_URL+"/subsections/material/get/:materialId",//has to be updated while calling
    UPDATE_MATERIAL_API:BACKEND_URL+"/subsections/material/update/:subsectionId",
    DELETE_MATERIAL_API:BACKEND_URL+"/subsections/material/delete/:subsectionId",
}

export const subSectionQuizEndpoints={
    CREATE_QUIZ_API:BACKEND_URL+"/subsections/quiz/add",
    GET_QUIZ_API:BACKEND_URL+"/subsections/quiz/get/:subsectionId",//has to be updated while calling
    UPDATE_QUIZ_API:BACKEND_URL+"/subsections/quiz/update/:subsectionId",
    ATTEMP_QUIZ_API:BACKEND_URL+"/subsections/quiz/attempt",

    GET_ATTEMPTED_QUIZ_API:BACKEND_URL+"/subsections/quiz/getattempt/:quizId",

    DELETE_QUIZ_API:BACKEND_URL+"/subsections/quiz/delete/:subsectionId",
}

export const CourseEnrollmentEndPoints={
    ENROLL_COURSE_API:BACKEND_URL+"/enrollments/enroll",
    ENROLL_WISHLIST_COURSE_API:BACKEND_URL+"/enrollments/wishlist/enroll",
    GET_ALL_ENROLLED_COURSES_STUDENT_API:BACKEND_URL+"/enrollments/getmy",//student
    GET_ALL_ENROLLED_COURSES_ADMIN_API:BACKEND_URL+"/enrollments/getall",//admin
    //UPDATE_PROGRESS_API:BACKEND_URL+"/enrollments/updateProgress",
}

export const SignatureEndpoints={
    POST_SIGNATURE_CLOUDINARY_API:BACKEND_URL+"/signatures/cloudinary",
    POST_SIGNATURE_S3_API:BACKEND_URL+"/signatures/s3",
}

//ahiya thi baakie
export const ratingsEndpoints={
    REVIEW_DETAILS_API:BACKEND_URL+"/course/getReviews",
}

export const categories={
    CATEGORIES_API:BACKEND_URL+"/categories/getall",
}

export const catalogEndPoints={
    CATALOGPAGEDATA_API:BACKEND_URL + "/categories/pagedetails/"
}

export const contactusEndpoint={
    CONTACT_US_API:BACKEND_URL+"/reach/contact",
}

export const settingsEndPoints = {
  UPDATE_DISPLAY_PICTURE_API: BACKEND_URL + "/users/changeprofilephoto",
  UPDATE_PROFILE_API: BACKEND_URL + "/users/updateProfile",
  CHANGE_PASSWORD_API: BACKEND_URL + "/profile/changepassword",
  DELETE_PROFILE_API: BACKEND_URL + "/profile/deleteaccount",
};

export const dashboardEndpoints = {
  INSTRUCTOR_DASHBOARD_API: BACKEND_URL + "/dashboards/instructor",
  STUDENT_DASHBOARD_API: BACKEND_URL + "/dashboards/student",
}