const BASE_URL = "/api";
export const endpoints = {
  auth: {
    signup: {
      base: `${BASE_URL}/auth/signup`,
      verify: `${BASE_URL}/auth/signup/verify`,
      description:
        "Register a new user and send OTP to email, then verify OTP to complete registration",
      method: "POST",
    },
    signin: {
      base: `${BASE_URL}/auth/login`,
      // verify: `${BASE_URL}/auth/loginwithemail/verify`,
      description: "Login with email and password",
      method: "POST",
    },
    // loginwithpassword: {
    //   base: `${BASE_URL}/auth/loginwithpassword`,
    //   description: "Login with email and password",
    // },
    forgotpassword: {
      base: `${BASE_URL}/auth/forgotpassword`,
      verify: `${BASE_URL}/auth/forgotpassword/verify`,
      // reset: `${BASE_URL}/auth/forgotpassword/reset`,
      description:
        "Forgot password and send OTP to email to reset password, then verify OTP to complete password reset",
      method: "POST",
    },
    resendOTP: {
      base: `${BASE_URL}/auth/resendotp`,
      description: "Resend OTP for registration or forgot password",
      method: "POST",
    },
    refreshToken: {
      base: `${BASE_URL}/auth/refreshtoken`,
      description: "Refresh access token using refresh token",
      method: "POST",
    },
    logout: {
      base: `${BASE_URL}/auth/logout`,
      description: "Logout user and clear tokens",
      method: "POST",
    },
    me: {
      base: `${BASE_URL}/auth/getuser`,
      description: "Get current logged in user profile",
      method: "GET",
    },
    changepassword: {
      base: `${BASE_URL}/auth/changepassword`,
      description: "Change password for logged in user",
      method: "PUT",
    },
    deleteAccount: {
      base: `${BASE_URL}/auth/deleteaccount`,
      description: "Delete user account permanently",
      method: "DELETE",
    },
  },
};
