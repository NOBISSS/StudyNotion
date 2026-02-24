export interface SaveOTPOptions {
  email: string;
  otp: string;
  data?: OTPData;
}
export type OTPType = "registration" | "forgotpassword" | "login";
export type OTPData = {
  otp?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  contactNo?: string | undefined;
  accountType?: "admin" | "vendor" | "venue" | "user" | undefined;
  password?: string | undefined;
  otpType?: OTPType;
};
export const accountTypes = ["admin", "vendor", "venue", "user"] as const;
export type account = (typeof accountTypes)[number];