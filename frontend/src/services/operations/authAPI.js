import toast from "react-hot-toast";
import {
  setLoading,
  setOTPVerified,
  setSignUpData,
  setToken,
} from "../../slices/authSlice";
import { apiConnector } from "../apiconnector";
//import {resetCart} from '../../slices/cartSlice';
import axios from "axios";
import { resetCart } from "../../slices/cartSlice";
import { setProfilePicture, setUser } from "../../slices/profileSlice";
import { BACKEND_URL } from "../../utils/constants";
import { endPoints, settingsEndPoints } from "../apis";

const {
  SENDOTP_API,
  SIGNUP_VERIFY_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
  RESEND_OTP_API,
  FORGOT_PASSWORD_API,
  FORGOT_PASSWORD_VERIFY_API,
  FORGOT_PASSWORD_RESET_PASSWORD_API,
  REACTIVATE_ACCOUNT_SEND_OTP_API,
  REACTIVATE_ACCOUNT_VERIFY_API,
} = endPoints;

const {
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  UPDATE_DISPLAY_PICTURE_API,
  DELETE_PROFILE_API,
} = settingsEndPoints;

export function sendOtp(formData, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading..");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SENDOTP_API, formData);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent Successfully");
      navigate("/verifyemail");
    } catch (error) {
      console.log("SENDOTP API ERROR............", error);
      toast.error(error.response.data.message || "Could Not Send OTP");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function resendOtp(formData, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading..");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESEND_OTP_API, formData);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent Successfully");
      navigate("/verifyemail");
    } catch (error) {
      console.log("RESEND OTP API ERROR............", error);
      toast.error(error.response.data.message || "Could Not Send OTP");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate,
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNUP_VERIFY_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });

      if (response.status != 201) {
        throw new Error(response.data.message);
      }
      toast.success("Signup Succssful");
      navigate("/login");
    } catch (error) {
      console.log("SIGNUP API ERROR.......", error);
      toast.error("Signup Failed");
      navigate("/signup");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function UpdatePersonalInfo(formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading");
    dispatch(setLoading(true));

    try {
      //console.log({ ...formData });
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, {
        ...formData,
      });
      //console.log("PROFILE UPDATE API RESPONSE........", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("PROFILE UPDATED SUCCESSFULLY");
      dispatch(setUser({ ...response.data.data.user }));
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      // dispatch(updateUserState(response.data.user));
      // dispatch(setUser({...response.data.user}))
      // localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      console.log("ERROR OCCURED WHILE UPDATING PROFILE");
      console.log("ERROR :", error);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });
      // console.log("LOGIN API RESPONSE........", response);
      // console.log("FALSE SUCCESS MESSAGE:", response.data.message);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Login Successful");
      dispatch(setToken(response.data.data.accessToken));
      const userImage = response.data?.data?.user?.additionalDetails
        .profilePicture
        ? response.data.data.user.additionalDetails.profilePicture
        : `https://api.dicebear.com/5.x/initals/svg?seed=${response.data.data.user?.firstName} ${response.data.data.user?.lastName}`;
      dispatch(setUser({ ...response.data.data.user, image: userImage }));
      localStorage.setItem(
        "accessToken",
        JSON.stringify(response.data.data.accessToken),
      );
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      navigate("/dashboard/my-profile");
    } catch (error) {
      console.log("Login API ERROR...........", error);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCart());
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    toast.success("Logged Out Successfully");
    navigate("/");
  };
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });
      // console.log("GET PASSWORD RESET TOKEN....", response);
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("RESET EMAIL SENT");
      setEmailSent(true);
    } catch (error) {
      console.log("RESET PASSWORD TOKEN ERROR...", error);
      toast.error("Failed to send email for resetting password");
    }
    dispatch(setLoading(false));
  };
}
export function forgotpasswordSendOTP(email, setEmailSent, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", FORGOT_PASSWORD_API, {
        email,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("RESET EMAIL SENT");
      setEmailSent(true);
      dispatch(setSignUpData({ email, otpPurpose: "forgotPassword" }));
      navigate("/forgotpassword/verify", { state: { email } });
    } catch (error) {
      console.log("RESET PASSWORD TOKEN ERROR...", error);
      toast.error("Failed to send email for resetting password");
    }
    dispatch(setLoading(false));
  };
}
export function forgotpasswordOTPVerification(otp, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", FORGOT_PASSWORD_VERIFY_API, {
        otp: Number(otp),
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("OTP Verified Successfully");
      dispatch(setOTPVerified(true));
      navigate("/resetpassword");
    } catch (error) {
      console.log("RESET PASSWORD TOKEN ERROR...", error);
      toast.error("Failed to verify OTP");
    }
    dispatch(setLoading(false));
  };
}
export function forgotpasswordResetPassword(navigate, data) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        FORGOT_PASSWORD_RESET_PASSWORD_API,
        { ...data },
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      console.log("RESET PASSWORD TOKEN ERROR...", error);
      toast.error("Failed to reset password");
    }
    dispatch(setLoading(false));
  };
}

