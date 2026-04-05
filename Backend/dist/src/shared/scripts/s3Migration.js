import { AbortMultipartUploadCommand, CompleteMultipartUploadCommand, CreateMultipartUploadCommand, GetObjectCommand, ListBucketsCommand, ListObjectsV2Command, S3Client, UploadPartCommand, } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { Readable } from "stream";
dotenv.config();
;
const sourceS3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.OLD_AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.OLD_AWS_SECRET_ACCESS_KEY,
    },
});
const destS3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    requestStreamBufferSize: 65_536,
});
const SOURCE_BUCKET = process.env.OLD_AWS_BUCKET_NAME;
const DEST_BUCKET = process.env.AWS_BUCKET_NAME;
const PART_SIZE = 10 * 1024 * 1024;
async function getAllKeys() {
    const keys = [];
    let continuationToken;
    do {
        const res = await sourceS3.send(new ListObjectsV2Command({
            Bucket: SOURCE_BUCKET,
            ContinuationToken: continuationToken,
        }));
        res.Contents?.forEach((obj) => obj.Key && keys.push(obj.Key));
        continuationToken = res.NextContinuationToken;
    } while (continuationToken);
    return keys;
}
async function streamToChunks(stream, partSize) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        let currentChunk = [];
        let currentSize = 0;
        stream.on("data", (data) => {
            currentChunk.push(data);
            currentSize += data.length;
            if (currentSize >= partSize) {
                chunks.push(Buffer.concat(currentChunk));
                currentChunk = [];
                currentSize = 0;
            }
        });
        stream.on("end", () => {
            if (currentSize > 0) {
                chunks.push(Buffer.concat(currentChunk));
            }
            resolve(chunks);
        });
        stream.on("error", reject);
    });
}
async function migrateOne(key) {
    const { Body, ContentType } = await sourceS3.send(new GetObjectCommand({ Bucket: SOURCE_BUCKET, Key: key }));
    if (!Body)
        throw new Error(`Empty body for key: ${key}`);
    const parts = await streamToChunks(Body, PART_SIZE);
    console.log(`   ${parts.length} parts to upload for ${key}`);
    const { UploadId } = await destS3.send(new CreateMultipartUploadCommand({
        Bucket: DEST_BUCKET,
        Key: key,
        ContentType: ContentType ?? "video/mp4",
    }));
    if (!UploadId)
        throw new Error("Failed to initiate multipart upload");
    const uploadedParts = [];
    try {
        for (let i = 0; i < parts.length; i++) {
            const partNumber = i + 1;
            const part = parts[i];
            if (!part)
                throw new Error(`Missing part ${partNumber}`);
            const { ETag } = await destS3.send(new UploadPartCommand({
                Bucket: DEST_BUCKET,
                Key: key,
                UploadId,
                PartNumber: partNumber,
                Body: part,
                ContentLength: part.length,
            }));
            if (!ETag)
                throw new Error(`No ETag for part ${partNumber}`);
            uploadedParts.push({ PartNumber: partNumber, ETag });
            console.log(`   ✅ Part ${partNumber}/${parts.length} uploaded`);
        }
        await destS3.send(new CompleteMultipartUploadCommand({
            Bucket: DEST_BUCKET,
            Key: key,
            UploadId,
            MultipartUpload: { Parts: uploadedParts },
        }));
    }
    catch (err) {
        await destS3.send(new AbortMultipartUploadCommand({
            Bucket: DEST_BUCKET,
            Key: key,
            UploadId,
        }));
        throw err;
    }
}
async function migrate() {
    console.log("Listing all objects in source bucket...");
    const keys = await getAllKeys();
    console.log(`Found ${keys.length} objects\n`);
    const results = { success: 0, failed: 0, failedKeys: [] };
    for (const key of keys) {
        console.log(`Migrating: ${key}`);
        try {
            await migrateOne(key);
            console.log(`✅ Done: ${key}\n`);
            results.success++;
        }
        catch (err) {
            console.error(`❌ Failed: ${key} — ${err.message}\n`);
            results.failed++;
            results.failedKeys.push(key);
        }
    }
    if (results.failedKeys.length > 0) {
        console.log(`Retrying ${results.failedKeys.length} failed keys...`);
        for (const key of results.failedKeys) {
            try {
                await migrateOne(key);
                console.log(`✅ Retry succeeded: ${key}`);
                results.failed--;
                results.success++;
            }
            catch (err) {
                console.error(`❌ Retry failed permanently: ${key} — ${err.message}`);
            }
        }
    }
    console.log(`\n--- Migration Complete ---`);
    console.log(`✅ Success: ${results.success}`);
    console.log(`❌ Failed:  ${results.failed}`);
}
async function test() {
    console.log("Testing with:");
    console.log("  Region:", process.env.AWS_REGION?.trim());
    console.log("  Key ID:", process.env.AWS_SRC_ACCESS_KEY_ID?.trim().slice(0, 8) + "...");
    console.log("secret:", process.env.AWS_SRC_SECRET_ACCESS_KEY?.trim().slice(0, 4) + "...");
    try {
        const result = await sourceS3.send(new ListBucketsCommand({}));
        console.log("✅ Credentials valid. Buckets:", result.Buckets?.map((b) => b.Name));
    }
    catch (err) {
        console.error("❌ Failed:", err.message);
    }
}
//# sourceMappingURL=s3Migration.js.map