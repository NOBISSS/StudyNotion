export const MATERIAL_MAX_FILE_SIZE = 50 * 1024 * 1024;
export const accessTokenCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 24 * 60 * 60 * 1000,
};
export const refreshTokenCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 15 * 24 * 60 * 60 * 1000,
};
export const logoutCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 0,
};
export const OTPDatacookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 10 * 60 * 1000,
};
export const ROLES = {
    STUDENT: "student",
    INSTRUCTOR: "instructor",
    ADMIN: "admin",
};
//# sourceMappingURL=constants.js.map