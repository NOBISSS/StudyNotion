import { Router } from "express";
import { ROLES } from "../../../shared/constants.js";
import { authorizeRoles } from "../../../shared/middlewares/role.middleware.js";
import { abortVideoUpload, completeVideoUpload, generateMultipartPresignedURL, initializeVideoUpload, videoBatchHandler, } from "./videoController.js";
const multipartUploadRoute = Router();
authorizeRoles(ROLES.INSTRUCTOR);
multipartUploadRoute.route("/multipart").post(initializeVideoUpload);
multipartUploadRoute
    .route("/multipart/:uploadId/part")
    .get(generateMultipartPresignedURL);
multipartUploadRoute
    .route("/multipart/:uploadId/complete")
    .post(completeVideoUpload);
multipartUploadRoute.route("/multipart/:uploadId/abort").post(abortVideoUpload);
multipartUploadRoute.route("/multipart/:uploadId/batch").get(videoBatchHandler);
export default multipartUploadRoute;
//# sourceMappingURL=MultipartUploadRoute.js.map