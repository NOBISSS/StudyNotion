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
  birthdate: z.date().optional(),
});
export const forgetInputSchema = z.object({
  otp: z.number(),
  password: z
    .string()
    .regex(/[A-Z]/, {
      message: "Pasword should include atlist 1 uppercasecharacter",
    })
    .regex(/[a-z]/, {
      message: "Pasword should include atlist 1 lowercasecharacter",
    })
    .regex(/[0-9]/, {
      message: "Pasword should include atlist 1 number character",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Pasword should include atlist 1 special character",
    })
    .min(8, { message: "Password length shouldn't be less than 8" }),
});
export const signupInputSchema = z.object({
  firstName: z
    .string()
    .min(3, { message: "First name must be atleast 3 characters" }),
  lastName: z
    .string()
    .min(3, { message: "Last name must be atleast 3 characters" }),
  accountType: z.enum(["admin", "instructor", "student"]),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .regex(/[A-Z]/, {
      message: "Pasword should include atlist 1 uppercasecharacter",
    })
    .regex(/[a-z]/, {
      message: "Pasword should include atlist 1 lowercasecharacter",
    })
    .regex(/[0-9]/, {
      message: "Pasword should include atlist 1 number character",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "Pasword should include atlist 1 special character",
    })
    .min(8, { message: "Password length shouldn't be less than 8" }),
});
export const signinInputSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});
export const changePasswordInputSchema = z.object({
  oldPassword: z.string({ error: "Old password is required" }),
  newPassword: z
    .string()
    .min(8, { message: "New Password length shouldn't be less than 8" })
    .regex(/[A-Z]/, {
      message: "New Pasword should include atlist 1 uppercasecharacter",
    })
    .regex(/[a-z]/, {
      message: "New Pasword should include atlist 1 lowercasecharacter",
    })
    .regex(/[0-9]/, {
      message: "New Pasword should include atlist 1 number character",
    })
    .regex(/[^A-Za-z0-9]/, {
      message: "New Pasword should include atlist 1 special character",
    }),
});