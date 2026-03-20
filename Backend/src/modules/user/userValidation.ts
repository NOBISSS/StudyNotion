import z from "zod";

export const userInputSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "First name must be atleast 3 characters" })
      .optional(),
    lastName: z
      .string()
      .min(3, { message: "Last name must be atleast 3 characters" })
      .optional(),
    about: z.string().optional(),
    contactNumber: z.number().optional(),
    gender: z.enum(["male", "female", "other"]).optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    birthdate: z.string().datetime().optional(),
  });

export const updateProfileSchema = z.object({
  additionalDetails: userInputSchema,
});
