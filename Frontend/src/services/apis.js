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
    GET_USER_ENROLLED_COURSE_API:BASE_URL+"/profile/getEnrolledCourses",
    DELETE_ACCOUNT:BASE_URL+"/profile/deleteprofile",
}
export const studentEndpoints={
    COURSE_PAYMENT_API:BASE_URL+"/payment/capturePayment",
    COURSE_VERIFY_API:BASE_URL+"/payment/verifyPayment",
    SEND_PAYMENT_SUCCESS_EMAIL_API:"/password/sendPaymentSuccessEmail"
}

export const courseEndpoints={
    GET_ALL_COURSE_API:BASE_URL+"/course/getAllCourses",
    COURSE_DETAILS_API:BASE_URL+"/course/getCourseDetails",
    EDIT_COURSE_API:BASE_URL+"/course/editCourse",  
    COURSE_CATEGORIES_API:BASE_URL+"/course/showAllCategories",
    CREATE_COURSE_API:BASE_URL+"/course/createCourse",
    CREATE_SECTION_API:BASE_URL+"/course/addSubSection",
    UPDATE_SECTION_API:BASE_URL+"/course/updateSection",
    UPDATE_SUBSECTION_API:BASE_URL+"/course/updateSubSection",
    GET_ALL_INSTRUCTOR_COURSE_API:BASE_URL+"/course/getInstructorCourses",
    DELETE_SECTION_API:BASE_URL+"/course/deleteSection",
    DELETE_SUBSECTION_API:BASE_URL+"/course/deleteSubSection",
    DELETE_COURSE_API:BASE_URL+"/course/deleteCourse",
    GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BASE_URL+"/course/getFullCourseDetails",
    LECTURE_COMPLETION_API:BASE_URL+"/course/updateCourseProgress",
    CREATE_RATING_API:BASE_URL+"/course/createRating",
}


export const ratingsEndpoints={
    REVIEW_DETAILS_API:BASE_URL+"/course/getReviews",
}

export const categories={
    CATEGORIES_API:BASE_URL+"/course/showAllCategories",
}

export const catalogData={
    CATALOGPAGEDATA_API:BASE_URL + "/course/getCategory/PageDetails"
}

export const contactusEndpoint={
    CONTACT_US_API:BASE_URL+"/reach/contact",
}

export const settingsEndPoints={
    UPDATE_DISPLAY_PICTURE_API:BASE_URL+"/profile/updateDisplayPicture",
    UPDATE_PROFILE_API:BASE_URL+"/profile/updateProfile",
    CHANGE_PASSWORD_API:BASE_URL+"/auth/changepassword",
    DELETE_PROFILE_API:BASE_URL+"/profile/deletedProfile"
}