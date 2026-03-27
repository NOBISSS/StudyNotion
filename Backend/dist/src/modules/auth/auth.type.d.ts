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
    accountType?: "student" | "admin" | "instructor" | undefined;
    password?: string | undefined;
    otpType?: OTPType;
};
export declare const accountTypes: readonly ["admin", "student", "instructor"];
export type account = (typeof accountTypes)[number];
//# sourceMappingURL=auth.type.d.ts.map