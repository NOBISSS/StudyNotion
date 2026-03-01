import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Types } from "mongoose";
import { z } from "zod";
import {
  accessTokenCookieOptions,
  logoutCookieOptions,
  OTPDatacookieOptions,
  refreshTokenCookieOptions,
} from "../../shared/constants.js";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { emailQueue } from "../../shared/queue/emailQueue.js";
import { StatusCode } from "../../shared/types.js";
import {
  canResendOTP,
  generateOTP,
  getOTPData,
  saveOTP,
  verifyOTP,
} from "../../shared/utils/otp.service.js";
import { Profile } from "../user/ProfileModel.js";
import User, { type UserDocument } from "../user/UserModel.js";
import {
  changePasswordInputSchema,
  forgetInputSchema,
  signinInputSchema,
  signupInputSchema,
} from "./authValidation.js";

export const signupWithOTP = asyncHandler(async (req, res) => {
  const userInput = signupInputSchema.safeParse(req.body);
  if (!userInput.success) {
    throw AppError.badRequest(
      userInput.error.issues?.[0]?.message || "User data required",
    );
  }
  const { email, password, firstName, lastName, accountType } = userInput.data;
  const lowerCaseEmail = email.toLowerCase();
  const userExists = await User.findOne({ email: lowerCaseEmail });
  if (userExists) {
    throw AppError.conflict("User already exists with this username or email");
  }

  const otp = generateOTP();
  await saveOTP({
    email: lowerCaseEmail,
    otp,
    data: {
      password: await bcrypt.hash(password, 10),
      firstName,
      lastName,
      accountType,
      otpType: "registration",
    },
  });

  await emailQueue.add("send-otp", { email: lowerCaseEmail, otp });
  return ApiResponse.success<{ email: string }>(
    res,
    { email: lowerCaseEmail },
    "OTP sent successfully",
    StatusCode.Success,
    [
      {
        name: "otp_data",
        value: JSON.stringify({ email: lowerCaseEmail, type: "signup" }),
        options: OTPDatacookieOptions,
      },
    ],
  );
});
export const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.cookies.otp_data;
  if (!email) {
    throw AppError.badRequest("Invalid Request");
  }

  const canResend = await canResendOTP(email);
  if (!canResend) {
    throw AppError.rateLimited(
      "OTP resend limit reached. Please try again later.",
    );
  }

  const otp = generateOTP();
  const otpData = await getOTPData(email);
  if (!otpData) {
    throw AppError.notFound("Invalid OTP request");
  }
  await saveOTP({
    email,
    otp,
    data: {
      password: await bcrypt.hash(otpData.password || "", 10),
      firstName: otpData.firstName,
      lastName: otpData.lastName,
      accountType: otpData.accountType,
      otpType: otpData.otpType,
    },
  });

  await emailQueue.add("send-otp", { email, otp });
  return ApiResponse.success<{ email: string }>(
    res,
    { email },
    "OTP resent successfully",
    StatusCode.Success,
    [
      {
        name: "otp_data",
        value: JSON.stringify({
          email,
          type: otpData.otpType === "registration" ? "signup" : "forget",
        }),
        options: OTPDatacookieOptions,
      },
    ],
  );
});
export const signupOTPVerification = asyncHandler(async (req, res) => {
  const otpDataCookie = req.cookies.otp_data;
  if (!otpDataCookie || !otpDataCookie.email || !otpDataCookie.type) {
    throw AppError.badRequest("Invalid Request");
  }
  const { email, type } = req.cookies.otp_data;
  const { otp } = req.body;
  if (!otp) {
    throw AppError.badRequest("OTP is required");
  }

  const otpData = await verifyOTP({
    email,
    userOtp: otp,
    otpType: "registration",
  });

  if (!otpData || otpData.otpType !== "registration" || type !== "signup") {
    throw AppError.forbidden("Invalid or Expired OTP");
  }

  const user = await User.create({
    email,
    password: otpData.password as string,
    firstName: otpData.firstName as string,
    lastName: otpData.lastName as string,
    accountType: otpData.accountType as "admin" | "instructor" | "student",
  });

  const { accessToken, refreshToken } = user.generateAccessAndRefreshToken();
  await user.updateOne({ refreshToken });

  return ApiResponse.created(
    res,
    {
      user: {
        ...user.toObject(),
        refreshToken: undefined,
        password: undefined,
      },
      accessToken,
      refreshToken,
    },
    "Signup successful",
    [
      {
        name: "accessToken",
        value: accessToken,
        options: accessTokenCookieOptions,
      },
      {
        name: "refreshToken",
        value: refreshToken,
        options: refreshTokenCookieOptions,
      },
    ],
  );
});
export const signin = asyncHandler(async (req, res) => {
  const userInput = signinInputSchema.safeParse(req.body);
  if (!userInput.success) {
    throw AppError.badRequest(
      userInput.error.issues?.[0]?.message || "Email and password are required",
    );
  }
  const { email, password } = userInput.data;
  const user = await User.findOne({ email });
  if (!user) {
    throw AppError.notFound("User not found with this email");
  }
  if (user.isBanned) {
    throw AppError.unauthorized("User is banned, Contact support");
  }
  if (user.isDeleted) {
    throw AppError.unauthorized("User is deleted, Contact support");
  }
  const isPasswordCorrect = user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw AppError.badRequest("Invalid password");
  }
  const { accessToken, refreshToken } = user.generateAccessAndRefreshToken();
  return ApiResponse.success(
    res,
    {
      user: {
        ...user.toObject(),
        refreshToken: undefined,
        password: undefined,
      },
      accessToken,
      refreshToken,
    },
    "Signin successful",
    StatusCode.Success,
    [
      {
        name: "accessToken",
        value: accessToken,
        options: accessTokenCookieOptions,
      },
      {
        name: "refreshToken",
        value: refreshToken,
        options: refreshTokenCookieOptions,
      },
    ],
  );
});
export const getUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.userId;
    const user = req.user;
    if (!user) {
      throw AppError.notFound("User not found");
    }
    const userProfile = await Profile.findOne({
      userId: userId as Types.ObjectId,
    });
    return ApiResponse.success(
      res,
      { user, profile: userProfile },
      "User fetched successfully",
    );
  } catch (err: any) {
    res
      .status(StatusCode.ServerError)
      .json({ message: err.message || "Something went wrong from ourside" });
  }
});
export const refreshTokens = asyncHandler(async (req, res) => {
  const IRefreshToken = req.cookies?.refreshToken;
  if (!IRefreshToken) {
    throw AppError.unauthorized("Refresh token is required");
  }
  const decodedToken = jwt.verify(
    IRefreshToken,
    <string>process.env.JWT_REFRESH_TOKEN_SECRET,
  ) as UserDocument;
  if (!decodedToken) {
    throw AppError.unauthorized("Unauthorized");
  }
  const user = await User.findById(decodedToken._id);
  if (!user) {
    throw AppError.unauthorized("Invalid refresh token");
  }
  const { accessToken } = user.generateAccessAndRefreshToken();
  return ApiResponse.success(
    res,
    { accessToken },
    "Access token refreshed successfully",
    StatusCode.Success,
    [
      {
        name: "accessToken",
        value: accessToken,
        options: accessTokenCookieOptions,
      },
    ],
  );
});
export const signout = asyncHandler(async (req, res) => {
  return ApiResponse.success(
    res,
    {},
    "Signout successful",
    StatusCode.Success,
    [
      { name: "accessToken", value: "", options: logoutCookieOptions },
      { name: "refreshToken", value: "", options: logoutCookieOptions },
    ],
  );
});
export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const parsedPasswords = changePasswordInputSchema.safeParse(req.body);
  if (!parsedPasswords.success) {
    throw AppError.badRequest(
      parsedPasswords.error?.issues[0]?.message || "Invalid input data",
    );
  }
  const { oldPassword, newPassword } = parsedPasswords.data;
  const user = await User.findById(userId);
  if (!user) {
    throw AppError.notFound("User not found");
  }
  const isOldPasswordCorrect = user.comparePassword(oldPassword);
  if (!isOldPasswordCorrect) {
    throw AppError.badRequest("Old password is incorrect");
  }
  await User.updateOne(
    { _id: userId },
    { $set: { password: bcrypt.hashSync(newPassword, 10) } },
  );
  const updatedUser = await User.findById(userId).select(
    "-password -refreshToken",
  );
  return ApiResponse.success(
    res,
    { user: updatedUser },
    "Password changed successfully",
  );
});
export const forgetWithOTP = asyncHandler(async (req, res) => {
  const userEmail = z.email({ message: "Invalid email address" });
  const userInput = userEmail.safeParse(req.body.email);
  if (!userInput.success) {
    throw AppError.badRequest(
      userInput.error?.issues[0]?.message || "Valid email is required",
    );
  }
  const email = userInput.data;
  const user = await User.findOne({ email });
  if (!user) {
    throw AppError.notFound("User not found with this email");
  }
  const otp = generateOTP();
  await saveOTP({
    email,
    otp,
    data: {
      otpType: "forget",
    },
  });

  await emailQueue.add("send-otp", { email, otp });
  return ApiResponse.success<{ email: string }>(
    res,
    { email },
    "OTP sent successfully",
    StatusCode.Success,
    [
      {
        name: "otp_data",
        value: JSON.stringify({ email, type: "forget" }),
        options: OTPDatacookieOptions,
      },
    ],
  );
});
export const forgetOTPVerification = asyncHandler(async (req, res) => {
  const parsedInput = forgetInputSchema.safeParse(req.body);
  if (!parsedInput.success) {
    throw AppError.badRequest(
      parsedInput.error?.issues[0]?.message || "OTP/Password is required",
    );
  }
  const { otp, password } = parsedInput.data;
  const { email } = req.cookies.otp_data;
  const otpData = await verifyOTP({
    email,
    userOtp: otp.toString(),
    otpType: "forget",
  });

  if (!otpData || otpData.otpType !== "forget") {
    throw AppError.badRequest("Invalid OTP");
  }

  await User.updateOne(
    { email },
    {
      $set: {
        password: bcrypt.hashSync(password, 10),
      },
    },
  );
  return ApiResponse.success(
    res,
    {},
    "Password reset successfully, Please signin with new password",
  );
});
export const deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const user = await User.findByIdAndUpdate(userId, {
    $set: { isDeleted: true },
  });
  if (!user) {
    throw AppError.notFound("User not found");
  }
  return ApiResponse.success(res, {}, "Account deleted successfully");
});
