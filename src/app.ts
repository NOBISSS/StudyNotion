import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { userRedisRouter } from "./routes/userRedisRouter.js";
import { courseRouter } from "./routes/courseRoutes.js";
import { userRouter } from "./routes/userRoutes.js";
import { courseEnrollmentRouter } from "./routes/courseEnrollmentRoutes.js";
import { categoryRouter } from "./routes/categoryRoutes.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello, StudyNotion!");
});


app.use("/api/users",userRedisRouter)
app.use("/api/courses", courseRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/enrollments", courseEnrollmentRouter);

//app.use("/api/users",userRouter)
export default app;
