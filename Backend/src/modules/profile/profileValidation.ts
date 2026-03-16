import z from "zod";
export const changePasswordInputSchema = z.object({
  oldPassword: z.string({ error: "Old password is required" }),
  newPassword: z
    .string({ error: "New password is required" })
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
