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
        if (error) {
          reject(error);
        } else if (result?.secure_url) {
          resolve(result);
        } else {
          reject(new Error("Upload Failed with no results"));
        }
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    // console.log("File Deletion success",publicId);
  } catch (error) {
    console.log("File Deletion failed");
    return null;
  }
};