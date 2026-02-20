import { Router } from "express";
import { abortVideoUpload, completeVideoUpload, generateMultipartPresignedURL, getVideo, initializeVideoUpload, videoBatchHandler } from "../controllers/videoController.js";

const videoRouter = Router();

// videoRouter.route("/multipart").post(initializeVideoUpload);
// videoRouter.route("/multipart/:uploadId/part").get(generateMultipartPresignedURL);
// videoRouter.route("/multipart/:uploadId/complete").post(completeVideoUpload);
// videoRouter.route("/multipart/:uploadId/abort").post(abortVideoUpload);
// videoRouter.route("/multipart/:uploadId/batch").get(videoBatchHandler);
videoRouter.route("/getone/:videoId").get(getVideo);

export default videoRouter;