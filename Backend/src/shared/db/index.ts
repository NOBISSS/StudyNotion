import mongoose from "mongoose";
const connectDB = async (MONGODB_URI: string) => {
  try {
    await mongoose.connect(MONGODB_URI);
  } catch (err) {
    console.log("Error connecting database", err);
    process.exit(1);
  }
};

export { connectDB };
