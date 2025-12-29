import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import express from "express";
import { userRouter } from "./routes/userRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello, StudyNotion!");
});

app.use("/api/users",userRouter)

export default app;
