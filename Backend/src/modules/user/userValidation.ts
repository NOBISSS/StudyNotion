import z from "zod";

export const userInputSchema = z.object({
  about: z.string().optional(),
  contactNumber: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name must be atleast 3 characters" })
    .optional(),
  lastName: z
    .string()
    .min(3, { message: "Last name must be atleast 3 characters" })
    .optional(),
  additionalDetails: userInputSchema,
});