export function ResetPassword(password, confirmPassword, token) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });
      // console.log("RESET PASSWORD RESPONSE...", response);
      if (!response.data.success) {
        toast.error("FAILED TO RESET PASSWORD");
        throw new Error(response.data.message);
      }
      toast.success("PASSWORD IS RESETTED SUCCESSFULLY");
    } catch (error) {
      console.log("RESET PASSWORD ERROR OCCURRED....", error);
    }
    dispatch(setLoading(false));
  };
}

export function UpdatePassword(password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating Password");
    console.log(password);
    try {
      const response = await apiConnector("PUT", CHANGE_PASSWORD_API, password);
      if (!response.data.success) throw new Error(response.data.message);
      toast.success("Password Updated Successfully");
      navigate("/login");
    } catch (error) {
      console.log("ERROR OCCURED WHILE UPDATING PASSWORD::", error);
      toast.error(error.message || "Failed to Update Password");
    } finally {
      toast.dismiss(toastId);
    }
  };
}

export function updateProfilePicture(displayPicture) {
  return async (dispatch) => {
    // console.log(displayPicture);
    const formData = new FormData();
    formData.append("profilephoto", displayPicture);
    // console.log("FORM DATA :", formData);
    const toastId = toast.loading("UPLOADING PROFILE PICTURE");
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
      );
      // console.log(response);
      if (!response.data.success) throw new Error(response.data.message);
      dispatch(
        setProfilePicture(
          response.data.data.user.additionalDetails.profilePicture,
        ),
      );
      localStorage.setItem("user", JSON.stringify(response.data.data.user));
      toast.success("PROFILE PHOTO UPDATED SUCCESSFULLY");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to Update Password");
    } finally {
      toast.dismiss(toastId);
    }
  };
}

export function deleteAccount(navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("DELETING YOUR ACCOUNT");

    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API);
      // console.log(response);
      if (!response.data.success) throw new Error(response.data.message);
      dispatch(logout());
      dispatch(setUser(null));
      navigate("/");
      toast.success("YOUR ACCOUNT IS DELETED SUCCSSFULLY");
    } catch (error) {
      console.log("ERROR OCCURED WHILE DELETING PROFILE>>>>>>", error);
      toast.error(error.response.data.message || "REFRESH THE PAGE");
    } finally {
      toast.dismiss(toastId);
    }
  };
}

export const googleAuth = (code) =>
  axios.get(`${BACKEND_URL}/auth/google?code=${code}`, {
    withCredentials: true,
  });

export function reactivateAccountSendOTP(email, setEmailSent, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        REACTIVATE_ACCOUNT_SEND_OTP_API,
        {
          email,
        },
      );
      if (!response.response.data.success) {
        throw new Error(response.response.data.message);
      }
      toast.success("REACTIVATION EMAIL SENT");
      setEmailSent(true);
      dispatch(setSignUpData({ email, otpPurpose: "reactivate" }));
      navigate("/reactivate-account/verify", { state: { email } });
    } catch (error) {
      toast.error(
        error.response.data.message ||
        "Failed to send email for reactivating account",
      );
    }
    dispatch(setLoading(false));
  };
}
export function reactivateAccountOTPVerification(otp, navigate) {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const response = await apiConnector(
        "POST",
        REACTIVATE_ACCOUNT_VERIFY_API,
        {
          otp: Number(otp),
        },
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Account Reactivated Successfully");
      dispatch(setOTPVerified(true));
      navigate("/login");
    } catch (error) {
      console.log("REACTIVATION TOKEN ERROR...", error);
      toast.error("Failed to verify OTP");
    }
    dispatch(setLoading(false));
  };
}
