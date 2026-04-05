import { endpoints } from "../../../src/endpoints.js";
export const URL = endpoints.auth.forgotpassword.base;
export const forgotPasswordPayload = {
    email: "arafat@test.com",
};
export async function seedUser(overrides) {
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
//# sourceMappingURL=forgotpassword.fixtures.js.map