import { type UploadApiResponse } from "cloudinary";
export declare const uploadToCloudinary: (fileBuffer: Buffer, folder?: string) => Promise<UploadApiResponse>;
export declare const deleteFromCloudinary: (publicId: string) => Promise<null | undefined>;
//# sourceMappingURL=cloudinaryUpload.d.ts.map