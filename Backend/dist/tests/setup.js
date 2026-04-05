import { afterAll, beforeAll, beforeEach, jest } from "@jest/globals";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config({ path: ".env.test" });
dotenv.config();
beforeAll(async () => {
    const uri = process.env["MONGO_URI"];
    if (!uri) {
        throw new Error("MONGO_URI is not set. Make sure globalSetup ran correctly.");
    }
    await mongoose.connect(uri);
});
beforeEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
    jest.clearAllMocks();
});
afterAll(async () => {
    await mongoose.connection.close();
});
//# sourceMappingURL=setup.js.map