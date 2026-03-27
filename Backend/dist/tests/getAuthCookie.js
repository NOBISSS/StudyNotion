export async function getAuthCookie(overrides) {
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
//# sourceMappingURL=getAuthCookie.js.map