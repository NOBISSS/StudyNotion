import z from "zod";

export const forgetInputSchema = z.object({
  otp: z.number(),
  password: z
    .string()
    .regex(/[A-Z]/, {
      error: "Password should include atlist 1 uppercase character",
    })
    .regex(/[a-z]/, {
      error: "Password should include atlist 1 lowercase character",
    })
    .regex(/[0-9]/, {
      error: "Password should include atlist 1 number character",
    })
    .regex(/[^A-Za-z0-9]/, {
      error: "Password should include atlist 1 special character",
    })
    .min(8, { error: "Password length shouldn't be less than 8" }),
});
export const signupInputSchema = z.object({
  firstName: z
    .string()
    .min(3, { error: "First name must be atleast 3 characters" }),
  lastName: z
    .string()
    .min(3, { error: "Last name must be atleast 3 characters" }),
  accountType: z.enum(["admin", "instructor", "student"]),
  email: z.email({ error: "Invalid email address" }),
  password: z
    .string()
    .regex(/[A-Z]/, {
      error: "Password should include atlist 1 uppercase character",
    })
    .regex(/[a-z]/, {
      error: "Password should include atlist 1 lowercase character",
    })
    .regex(/[0-9]/, {
      error: "Password should include atlist 1 number character",
    })
    .regex(/[^A-Za-z0-9]/, {
      error: "Password should include atlist 1 special character",
    })
    .min(8, { error: "Password length shouldn't be less than 8" }),
});
export const signinInputSchema = z.object({
  email: z.string({ error: "Email is required" }).email({ error: "Invalid email address" }),
  password: z.string({ error: "Password is required" }),
});
export const changePasswordInputSchema = z.object({
  oldPassword: z.string({ error: "Old password is required" }),
  newPassword: z
    .string()
    .min(8, { error: "New Password length shouldn't be less than 8" })
    .regex(/[A-Z]/, {
      error: "New Password should include atlist 1 uppercase character",
    })
    .regex(/[a-z]/, {
      error: "New Password should include atlist 1 lowercase character",
    })
    .regex(/[0-9]/, {
      error: "New Password should include atlist 1 number character",
    })
    .regex(/[^A-Za-z0-9]/, {
      error: "New Password should include atlist 1 special character",
    }),
});