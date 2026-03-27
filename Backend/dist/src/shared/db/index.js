import mongoose from "mongoose";
const connectDB = async (MONGODB_URI) => {
    try {
        await mongoose.connect(MONGODB_URI);
    }
    catch (err) {
        console.log("Error connecting database", err);
        process.exit(1);
    }
};
export { connectDB };
//# sourceMappingURL=index.js.map