import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRouter from "./modules/auth/authRoutes.js";
import { categoryRouter } from "./modules/category/categoryRoutes.js";
import CommentRouter from "./modules/comment/commentRoutes.js";
import { courseRouter } from "./modules/course/courseRoutes.js";
import { courseEnrollmentRouter } from "./modules/enrollment/courseEnrollmentRoutes.js";
import profileRouter from "./modules/profile/profileRoutes.js";
import { reviewRouter } from "./modules/rating/reviewRoutes.js";
import { sectionRouter } from "./modules/section/sectionRoutes.js";
import SignatureGenerationRouter from "./modules/signatureGeneration/generateSignatures.routes.js";
import subsectionRouter from "./modules/subsection/subsectionRoutes.js";
import multipartUploadRoute from "./modules/subsection/video/MultipartUploadRoute.js";
import userRouter from "./modules/user/userRoutes.js";
import wishlistRouter from "./modules/wishlist/wishlistRoutes.js";
import { globalErrorHandler } from "./shared/lib/ErrorHandler.js";
import announcementRouter from "./modules/announcement/announcementRoutes.js";
dotenv.config();
const app = express();
const allowedOrigins = ["http://localhost:5000", "127.0.0.1:5000", "http://localhost:5173", "http://127.0.0.1:5173", "https://study-notion-two-taupe.vercel.app"];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("Hello, StudyNotion!");
});
const baseRoute = "/api/v1";
app.use(`${baseRoute}/auth`, authRouter);
app.use(`${baseRoute}/profile`, profileRouter);
app.use(`${baseRoute}/users`, userRouter);
app.use(`${baseRoute}/courses`, courseRouter);
app.use(`${baseRoute}/categories`, categoryRouter);
app.use(`${baseRoute}/enrollments`, courseEnrollmentRouter);
app.use(`${baseRoute}/reviews`, reviewRouter);
app.use(`${baseRoute}/sections`, sectionRouter);
app.use(`${baseRoute}/subsections`, subsectionRouter);
app.use(`${baseRoute}/upload/s3`, multipartUploadRoute);
app.use(`${baseRoute}/comments`, CommentRouter);
app.use(`${baseRoute}/wishlists`, wishlistRouter);
app.use(`${baseRoute}/announcements`, announcementRouter);
app.use(`${baseRoute}/signatures`, SignatureGenerationRouter);
app.use(globalErrorHandler);
export default app;
//# sourceMappingURL=app.js.map