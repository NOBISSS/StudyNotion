import {
  type UploadApiErrorResponse,
  type UploadApiResponse,
} from "cloudinary";
import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  folder: string = "StudyNotion"
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    console.log("Uploading to Cloudinary...");
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
        transformation: [
          { width: 500, height: 500, crop: "limit" },
          { quality: "auto" },
        ],
      },
      (
        error: UploadApiErrorResponse | undefined,
        result: UploadApiResponse | undefined
      ) => {
        console.log("Cloudinary upload callback invoked");
        if (error) {
          console.log("Cloudinary Upload Error:", error);
          reject(error);
        } else if (result) {
          console.log("Cloudinary Upload Success:", result);
          resolve(result);
        } else {
          console.log("Cloudinary Upload Error: No result returned");
          reject(new Error("Upload Failed with no results"));
        }
      }
    );
    console.log("Piping file buffer to Cloudinary...");
    uploadStream.end(fileBuffer);
    console.log("File buffer piped to Cloudinary, waiting for response...");
  });
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    return null;
  }
};
