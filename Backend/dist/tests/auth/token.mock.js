import { jest } from "@jest/globals";
jest.unstable_mockModule("../../src/modules/auth/auth.service.js", () => ({
    generateAccessToken: jest.fn().mockReturnValue("mock-access-token"),
    generateRefreshToken: jest.fn().mockReturnValue("mock-refresh-token"),
}));
//# sourceMappingURL=token.mock.js.map