import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import cloudinary from "../../shared/config/cloudinary.js";
import { s3 } from "../../shared/config/s3Config.js";
import { MATERIAL_MAX_FILE_SIZE } from "../../shared/constants.js";
import { StatusCode, type Handler } from "../../shared/types.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { asyncHandler } from "../../shared/lib/asyncHandler.js";
import { ApiResponse } from "../../shared/lib/ApiResponse.js";
import { AppError } from "../../shared/lib/AppError.js";

export const generateCloudinarySignature = asyncHandler((req, res) => {
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: "uploads",
      },
      process.env.CLOUDINARY_API_SECRET!,
    );

    ApiResponse.success(res, {
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    }, "Cloudinary signature generated successfully");
});
export const generateS3UploadUrl = asyncHandler(async (req, res) => {
    const { fileName, fileType, fileSize } = req.body;
    if (Number(fileSize) > MATERIAL_MAX_FILE_SIZE) {
      throw AppError.badRequest(`File size exceeds the maximum limit of ${MATERIAL_MAX_FILE_SIZE} bytes`);
    }
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,
    });
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    ApiResponse.success(res, {
      uploadUrl,
      // fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/uploads/${fileName}`,
    }, "S3 upload URL generated successfully");
});