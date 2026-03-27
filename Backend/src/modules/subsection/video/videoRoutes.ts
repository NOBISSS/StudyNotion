import { Router } from "express";
import { getVideo, saveVideoProgress } from "./videoController.js";

const videoRouter = Router();

// videoRouter.route("/multipart").post(initializeVideoUpload);
// videoRouter.route("/multipart/:uploadId/part").get(generateMultipartPresignedURL);
// videoRouter.route("/multipart/:uploadId/complete").post(completeVideoUpload);
// videoRouter.route("/multipart/:uploadId/abort").post(abortVideoUpload);
// videoRouter.route("/multipart/:uploadId/batch").get(videoBatchHandler);

videoRouter.route("/getone/:subsectionId").get(getVideo);
videoRouter.route("/saveprogress").post(saveVideoProgress);

export default videoRouter;
