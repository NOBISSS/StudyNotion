import { afterAll, beforeAll, beforeEach, jest } from "@jest/globals";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: ".env.test" });
dotenv.config();

// ─── Mongoose lifecycle ───────────────────────────────────────────────────────

beforeAll(async () => {
  const uri = process.env["MONGO_URI"];
  if (!uri) {
    throw new Error(
      "MONGO_URI is not set. Make sure globalSetup ran correctly.",
    );
  }
  await mongoose.connect(uri);
});

beforeEach(async () => {
  // Wipe all collections between tests for isolation
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key]!.deleteMany({});
  }
  // Clear mock call counts/return values between tests
  jest.clearAllMocks();
});

afterAll(async () => {
  await mongoose.connection.close();
});

// NOTE: Global jest.mock() calls for auth.service have been removed.
// Under true ESM with isolateModules: true, each test file manages its own
// mocks via jest.unstable_mockModule() before its dynamic imports.
// A global jest.mock() in setup.ts cannot reliably intercept ESM modules
// because the module registry is reset per file.
