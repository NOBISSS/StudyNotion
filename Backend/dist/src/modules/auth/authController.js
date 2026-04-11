import axios from "axios";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { oAuth2Client } from "../../shared/config/OAuth2Client.js";
import { accessTokenCookieOptions, logoutCookieOptions, OTPDatacookieOptions, refreshTokenCookieOptions, } from "../../shared/constants.js";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { emailQueue } from "../../shared/queue/emailQueue.js";
import { tokenService } from "../../shared/services/token.service.js";
import { StatusCode } from "../../shared/types.js";
import { canResendOTP, generateOTP, getOTPData, saveOTP, verifyOTP, } from "../../shared/utils/otp.service.js";
import { Profile } from "../user/ProfileModel.js";
import User from "../user/UserModel.js";
import Wishlist from "../wishlist/wishlistModel.js";
import { comparePasswords } from "./auth.utils.js";
import { forgetOTPVerificationSchema, forgetPasswordResetSchema, signinInputSchema, signupInputSchema, } from "./authValidation.js";
export const signupWithOTP = asyncHandler(async (req, res) => {
    const userInput = signupInputSchema.safeParse(req.body);
    if (!userInput.success) {
        throw AppError.badRequest(userInput.error.issues?.[0]?.message || "User data required");
    }
    const { email, password, firstName, lastName, accountType } = userInput.data;
    const lowerCaseEmail = email.toLowerCase();
    const userExists = await User.findOne({ email: lowerCaseEmail });
    if (userExists && !userExists.isDeleted) {
        throw AppError.conflict("User already exists with this username or email");
    }
    if (userExists && userExists.isDeleted) {
        ApiResponse.error(res, {
            code: "ACCOUNT_DELETED",
            message: "This email belongs to a deleted account.",
        }, "Account deleted");
        throw AppError.conflict("Email already in use");
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
    return ApiResponse.success(res, { email: lowerCaseEmail }, "OTP sent successfully", StatusCode.Success, [
        {
            name: "otp_data",
            value: JSON.stringify({ email: lowerCaseEmail, type: "signup" }),
            options: OTPDatacookieOptions,
        },
    ]);
});
export const resendOTP = asyncHandler(async (req, res) => {
    if (!JSON.parse(req.cookies.otp_data)) {
        throw AppError.badRequest("Invalid Request");
    }
    const { email } = JSON.parse(req.cookies.otp_data);
    const canResend = await canResendOTP(email);
    if (!canResend) {
        throw AppError.rateLimited("OTP resend limit reached. Please try again later.");
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
    return ApiResponse.success(res, { email }, "OTP resent successfully", StatusCode.Success, [
        {
            name: "otp_data",
            value: JSON.stringify({
                email,
                type: otpData.otpType === "registration" ? "signup" : "forget",
            }),
            options: OTPDatacookieOptions,
        },
    ]);
});
export const signupOTPVerification = asyncHandler(async (req, res) => {
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
    const user = await User.create({
        email,
        password: otpData.password,
        firstName: otpData.firstName,
        lastName: otpData.lastName,
        accountType: otpData.accountType,
    });
    const profile = await Profile.create({
        userId: user._id,
        profilePicture: `http://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`,
    });
    const wishlist = await Wishlist.create({ userId: user._id });
    const { accessToken, refreshToken } = user.generateAccessAndRefreshToken();
    await user.updateOne({ refreshToken });
    return ApiResponse.created(res, {
        user: {
            ...user.toObject(),
            refreshToken: undefined,
            password: undefined,
            additionalDetails: profile,
        },
        accessToken,
        refreshToken,
    }, "Signup successful", [
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
    ]);
});
export const signin = asyncHandler(async (req, res) => {
    const userInput = signinInputSchema.safeParse(req.body);
    if (!userInput.success) {
        throw AppError.badRequest(userInput.error.issues?.[0]?.message || "Email and password are required");
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
    if (!user.password) {
        throw AppError.unauthorized("Invalid authentication method");
    }
    const isPasswordCorrect = comparePasswords(password, user.password);
    if (!isPasswordCorrect) {
        throw AppError.badRequest("Invalid password");
    }
    const additionalDetails = await Profile.findOne({ userId: user._id });
    const { accessToken, refreshToken } = user.generateAccessAndRefreshToken();
    return ApiResponse.success(res, {
        user: {
            ...user.toObject(),
            refreshToken: undefined,
            password: undefined,
            additionalDetails,
        },
        accessToken,
        refreshToken,
    }, "Signin successful", StatusCode.Success, [
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
    ]);
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
    return ApiResponse.success(res, { accessToken }, "Access token refreshed successfully", StatusCode.Success, [
        {
            name: "accessToken",
            value: accessToken,
            options: accessTokenCookieOptions,
        },
    ]);
});
export const signout = asyncHandler(async (req, res) => {
    const userId = req.userId;
    await User.findByIdAndUpdate(userId, { $set: { refreshToken: null } });
    return ApiResponse.success(res, {}, "Signout successful", StatusCode.Success, [
        { name: "accessToken", value: "", options: logoutCookieOptions },
        { name: "refreshToken", value: "", options: logoutCookieOptions },
    ]);
});
export const forgetWithOTP = asyncHandler(async (req, res) => {
    const userEmail = z
        .string({ error: "Email is required" })
        .email({ message: "Invalid email address" });
    const userInput = userEmail.safeParse(req.body.email);
    if (!userInput.success) {
        throw AppError.badRequest(userInput.error?.issues[0]?.message || "Valid email is required");
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
    return ApiResponse.success(res, { email: lowerCaseEmail }, "OTP sent successfully", StatusCode.Success, [
        {
            name: "otp_data",
            value: JSON.stringify({ email: lowerCaseEmail, type: "forgot" }),
            options: OTPDatacookieOptions,
        },
    ]);
});
export const forgetOTPVerification = asyncHandler(async (req, res) => {
    const parsedInput = forgetOTPVerificationSchema.safeParse(req.body);
    if (!parsedInput.success) {
        throw AppError.badRequest(parsedInput.error?.issues[0]?.message || "OTP/Password is required");
    }
    const { otp } = parsedInput.data;
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
    return ApiResponse.success(res, {}, "OTP verified successfully");
});
export const forgetOTPPasswordReset = asyncHandler(async (req, res) => {
    const parsedInput = forgetPasswordResetSchema.safeParse(req.body);
    if (!parsedInput.success) {
        throw AppError.badRequest(parsedInput.error?.issues[0]?.message || "OTP/Password is required");
    }
    const { password } = parsedInput.data;
    const { email, type } = JSON.parse(req.cookies.otp_data);
    const lowerCaseEmail = email.toLowerCase();
    if (!email || type !== "forgot") {
        throw AppError.badRequest("Invalid Request");
    }
    await User.updateOne({ email: lowerCaseEmail }, {
        $set: {
            password: bcrypt.hashSync(password, 10),
        },
    });
    return ApiResponse.success(res, {}, "Password reset successfully, Please signin with new password");
});
export const googleSignin = asyncHandler(async (req, res) => {
    const code = req.query.code;
    console.log(`Request from: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
    const googleResponse = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(googleResponse.tokens);
    const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleResponse.tokens.access_token}`);
    let user = await User.findOne({
        email: userRes.data.email,
        isDeleted: false,
    });
    if (!user) {
        user = await User.create({
            firstName: userRes.data.name.split(" ")[0],
            lastName: userRes.data.name.split(" ").slice(1).join(" "),
            email: userRes.data.email,
            method: "google",
        });
    }
    let userProfile = await Profile.findOneAndUpdate({ userId: user._id }, { profilePicture: userRes.data.picture }, { returnDocument: "after" });
    if (!userProfile) {
        userProfile = await Profile.create({
            userId: user._id,
            profilePicture: userRes.data.picture,
        });
    }
    const { accessToken, refreshToken } = user.generateAccessAndRefreshToken();
    return ApiResponse.success(res, {
        user: {
            ...user.toObject(),
            refreshToken: undefined,
            password: undefined,
            additionalDetails: userProfile,
        },
        accessToken,
        refreshToken,
    }, "Signin successful", StatusCode.Success, [
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
    ]);
});
export const githubSignin = asyncHandler(async (req, res) => {
    const code = req.query.code;
    if (!code || typeof code !== "string") {
        throw new Error("Invalid GitHub code");
    }
    const response = await axios.post("https://github.com/login/oauth/access_token", {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI,
    }, {
        headers: {
            Accept: "application/json",
        },
    });
    const access_token = response.data.access_token;
    if (!access_token) {
        console.log("TOKEN RESPONSE:", response.data);
        throw new Error("GitHub access_token missing");
    }
    const userRes = await axios.get("https://api.github.com/user", {
        headers: {
            Authorization: `token ${access_token}`,
        },
    });
    const emailsRes = await axios.get("https://api.github.com/user/emails", {
        headers: {
            Authorization: `token ${access_token}`,
        },
    });
    const primaryEmail = emailsRes.data.find((e) => e.primary)?.email ||
        emailsRes.data[0]?.email;
    if (!primaryEmail) {
        throw new Error("No email found from GitHub");
    }
    const fullName = userRes.data.name || "GitHub User";
    const firstName = fullName.split(" ")[0];
    const lastName = fullName.split(" ").slice(1).join(" ");
    let user = await User.findOneAndUpdate({ email: primaryEmail, isDeleted: false }, { method: "github" }, { returnDocument: "after" });
    if (!user) {
        user = await User.create({
            firstName,
            lastName,
            email: primaryEmail,
            method: "github",
        });
    }
    let userProfile = await Profile.findOneAndUpdate({ userId: user._id }, { profilePicture: userRes.data.avatar_url }, { returnDocument: "after" });
    if (!userProfile) {
        userProfile = await Profile.create({
            userId: user._id,
            profilePicture: userRes.data.avatar_url,
        });
    }
    const { accessToken, refreshToken } = user.generateAccessAndRefreshToken();
    ApiResponse.success(res, {
        user: {
            ...user.toObject(),
            refreshToken: undefined,
            password: undefined,
            additionalDetails: userProfile,
        },
        accessToken,
        refreshToken,
    }, "Signin successful", StatusCode.Success, [
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
    ]);
});
//# sourceMappingURL=authController.js.map