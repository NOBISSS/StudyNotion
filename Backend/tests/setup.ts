import { afterAll, beforeAll, beforeEach } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

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
