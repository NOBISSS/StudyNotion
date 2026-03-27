import bcrypt from "bcrypt";
import redis from "../config/redis.js";
const OTP_TTL = 5 * 60;
const RESEND_BLOCK_TIME = 0;
export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
export const saveOTP = async ({ email, otp, data, }) => {
    const hashedOtp = await bcrypt.hash(otp, 10);
    const payload = {
        otp: hashedOtp,
        ...data,
    };
    await redis.set(`otp:${email}`, JSON.stringify(payload), "EX", OTP_TTL);
};
export const getOTPData = async (email) => {
    const data = await redis.get(`otp:${email}`);
    return data ? JSON.parse(data) : null;
};
export const canResendOTP = async (email) => {
    const ttl = await redis.ttl(`otp:${email}`);
    return ttl <= OTP_TTL - RESEND_BLOCK_TIME;
};
export const verifyOTP = async ({ email, userOtp, otpType, }) => {
    const data = await getOTPData(email);
    if (!data || !data.otp)
        return null;
    const isValid = await bcrypt.compare(userOtp, data.otp);
    if (!isValid)
        return null;
    if (data.otpType !== otpType)
        return null;
    await redis.del(`otp:${email}`);
    return data;
};
//# sourceMappingURL=otp.service.js.map