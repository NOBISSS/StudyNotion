import { AppError } from "../lib/AppError.js";
import { asyncHandler } from "../lib/asyncHandler.js";
export const verifyOtpSession = asyncHandler((req, res, next) => {
    const otpData = req.cookies?.otp_data ? JSON.parse(req.cookies.otp_data) : null;
    if (!otpData || !otpData.email || !otpData.type) {
        throw AppError.unauthorized("Invalid or expired OTP session");
    }
    next();
});
//# sourceMappingURL=verifyOtpSession.js.map