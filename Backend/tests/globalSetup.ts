import { MongoMemoryServer } from "mongodb-memory-server";

// Runs ONCE before all test suites in the entire Jest run.
// Responsible for starting infrastructure (Mongo) and writing
// shared config to process.env so every worker process can read it.
export default async function globalSetup() {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Store URI so setup.ts (which runs per-worker) can connect mongoose
  process.env["MONGO_URI"] = uri;

  // Store the instance reference on global so globalTeardown can stop it
  // Using a well-namespaced key avoids collisions with other globals
  (
    global as typeof globalThis & { __MONGO_SERVER__: MongoMemoryServer }
  ).__MONGO_SERVER__ = mongoServer;
}
