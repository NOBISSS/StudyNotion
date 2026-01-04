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
    console.log("Inside cloudinary function");
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
          console.log("Cloudinary upload error:", error);
          reject(error);
        } else if (result) {
          console.log("Cloudinary upload success:", result);
          resolve(result);
        } else {
          console.log("Cloudinary upload failed with unknown error");
          reject(new Error("Upload Failed with no results"));
        }
      }
    );
    console.log("Function last 2nd line");
    uploadStream.end(fileBuffer);
    console.log("Function end");
  });
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log("File Deletion success",publicId);
  } catch (error) {
    console.log("File Deletion failed");
    return null;
  }
};
