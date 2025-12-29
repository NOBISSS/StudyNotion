import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary"

const uploadToCloudinary =
    (fileBuffer:Buffer, folder:string = "StudyNotion"):Promise<string> => {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: 'image',
                    transformation: [
                        { width: 500, height: 500, crop: "limit" },
                        { quality: 'auto' }
                    ]
                },
                (error:UploadApiErrorResponse | undefined, result:UploadApiResponse | undefined) => {
                    if (error) {
                        reject(error);
                    } else if(result?.secure_url) {
                        resolve(result.secure_url);
                    }else{
                        reject(new Error("Upload Failed with no results"));
                    }
                }
            );
            uploadStream.end(fileBuffer);
        });
    }

module.exports = { uploadToCloudinary };