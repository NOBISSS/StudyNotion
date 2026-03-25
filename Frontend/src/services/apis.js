const BASE_URL=import.meta.env.VITE_BASE_URL;

export const endPoints={
    SENDOTP_API:BASE_URL+"/auth/sendotp",
    SIGNUP_API:BASE_URL+"/auth/signup",
    SIGNUP_VERIFY_API:BASE_URL+"/auth/signup/verify",
    RESEND_OTP_API:BASE_URL+"/auth/resendotp",
    FORGOT_PASSWORD_API:BASE_URL+"/auth/forgotpassword",
    FORGOT_PASSWORD_VERIFY_API:BASE_URL+"/auth/forgotpassword/verify",
    LOGIN_API:BASE_URL+"/auth/login", 
    RESETPASSTOKEN_API:BASE_URL+"/auth/reset-password-token",
    RESETPASSWORD_API:BASE_URL+"/auth/reset-password",
    LOGOUT_API:BASE_URL+"/auth/logout",
}

export const profileEndpoints={
    GET_USER_DETAILS_API:BASE_URL+"/profile/getuser",
    GET_USER_ENROLLED_COURSE_API:BASE_URL+"/enrollments/getmy",
    DELETE_ACCOUNT:BASE_URL+"/profile/deleteaccount",
    CHANGE_PASSWORD:BASE_URL+"/profile/changepassword",
    //TODO-ADD CLEAR WISHLIST API
}

export const cartEndPoints={
    ADD_WISHLIST_API:BASE_URL+"/wishlists/add",
    GET_WISHLIST_API:BASE_URL+"/wishlists/get",
    REMOVE_WISHLIST_API:BASE_URL+"/wishlists/remove/",
    REMOVE_ALL_WISHLIST_API:BASE_URL+"/wishlists/removeall",
}

export const studentEndpoints={
    COURSE_PAYMENT_API:BASE_URL+"/payment/capturePayment",
    COURSE_VERIFY_API:BASE_URL+"/payment/verifyPayment",
    SEND_PAYMENT_SUCCESS_EMAIL_API:"/password/sendPaymentSuccessEmail"
}

export const courseEndpoints={
    CREATE_COURSE_API:BASE_URL+"/courses/create",//with url
    GET_ALL_COURSE_API:BASE_URL+"/courses/getall",
    GET_TOP_COURSES_API:BASE_URL+"/courses/get-top",
    GET_TOP_COURSES_BY_CATEGORY_API:BASE_URL+"/courses/get-top/:categoryId",

    COURSE_DETAILS_API:BASE_URL+"/courses/getCourseDetails",
    EDIT_COURSE_API:BASE_URL+"/courses/editCourse",  
    COURSE_CATEGORIES_API:BASE_URL+"/courses/showAllCategories",
    DELETE_COURSE_API:BASE_URL+"/course/deleteCourse",
    GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BASE_URL+"/course/getFullCourseDetails",
    LECTURE_COMPLETION_API:BASE_URL+"/course/updateCourseProgress",
    CREATE_RATING_API:BASE_URL+"/course/createRating",

}

export const sectionEndpoints={
    CREATE_SECTION_API:BASE_URL+"/sections/create",
    GET_SECTION_API:BASE_URL+"/sections/getall/:courseId",//has to be updated while calling
    EDIT_SECTION_API:BASE_URL+"/sections/update/:sectionId",//has to be updated while calling
    DELETE_SECTION_API:BASE_URL+"/sections/remove/:sectionId",//has to be updated while calling
    CHANGE_ORDER_SECTION_API:BASE_URL+"/sections/changeorder/:sectionId",//has to be updated while calling
    UNDO_DELETION_SECTION_API:BASE_URL+"/sections/undolastremoved/:sectionId",//has to be updated while calling
}

//have to check
export const subSectionVideoEndpoints={
    GET_SUBSECTION_API:BASE_URL+"/subsections/getall/:sectionId",//has to be updated while calling
    CREATE_SUBSECTION_API:BASE_URL+"/subsections/create",
    EDIT_SUBSECTION_API:BASE_URL+"/subsections/edit",
    DELETE_SUBSECTION_API:BASE_URL+"/subsections/delete",
}

export const subSectionMaterialEndpoints={
    CREATE_MATERIAL_API:BASE_URL+"/subsections/material/add",
    GET_MATERIAL_API:BASE_URL+"/subsections/material/get/:materialId",//has to be updated while calling
    UPDATE_MATERIAL_API:BASE_URL+"/subsections/material/update/:subsectionId",
    DELETE_MATERIAL_API:BASE_URL+"/subsections/material/delete/:subsectionId",
}

export const subSectionQuizEndpoints={
    CREATE_QUIZ_API:BASE_URL+"/subsections/quiz/add",
    GET_QUIZ_API:BASE_URL+"/subsections/quiz/get/:subsectionId",//has to be updated while calling
    UPDATE_QUIZ_API:BASE_URL+"/subsections/quiz/update/:subsectionId",
    ATTEMP_QUIZ_API:BASE_URL+"/subsections/quiz/attempt",

    GET_ATTEMPTED_QUIZ_API:BASE_URL+"/subsections/quiz/getattempt/:quizId",

    DELETE_QUIZ_API:BASE_URL+"/subsections/quiz/delete/:subsectionId",
}

export const CourseEnrollmentEndPoints={
    ENROLL_COURSE_API:BASE_URL+"/enrollments/enroll",//for student
    GET_ALL_ENROLLED_COURSES_STUDENT_API:BASE_URL+"/enrollments/getmy",//student
    GET_ALL_ENROLLED_COURSES_ADMIN_API:BASE_URL+"/enrollments/getall",//admin
    //UPDATE_PROGRESS_API:BASE_URL+"/enrollments/updateProgress",
}

export const SignatureEndpoints={
    POST_SIGNATURE_CLOUDINARY_API:BASE_URL+"/signatures/cloudinary",
    POST_SIGNATURE_S3_API:BASE_URL+"/signatures/s3",
}

//ahiya thi baakie
export const ratingsEndpoints={
    REVIEW_DETAILS_API:BASE_URL+"/course/getReviews",
}

export const categories={
    CATEGORIES_API:BASE_URL+"/categories/getall",
}

export const catalogEndPoints={
    CATALOGPAGEDATA_API:BASE_URL + "/categories/pagedetails/"
}

export const contactusEndpoint={
    CONTACT_US_API:BASE_URL+"/reach/contact",
}

export const settingsEndPoints={
    UPDATE_DISPLAY_PICTURE_API:BASE_URL+"/profile/updateDisplayPicture",
    UPDATE_PROFILE_API:BASE_URL+"/users/updateProfile",
    CHANGE_PASSWORD_API:BASE_URL+"/auth/changepassword",
    DELETE_PROFILE_API:BASE_URL+"/profile/deletedProfile"
}