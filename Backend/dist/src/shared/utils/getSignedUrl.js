import { DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/s3Config.js";
export const generateSignedUrl = async (key) => {
    const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    });
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 60 });
    return signedUrl;
};
export const deleteObject = async (key) => {
    const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
    });
    await s3.send(deleteCommand);
};
//# sourceMappingURL=getSignedUrl.js.map