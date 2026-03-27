import type { OTPData, OTPType, SaveOTPOptions } from "../../modules/auth/auth.type.js";
export declare const generateOTP: () => string;
export declare const saveOTP: ({ email, otp, data }: SaveOTPOptions) => Promise<void>;
export declare const getOTPData: (email: string) => Promise<OTPData | null>;
export declare const verifyOTP: (email: string, inputOTP: string, type: OTPType) => Promise<OTPData | null>;
export declare const canResendOTP: (email: string) => Promise<boolean>;
export declare const deleteOTP: (email: string) => Promise<void>;
//# sourceMappingURL=otp.service.d.ts.map