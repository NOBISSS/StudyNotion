import z from "zod";
export declare const forgetInputSchema: z.ZodObject<{
    otp: z.ZodNumber;
    password: z.ZodString;
}, z.z.core.$strip>;
export declare const signupInputSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    accountType: z.ZodEnum<{
        student: "student";
        instructor: "instructor";
        admin: "admin";
    }>;
    email: z.ZodString;
    password: z.ZodString;
}, z.z.core.$strip>;
export declare const signinInputSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.z.core.$strip>;
//# sourceMappingURL=authValidation.d.ts.map