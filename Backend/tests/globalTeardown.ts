import type { MongoMemoryServer } from "mongodb-memory-server";

// Runs ONCE after all test suites in the entire Jest run.
// Mirror of globalSetup — stops what globalSetup started.
export default async function globalTeardown() {
  const mongoServer = (
    global as typeof globalThis & { __MONGO_SERVER__: MongoMemoryServer }
  ).__MONGO_SERVER__;

  if (mongoServer) {
    // stop() destroys the process — no need to dropDatabase() first,
    // the entire in-memory instance ceases to exist
    await mongoServer.stop();
  }
}
