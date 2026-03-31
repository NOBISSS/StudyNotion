import axios from "axios";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { oAuth2Client } from "../../shared/config/OAuth2Client.js";
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
import { tokenService } from "../../shared/services/token.service.js";
import { StatusCode, type Handler } from "../../shared/types.js";
import {
  canResendOTP,
  generateOTP,
  getOTPData,
  saveOTP,
  verifyOTP,
} from "../../shared/utils/otp.service.js";
import { Profile } from "../user/ProfileModel.js";
import User from "../user/UserModel.js";
import {
  forgetInputSchema,
  signinInputSchema,
  signupInputSchema,
} from "./authValidation.js";
import Wishlist from "../wishlist/wishlistModel.js";
import { comparePasswords } from "./auth.utils.js";
import { CourseEnrollment } from "../enrollment/CourseEnrollment.js";

export const signupWithOTP:Handler = asyncHandler(async (req, res) => {
  const userInput = signupInputSchema.safeParse(req.body);
  if (!userInput.success) {
    throw AppError.badRequest(
      userInput.error.issues?.[0]?.message || "User data required",
    );
  }
  const { email, password, firstName, lastName, accountType } = userInput.data;
  const lowerCaseEmail = email.toLowerCase();
  const userExists = await User.findOne({ email: lowerCaseEmail});
  if (userExists && !userExists.isDeleted) {
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
export const resendOTP:Handler = asyncHandler(async (req, res) => {
  if (
    !JSON.parse(req.cookies.otp_data)
  ) {
    throw AppError.badRequest("Invalid Request");
  }
  const { email } = JSON.parse(req.cookies.otp_data);

  const canResend = await canResendOTP(email);
  if (!canResend) {
    throw AppError.rateLimited(
      "OTP resend limit reached. Please try again later.",
    );
  }

  const otp = generateOTP();
  const otpData = await getOTPData(email);
  if (!otpData) {
    throw AppError.forbidden("Invalid OTP request");
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
export const signupOTPVerification:Handler = asyncHandler(async (req, res) => {
  if (!JSON.parse(req.cookies.otp_data)) {
    throw AppError.badRequest("Invalid Request");
  }
  const { email, type } = JSON.parse(req.cookies.otp_data);
  if (!email || !type) {
    throw AppError.badRequest("Invalid Request");
  }
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
  let user = await User.findOne({ email });
  let profile;
  let wishlist;
  if (user && user.isDeleted) {
    user.isDeleted = false;
    user.password = otpData.password as string;
    user.firstName = otpData.firstName as string;
    user.lastName = otpData.lastName as string;
    user.accountType = otpData.accountType as
      | "admin"
      | "instructor"
      | "student";
    profile = await Profile.findOneAndUpdate(
      { userId: user._id },
      {
        profilePicture: `http://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`,
        isDeleted: false,
      },
      { new: true },
    );
    wishlist = await Wishlist.findOneAndUpdate({ userId: user._id},{courseIds:[], bundleIds:[]}, { new: true });
    await CourseEnrollment.updateMany({ userId: user._id }, { $set: { isActive: false } });
    await user.save();
  } else
    user = await User.create({
      email,
      password: otpData.password as string,
      firstName: otpData.firstName as string,
      lastName: otpData.lastName as string,
      accountType: otpData.accountType as "admin" | "instructor" | "student",
    });

  if (!profile) {
    profile = await Profile.create({ userId: user._id, profilePicture: `http://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}` });
  }
  if (!wishlist) {
    wishlist = await Wishlist.create({ userId: user._id });
  }
  const { accessToken, refreshToken } = user.generateAccessAndRefreshToken();
  await user.updateOne({ refreshToken });
  return ApiResponse.created(
    res,
    {
      user: {
        ...user.toObject(),
        refreshToken: undefined,
        password: undefined,
        additionalDetails: profile,
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
  const user = await User.findOne({ email});
  if (!user) {
    throw AppError.notFound("User not found with this email");
  }
  if (user.isBanned) {
    throw AppError.unauthorized("User is banned, Contact support");
  }
  if (user.isDeleted) {
    throw AppError.unauthorized("User is deleted, Contact support");
  }
  if (!user.password) {
    throw AppError.unauthorized("Invalid authentication method");
  }
  const isPasswordCorrect = comparePasswords(password, user.password as string);
  if (!isPasswordCorrect) {
    throw AppError.badRequest("Invalid password");
  }
  const additionalDetails = await Profile.findOne({ userId: user._id });
  const { accessToken, refreshToken } = user.generateAccessAndRefreshToken();
  return ApiResponse.success(
    res,
    {
      user: {
        ...user.toObject(),
        refreshToken: undefined,
        password: undefined,
        additionalDetails,
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
export const refreshTokens = asyncHandler(async (req, res) => {
  const IRefreshToken = req.cookies?.refreshToken;
  if (!IRefreshToken) {
    throw AppError.unauthorized("Refresh token is required");
  }
  const decodedToken = tokenService.verifyRefreshToken(IRefreshToken);
  const user = await User.findById(decodedToken._id);
  if (!user) {
    throw AppError.unauthorized("Invalid refresh token");
  }
  const accessToken = user.generateAccessAndRefreshToken().accessToken;
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
  const userId = req.userId;
  await User.findByIdAndUpdate(userId, { $set: { refreshToken: null } });
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
export const forgetWithOTP = asyncHandler(async (req, res) => {
  const userEmail = z
    .string({ error: "Email is required" })
    .email({ message: "Invalid email address" });
  const userInput = userEmail.safeParse(req.body.email);
  if (!userInput.success) {
    throw AppError.badRequest(
      userInput.error?.issues[0]?.message || "Valid email is required",
    );
  }
  const email = userInput.data;
  const lowerCaseEmail = email.toLowerCase();
  const user = await User.findOne({ email: lowerCaseEmail });
  if (!user) {
    throw AppError.notFound("User not found with this email");
  }
  const otp = generateOTP();
  await saveOTP({
    email: lowerCaseEmail,
    otp,
    data: {
      otpType: "forgot",
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
        value: JSON.stringify({ email: lowerCaseEmail, type: "forgot" }),
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
  const { email } = JSON.parse(req.cookies.otp_data);
  const lowerCaseEmail = email.toLowerCase();
  const otpData = await verifyOTP({
    email: lowerCaseEmail,
    userOtp: otp.toString(),
    otpType: "forgot",
  });

  if (!otpData || otpData.otpType !== "forgot") {
    throw AppError.badRequest("Invalid OTP");
  }

  await User.updateOne(
    { email: lowerCaseEmail },
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
export const googleSignin = asyncHandler(async (req, res) => {
  const code = req.query.code;
  const googleResponse = await oAuth2Client.getToken(code as string);
  oAuth2Client.setCredentials(googleResponse.tokens);
  const userRes = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`,
  );
  
  let user = await User.findOne({ email: userRes.data.email, isDeleted: false });
  if (!user) {
//     data: {
//     id: '100612055580398392690',
//     email: 'mansuriarafat302@gmail.com',
//     verified_email: true,
//     name: 'Arafat Mansuri',
//     given_name: 'Arafat',
//     family_name: 'Mansuri',
//     picture: 'https://lh3.googleusercontent.com/a/ACg8ocJrM6TzMclHa2mnjSgqcxvMpGVyYCKQ9_UUxJruMNLmiUVZcI3k=s96-c'
//   }
    user = await User.create({
      firstName: userRes.data.name.split(" ")[0],
      lastName: userRes.data.name.split(" ").slice(1).join(" "),
      email: userRes.data.email,
      method: "google",
    });
  }
  let userProfile = await Profile.findOneAndUpdate({ userId: user._id }, { profilePicture: userRes.data.picture }, { new: true });
  if (!userProfile) {
    userProfile = await Profile.create({ userId: user._id, profilePicture: userRes.data.picture });
  }
  const { accessToken, refreshToken } = user.generateAccessAndRefreshToken();
  return ApiResponse.success(
    res,
    {
      user: {
        ...user.toObject(),
        refreshToken: undefined,
        password: undefined,
        additionalDetails: userProfile,
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
