import { Router } from "express";
import { abortVideoUpload, completeVideoUpload, generateMultipartPresignedURL, initializeVideoUpload, videoBatchHandler } from "../controllers/videoController.js";

const multipartUploadRoute = Router();

multipartUploadRoute.route("/multipart").post(initializeVideoUpload);
multipartUploadRoute.route("/multipart/:uploadId/part").get(generateMultipartPresignedURL);
multipartUploadRoute.route("/multipart/:uploadId/complete").post(completeVideoUpload);
multipartUploadRoute.route("/multipart/:uploadId/abort").post(abortVideoUpload);
multipartUploadRoute.route("/multipart/:uploadId/batch").get(videoBatchHandler);

export default multipartUploadRoute;