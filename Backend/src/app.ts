import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { categoryRouter } from "./routes/categoryRoutes.js";
import CommentRouter from "./routes/commentRoutes.js";
import { courseEnrollmentRouter } from "./routes/courseEnrollmentRoutes.js";
import { courseRouter } from "./routes/courseRoutes.js";
import multipartUploadRoute from "./routes/MultipartUploadRoute.js";
import { reviewRouter } from "./routes/reviewRoutes.js";
import { sectionRouter } from "./routes/sectionRoutes.js";
import subsectionRouter from "./routes/subsectionRoutes.js";
import { userRedisRouter } from "./routes/userRedisRouter.js";
import { userRouter } from "./routes/userRoutes.js";
import cors from "cors";
dotenv.config();

const app = express();

const allowedOrigins = ["http://localhost:5173","127.0.0.1:5173"];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello, StudyNotion!");
});


app.use("/api/users",userRedisRouter);
app.use("/api/users",userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/enrollments", courseEnrollmentRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/sections", sectionRouter);
app.use("/api/subsection", subsectionRouter);
app.use("/s3", multipartUploadRoute);
app.use("/api/comments", CommentRouter);

export default app;
