// src/config/env.ts
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  PORT: z.coerce.number().default(3000),

  MONGODB_URI: z.url(),
  // MONGO_DB_NAME: z.string().min(1),

  REDIS_URL: z.url(),

  JWT_ACCESS_TOKEN_SECRET: z.string().min(32),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(32),
  JWT_ACCESS_TOKEN_EXPIRES_IN: z.string().default('1d'),
  JWT_REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),

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

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1); // Crash immediately — never run with invalid config
}

export const env = Object.freeze(parsed.data);