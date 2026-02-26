// src/config/env.ts
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "staging", "production"]),
  PORT: z.coerce.number().default(3000),

  MONGODB_URI: z.url(),
  // MONGO_DB_NAME: z.string().min(1),

  REDIS_URL: z.url(),

  JWT_ACCESS_TOKEN_SECRET: z.string().min(32),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(32),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().default("1d"),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),

  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  // RAZORPAY_KEY_ID: z.string(),
  // RAZORPAY_KEY_SECRET: z.string(),
  // RAZORPAY_WEBHOOK_SECRET: z.string(),

  AWS_REGION: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_BUCKET_NAME: z.string(),
  // AWS_REKOGNITION_COLLECTION_ID: z.string(),

  // OTP_TTL_SECONDS: z.coerce.number().default(300),
  // OTP_MAX_ATTEMPTS: z.coerce.number().default(5),

  // BULLMQ_CONCURRENCY: z.coerce.number().default(10),

  // FRONTEND_URL: z.url(),
  // ALLOWED_ORIGINS: z.string().transform(s => s.split(',')),
});

let cachedEnv: any = null;

export function getEnv() {
  if (cachedEnv) return cachedEnv;

  const tempEnv = {
    NODE_ENV: "test",
    PORT: "3000",

    MONGODB_URI: "mongodb://localhost:27017/testdb",
    REDIS_URL: "redis://localhost:6379",

    JWT_ACCESS_TOKEN_SECRET:
      "test_access_token_secret_123456789012345678901234567890",
    JWT_REFRESH_TOKEN_SECRET:
      "test_refresh_token_secret_123456789012345678901234567890",
    JWT_ACCESS_TOKEN_EXPIRES_IN: "1d",
    JWT_REFRESH_TOKEN_EXPIRES_IN: "7d",
    CLOUDINARY_CLOUD_NAME: "test_cloud_name",
    CLOUDINARY_API_KEY: "test_api_key",
    CLOUDINARY_API_SECRET: "test_api_secret",
    AWS_REGION: "us-east-1",
    AWS_ACCESS_KEY_ID: "test_access_key_id",
    AWS_SECRET_ACCESS_KEY: "test_secret_access_key",
    AWS_BUCKET_NAME: "test_bucket_name",
  };

  const parsed = envSchema.safeParse(tempEnv);
  //   console.log("ENV vars: ", tempEnv.NODE_ENV, tempEnv.PORT, tempEnv.MONGODB_URI);
  if (!parsed.success) {
    console.error("❌ Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);

    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    }
    // process.exit(1);
    throw new Error("Invalid environment variables in test runtime");
  }

  cachedEnv = Object.freeze(parsed.data);
  return cachedEnv;
}
