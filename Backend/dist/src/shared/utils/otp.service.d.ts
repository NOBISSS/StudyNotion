export declare const generateOTP: () => string;
export type OTPData = {
    otp?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
    accountType?: "admin" | "instructor" | "student" | undefined;
    password?: string | undefined;
    otpType?: "registration" | "forgot" | undefined;
};
export declare const saveOTP: ({ email, otp, data, }: {
    email: string;
    otp: string;
    data: OTPData;
}) => Promise<void>;
export declare const getOTPData: (email: string) => Promise<OTPData | null>;
export declare const canResendOTP: (email: string) => Promise<boolean>;
export declare const verifyOTP: ({ email, userOtp, otpType, }: {
    email: string;
    userOtp: string;
    otpType: "registration" | "forgot";
}) => Promise<OTPData | null>;
//# sourceMappingURL=otp.service.d.ts.map