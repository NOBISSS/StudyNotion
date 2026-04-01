// pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { LuTimerReset } from "react-icons/lu";
import { PiArrowLeftBold } from "react-icons/pi";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  forgotpasswordOTPVerification,
  reactivateAccountOTPVerification,
  resendOtp,
  signUp,
} from "../services/operations/authAPI";

const VerifyEmail = () => {
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signupData, loading } = useSelector((state) => state.auth);

  // Guard: redirect if no signup data
  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      otpPurpose = "signup",
    } = signupData;
    if (otpPurpose == "forgotPassword") {
      dispatch(forgotpasswordOTPVerification(otp, navigate));
      return;
    }else if(otpPurpose === "reactivate"){
      dispatch(reactivateAccountOTPVerification(otp, navigate));
      return;
    }
    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate,
      ),
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000814] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FFD60A] border-t-transparent" />
          <p className="text-[#AFB2BF] text-sm">Verifying...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000814] flex items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        {/* Title */}
        <h1 className="text-white text-3xl font-semibold mb-3">Verify email</h1>

        {/* Subtitle */}
        <p className="text-[#AFB2BF] text-sm leading-relaxed mb-8">
          A verification code has been sent to you. Enter the code below
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* OTP Inputs */}
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={
              <span className="text-[#AFB2BF] text-lg font-light px-0.5">
                -
              </span>
            }
            renderInput={(props) => (
              <input
                {...props}
                className={`
                  !w-[52px] !h-[52px] rounded-lg text-white text-lg font-semibold text-center
                  bg-[#161D29] border transition-all duration-200 outline-none
                  ${
                    props.value
                      ? "border-[#FFD60A]"
                      : "border-[#2C333F] focus:border-[#FFD60A]"
                  }
                `}
              />
            )}
            containerStyle="flex items-center gap-1.5 justify-between w-full"
          />

          {/* Verify Button */}
          <button
            type="submit"
            disabled={otp.length !== 6 || loading}
            className="w-full bg-[#FFD60A] hover:bg-[#FFC800] active:scale-[0.98] text-black font-semibold text-sm py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Verify email
          </button>
        </form>

        {/* Bottom row: Back to login + Resend */}
        <div className="flex items-center justify-between mt-6">
          <Link
            to="/login"
            className="flex items-center gap-2 text-sm text-[#AFB2BF] hover:text-white transition-colors duration-200"
          >
            <PiArrowLeftBold className="text-base" />
            <span>Back to login</span>
          </Link>

          <button
            onClick={() =>
              dispatch(resendOtp({ email: signupData?.email }, navigate))
            }
            className="flex items-center gap-1.5 text-sm text-[#60A5FA] hover:text-[#93C5FD] transition-colors duration-200"
          >
            <LuTimerReset className="text-base" />
            <span>Resend it</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
