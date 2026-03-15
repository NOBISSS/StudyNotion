import type { CookieOptions } from "express";
export const MATERIAL_MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const accessTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: <"none">"none",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};
export const refreshTokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: <"none">"none",
  path: "/",
  maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
};
export const logoutCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: <"none">"none",
  path: "/",
  maxAge: 0, // 0 days
};
export const OTPDatacookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  path: "/",
  maxAge: 10 * 60 * 1000, // 10 minutes
};
export const ROLES = {
  STUDENT: "student",
  INSTRUCTOR: "instructor",
  ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];