// Helper that creates a real user in DB, generates a real accessToken,
// and returns it as a cookie string ready for .set("Cookie", ...) in supertest.
// This avoids mocking the auth middleware entirely — the real middleware
// verifies the token and fetches the user from mongo just like production.

export async function getAuthCookie(overrides?: {
  email?: string;
  accountType?: "student" | "instructor" | "admin";
  isBanned?: boolean;
  isDeleted?: boolean;
}) {
  const User = (await import("../src/modules/user/UserModel.js")).default;

  const user = await User.create({
    firstName: "Arafat",
    lastName: "Mansuri",
    email: overrides?.email ?? "arafat@test.com",
    password: "hashed-password",
    accountType: overrides?.accountType ?? "student",
    isBanned: overrides?.isBanned ?? false,
    isDeleted: overrides?.isDeleted ?? false,
  });

  const { accessToken } = user.generateAccessAndRefreshToken();
  return { cookie: `accessToken=${accessToken}`, user };
}
