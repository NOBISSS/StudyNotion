import { Router } from "express";
import { generateCloudinarySignature, generateS3UploadUrl } from "./generateSignatures.controller.js";

const SignatureGenerationRouter = Router();

SignatureGenerationRouter.post("/cloudinary",generateCloudinarySignature);
SignatureGenerationRouter.post("/s3",generateS3UploadUrl);

export default SignatureGenerationRouter;