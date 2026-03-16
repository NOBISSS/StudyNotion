import { endpoints } from "../../../src/endpoints.js";

export const URL = endpoints.auth.forgotpassword.base;

export const forgotPasswordPayload = {
  email: "arafat@test.com",
};

// Seeds a verified user into the DB directly
export async function seedUser(overrides?: { email?: string }) {
  const User = (await import("../../../src/modules/user/UserModel.js")).default;
  return User.create({
    firstName: "Arafat",
    lastName: "Mansuri",
    email: overrides?.email ?? forgotPasswordPayload.email,
    password: "hashed-password",
    accountType: "student",
    isBanned: false,
    isDeleted: false,
  });
}
