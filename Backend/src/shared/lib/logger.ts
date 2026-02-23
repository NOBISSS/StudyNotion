// src/lib/logger.ts
import pino from "pino";
import { env } from "../config/env.js";

export const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  ...(env.NODE_ENV !== "production" && {
    transport: {
      target: "pino-pretty",
      options: { colorize: true },
    },
  }),
  base: {
    env: env.NODE_ENV,
    version: process.env.npm_package_version,
  },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.body.password",
      "req.body.otp",
      "req.body.refreshToken",
    ],
    censor: "[REDACTED]",
  },
});
