import z from "zod";
export declare const userInputSchema: z.ZodObject<{
    about: z.ZodOptional<z.ZodString>;
    contactNumber: z.ZodOptional<z.ZodString>;
    gender: z.ZodOptional<z.ZodEnum<{
        Male: "Male";
        Female: "Female";
        Other: "Other";
    }>>;
    city: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    dateOfBirth: z.ZodOptional<z.ZodString>;
}, z.z.core.$strip>;
export declare const updateProfileSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    additionalDetails: z.ZodObject<{
        about: z.ZodOptional<z.ZodString>;
        contactNumber: z.ZodOptional<z.ZodString>;
        gender: z.ZodOptional<z.ZodEnum<{
            Male: "Male";
            Female: "Female";
            Other: "Other";
        }>>;
        city: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
        dateOfBirth: z.ZodOptional<z.ZodString>;
    }, z.z.core.$strip>;
}, z.z.core.$strip>;
//# sourceMappingURL=userValidation.d.ts.map