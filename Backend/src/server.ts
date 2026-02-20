import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import app from "./app.js";
dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed", err);
    process.exit(1);
  });