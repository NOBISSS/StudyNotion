import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { categoryRouter } from "./modules/category/categoryRoutes.js";
import CommentRouter from "./modules/comment/commentRoutes.js";
import { courseRouter } from "./modules/course/courseRoutes.js";
import { courseEnrollmentRouter } from "./modules/enrollment/courseEnrollmentRoutes.js";
import { reviewRouter } from "./modules/rating/reviewRoutes.js";
import { sectionRouter } from "./modules/section/sectionRoutes.js";
import SignatureGenerationRouter from "./modules/signatureGeneration/generateSignatures.routes.js";
import subsectionRouter from "./modules/subsection/subsectionRoutes.js";
import userRouter  from "./modules/user/userRoutes.js";
import multipartUploadRoute from "./routes/MultipartUploadRoute.js";
import { globalErrorHandler } from "./shared/lib/ErrorHandler.js";
import authRouter from "./modules/auth/authRoutes.js";
dotenv.config();

const app = express();

const allowedOrigins = ["http://localhost:5173", "127.0.0.1:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello, StudyNotion!");
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/enrollments", courseEnrollmentRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/sections", sectionRouter);
app.use("/api/subsections", subsectionRouter);
app.use("/s3", multipartUploadRoute);
app.use("/api/comments", CommentRouter);
app.use("/api/signatures", SignatureGenerationRouter);

app.use(globalErrorHandler);

export default app;
