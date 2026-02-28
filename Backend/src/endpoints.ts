const BASE_URL = "/api";
export const endpoints = {
  auth: {
    signup: {
      base: `${BASE_URL}/auth/signup`,
      verify: `${BASE_URL}/auth/signup/verify`,
      description:
        "Register a new user and send OTP to email, then verify OTP to complete registration",
    },
    signin: {
      base: `${BASE_URL}/auth/login`,
      // verify: `${BASE_URL}/auth/loginwithemail/verify`,
      description: "Login with email and password",
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
    },
    resendOTP: {
      base: `${BASE_URL}/auth/resendotp`,
      description: "Resend OTP for registration or forgot password",
    },
    refreshToken: {
      base: `${BASE_URL}/auth/refreshtoken`,
      description: "Refresh access token using refresh token",
    },
    logout: {
      base: `${BASE_URL}/auth/logout`,
      description: "Logout user and clear tokens",
    },
    me: {
      base: `${BASE_URL}/auth/getuser`,
      description: "Get current logged in user profile",
    },
    changepassword: {
      base: `${BASE_URL}/auth/changepassword`,
      description: "Change password for logged in user",
    },
    deleteAccount: {
      base: `${BASE_URL}/auth/deleteaccount`,
      description: "Delete user account permanently",
    },
  },
};
