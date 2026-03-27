import { endpoints } from "../../../src/endpoints.js";
export const URL = endpoints.auth.changepassword.base;
export const changePasswordPayload = {
    oldPassword: "Password@123",
    newPassword: "NewPassword@456",
};
export async function seedAuthenticatedUser(overrides) {
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
    const { accessToken } = user.generateAccessAndRefreshToken();
    return { cookie: `accessToken=${accessToken}`, user };
}
//# sourceMappingURL=changepassword.fixtures.js.map