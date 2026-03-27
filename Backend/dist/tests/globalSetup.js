import { MongoMemoryServer } from "mongodb-memory-server";
export default async function globalSetup() {
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    process.env["MONGO_URI"] = uri;
    global.__MONGO_SERVER__ = mongoServer;
}
//# sourceMappingURL=globalSetup.js.map