import type { MongoMemoryServer } from "mongodb-memory-server";

// Augments the NodeJS global type so TypeScript understands __MONGO_SERVER__
// without needing to cast (global as any) everywhere.
// This file is picked up automatically because it's included in tsconfig paths.
declare global {
  // eslint-disable-next-line no-var
  var __MONGO_SERVER__: MongoMemoryServer;
}

export {};
