export default async function globalTeardown() {
    const mongoServer = global.__MONGO_SERVER__;
    if (mongoServer) {
        await mongoServer.stop();
    }
}
//# sourceMappingURL=globalTeardown.js.map