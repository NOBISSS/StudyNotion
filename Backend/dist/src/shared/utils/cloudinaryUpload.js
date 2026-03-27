import {} from "cloudinary";
import cloudinary from "../config/cloudinary.js";
export const uploadToCloudinary = (fileBuffer, folder = "StudyNotion") => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder: folder,
            resource_type: "image",
            transformation: [
                { width: 500, height: 500, crop: "limit" },
                { quality: "auto" },
            ],
        }, (error, result) => {
            if (error) {
                reject(error);
            }
            else if (result) {
                resolve(result);
            }
            else {
                reject(new Error("Upload Failed with no results"));
            }
        });
        uploadStream.end(fileBuffer);
    });
};
export const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    }
    catch (error) {
        return null;
    }
};
//# sourceMappingURL=cloudinaryUpload.js.map