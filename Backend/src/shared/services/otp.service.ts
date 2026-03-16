import type { OTPData, OTPType, SaveOTPOptions } from "../../modules/auth/auth.type.js";
import redis  from "../config/redis.js";

const OTP_TTL = 5 * 60; // 5 minutes
const RESEND_COOLDOWN = 1; // 2 minutes

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const saveOTP = async ({ email, otp, data = {} }: SaveOTPOptions) => {
  const payload = JSON.stringify({
    otp,
    ...data,
    createdAt: Date.now(),
  });

  const pipeline = redis.pipeline();
  pipeline.setex(`otp:${email}`, OTP_TTL, payload);
  pipeline.setex(`otp:cooldown:${email}`, RESEND_COOLDOWN, "1");
  await pipeline.exec();
};

export const getOTPData = async (email: string): Promise<OTPData | null> => {
  const raw = await redis.get(`otp:${email}`);
  if (!raw) return null;

  return JSON.parse(raw);
};
export const verifyOTP = async (
  email: string,
  inputOTP: string,
  type: OTPType,
) => {
  const data = await getOTPData(email);

  if (!data) return null;

  if (data.otp !== inputOTP || data.otpType !== type) return null;

  // delete after success
  await redis.del(`otp:${email}`);

  return data;
};

export const canResendOTP = async (email: string) => {
  const ttl = await redis.ttl(`otp:${email}`);
  return ttl <= OTP_TTL - RESEND_COOLDOWN;
};

export const deleteOTP = async (email: string) => {
  await redis.del(`otp:${email}`);
  await redis.del(`otp:cooldown:${email}`);
};
