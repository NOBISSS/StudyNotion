import z from "zod";
export declare const userInputSchema: z.ZodObject<{
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    about: z.ZodOptional<z.ZodString>;
    contactNumber: z.ZodOptional<z.ZodNumber>;
    gender: z.ZodOptional<z.ZodEnum<{
        male: "male";
        female: "female";
        other: "other";
    }>>;
    city: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    birthdate: z.ZodOptional<z.ZodString>;
}, z.z.core.$strip>;
export declare const updateProfileSchema: z.ZodObject<{
    additionalDetails: z.ZodObject<{
        firstName: z.ZodOptional<z.ZodString>;
        lastName: z.ZodOptional<z.ZodString>;
        about: z.ZodOptional<z.ZodString>;
        contactNumber: z.ZodOptional<z.ZodNumber>;
        gender: z.ZodOptional<z.ZodEnum<{
            male: "male";
            female: "female";
            other: "other";
        }>>;
        city: z.ZodOptional<z.ZodString>;
        country: z.ZodOptional<z.ZodString>;
        birthdate: z.ZodOptional<z.ZodString>;
    }, z.z.core.$strip>;
}, z.z.core.$strip>;
//# sourceMappingURL=userValidation.d.ts.map