import { endpoints } from "../../../src/endpoints.js";

export const URL = endpoints.auth.refreshToken.base;

// Creates a user and returns both cookies ready for supertest
export async function getRefreshCookie(overrides?: { email?: string }) {
  const User = (await import("../../../src/modules/user/UserModel.js")).default;

  const user = await User.create({
    firstName: "Arafat",
    lastName: "Mansuri",
    email: overrides?.email ?? "arafat@test.com",
    password: "hashed-password",
    accountType: "student",
    isBanned: false,
    isDeleted: false,
  });

  const { accessToken, refreshToken } = user.generateAccessAndRefreshToken();
  await user.updateOne({ refreshToken });

  return {
    refreshCookie: `refreshToken=${refreshToken}`,
    accessCookie: `accessToken=${accessToken}`,
    user,
  };
}