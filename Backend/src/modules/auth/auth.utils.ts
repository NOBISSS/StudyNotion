import bcrypt from "bcryptjs";

export const comparePasswords = (inputPassword: string, storedPassword: string) => {
  return bcrypt.compareSync(inputPassword, storedPassword);
}