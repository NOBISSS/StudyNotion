import { endpoints } from "../../../src/endpoints.js";
export const signinPayload = {
    email: "arafat@test.com",
    password: "Password@123",
};
export const URL = endpoints.auth.signin.base;
export async function seedUser(overrides) {
    const User = (await import("../../../src/modules/user/UserModel.js")).default;
    return User.create({
        firstName: "Arafat",
        lastName: "Mansuri",
        email: overrides?.email ?? signinPayload.email,
        password: overrides?.password ?? "hashed-password",
        accountType: "student",
        isDeleted: false,
        isBanned: false,
    });
}
//# sourceMappingURL=signin.fixtures.js.map