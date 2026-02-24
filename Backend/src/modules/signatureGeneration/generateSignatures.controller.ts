import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import cloudinary from "../../shared/config/cloudinary.js";
import { s3 } from "../../shared/config/s3Config.js";
import { MATERIAL_MAX_FILE_SIZE } from "../../shared/constants.js";
import { StatusCode, type Handler } from "../../shared/types.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export const generateCloudinarySignature: Handler = (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: "uploads",
      },
      process.env.CLOUDINARY_API_SECRET!,
    );

    res.status(StatusCode.Success).json({
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      message: "Cloudinary signature generated successfully",
    });
  } catch (error) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Internal Server Error" });
  }
};
export const generateS3UploadUrl: Handler = async (req, res) => {
  try {
    const { fileName, fileType, fileSize } = req.body;
    if (Number(fileSize) > MATERIAL_MAX_FILE_SIZE) {
      res.status(StatusCode.InputError).json({ message: "File is too large" });
      return;
    }
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,
    });
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
    res.json({
      uploadUrl,
      // fileUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/uploads/${fileName}`,
    });
    return;
  } catch (err) {
    res
      .status(StatusCode.ServerError)
      .json({ message: "Something went wrong from our side" });
    return;
  }
};