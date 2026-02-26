import { afterAll, beforeAll, beforeEach, jest } from "@jest/globals";
import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
dotenv.config();

jest.mock("../src/shared/queue/emailQueue.js", () =>
  require("../__mocks__/emailQueue.js"),
);
jest.mock("../src/shared/utils/otp.service.js", () =>
  require("../__mocks__/generateOTP.js"),
);
declare global {
  var __MONGO_SERVER__: MongoMemoryServer;
}

beforeAll(async () => {
  global.__MONGO_SERVER__ = await MongoMemoryServer.create();

  const uri = global.__MONGO_SERVER__.getUri();

  await mongoose.connect(uri);
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await global.__MONGO_SERVER__.stop();
});
