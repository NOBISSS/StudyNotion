import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  S3Client,
  UploadPartCommand,
  type S3ClientConfig,
} from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import { Readable } from "stream";
dotenv.config();
;
const sourceS3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.OLD_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.OLD_AWS_SECRET_ACCESS_KEY!,
  },
});

const destS3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  requestStreamBufferSize: 65_536, // fix for the chunk size error
});

const SOURCE_BUCKET = process.env.OLD_AWS_BUCKET_NAME!;
const DEST_BUCKET = process.env.AWS_BUCKET_NAME!;
const PART_SIZE = 10 * 1024 * 1024; // 10MB per part (minimum is 5MB for multipart)

async function getAllKeys(): Promise<string[]> {
  const keys: string[] = [];
  let continuationToken: string | undefined;
  do {
    const res = await sourceS3.send(
      new ListObjectsV2Command({
        Bucket: SOURCE_BUCKET,
        ContinuationToken: continuationToken,
      }),
    );
    res.Contents?.forEach((obj) => obj.Key && keys.push(obj.Key));
    continuationToken = res.NextContinuationToken;
  } while (continuationToken);
  return keys;
}

// Collect stream into chunks of PART_SIZE for multipart upload
async function streamToChunks(
  stream: Readable,
  partSize: number,
): Promise<Buffer[]> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let currentChunk: Buffer[] = [];
    let currentSize = 0;

    stream.on("data", (data: Buffer) => {
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
        chunks.push(Buffer.concat(currentChunk)); // last chunk (can be smaller)
      }
      resolve(chunks);
    });

    stream.on("error", reject);
  });
}

async function migrateOne(key: string): Promise<void> {
  // 1. Download from source
  const { Body, ContentType } = await sourceS3.send(
    new GetObjectCommand({ Bucket: SOURCE_BUCKET, Key: key }),
  );

  if (!Body) throw new Error(`Empty body for key: ${key}`);

  // 2. Split stream into parts
  const parts = await streamToChunks(Body as Readable, PART_SIZE);
  console.log(`   ${parts.length} parts to upload for ${key}`);

  // 3. Initiate multipart upload on destination
  const { UploadId } = await destS3.send(
    new CreateMultipartUploadCommand({
      Bucket: DEST_BUCKET,
      Key: key,
      ContentType: ContentType ?? "video/mp4",
    }),
  );

  if (!UploadId) throw new Error("Failed to initiate multipart upload");

  const uploadedParts: { PartNumber: number; ETag: string }[] = [];

  try {
    // 4. Upload each part
    for (let i = 0; i < parts.length; i++) {
      const partNumber = i + 1;
      const part = parts[i];
      if (!part) throw new Error(`Missing part ${partNumber}`);

      const { ETag } = await destS3.send(
        new UploadPartCommand({
          Bucket: DEST_BUCKET,
          Key: key,
          UploadId,
          PartNumber: partNumber,
          Body: part,
          ContentLength: part.length,
        }),
      );

      if (!ETag) throw new Error(`No ETag for part ${partNumber}`);
      uploadedParts.push({ PartNumber: partNumber, ETag });
      console.log(`   ✅ Part ${partNumber}/${parts.length} uploaded`);
    }

    // 5. Complete multipart upload
    await destS3.send(
      new CompleteMultipartUploadCommand({
        Bucket: DEST_BUCKET,
        Key: key,
        UploadId,
        MultipartUpload: { Parts: uploadedParts },
      }),
    );
  } catch (err) {
    // Always abort incomplete multipart uploads — they cost money if left hanging
    await destS3.send(
      new AbortMultipartUploadCommand({
        Bucket: DEST_BUCKET,
        Key: key,
        UploadId,
      }),
    );
    throw err;
  }
}

async function migrate() {
  console.log("Listing all objects in source bucket...");
  const keys = await getAllKeys();
  console.log(`Found ${keys.length} objects\n`);

  const results = { success: 0, failed: 0, failedKeys: [] as string[] };

  for (const key of keys) {
    console.log(`Migrating: ${key}`);
    try {
      await migrateOne(key);
      console.log(`✅ Done: ${key}\n`);
      results.success++;
    } catch (err: any) {
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
      } catch (err: any) {
        console.error(`❌ Retry failed permanently: ${key} — ${err.message}`);
      }
    }
  }

  console.log(`\n--- Migration Complete ---`);
  console.log(`✅ Success: ${results.success}`);
  console.log(`❌ Failed:  ${results.failed}`);
}

// migrate();

async function test() {
  console.log("Testing with:");
  console.log("  Region:", process.env.AWS_REGION?.trim());
  console.log(
    "  Key ID:",
    process.env.AWS_SRC_ACCESS_KEY_ID?.trim().slice(0, 8) + "...",
  );
  console.log(
    "secret:",
    process.env.AWS_SRC_SECRET_ACCESS_KEY?.trim().slice(0, 4) + "...",
  );

  try {
    const result = await sourceS3.send(new ListBucketsCommand({}));
    console.log(
      "✅ Credentials valid. Buckets:",
      result.Buckets?.map((b) => b.Name),
    );
  } catch (err: any) {
    console.error("❌ Failed:", err.message);
  }
}