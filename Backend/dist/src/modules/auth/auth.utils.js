import bcrypt from "bcryptjs";
export const comparePasswords = (inputPassword, storedPassword) => {
    return bcrypt.compareSync(inputPassword, storedPassword);
};
//# sourceMappingURL=auth.utils.js.map