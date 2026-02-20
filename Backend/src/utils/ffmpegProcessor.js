// backend/ffmpegProcessor.js
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import dotenv from "dotenv";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { s3 } from "./config/s3Config.js";
dotenv.config();
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const BUCKET = process.env.AWS_BUCKET_NAME;

// Download stream from S3 to local file
async function downloadFromS3(key, dest) {
  return new Promise((resolve, reject) => {
    const params = { Bucket: BUCKET, Key: key };
    const stream = s3
      .send(new (require("@aws-sdk/client-s3").GetObjectCommand)(params))
      .then((resp) => {
        const body = resp.Body;
        const ws = fs.createWriteStream(dest);
        body.pipe(ws);
        ws.on("finish", resolve);
        ws.on("error", reject);
      })
      .catch(reject);
  });
}

// Note: s3.send(GetObjectCommand(...)) returns a response whose Body is a Readable stream
// We'll use @aws-sdk/client-s3 GetObjectCommand directly for streaming below

import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Video } from "./models/videoModel.js";

export async function processVideo({ key, videoName }) {
  const tempDir = path.resolve("./temp");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const inputPath = path.join(tempDir, path.basename(key));
  const outputPath = path.join(tempDir, `compressed-${path.basename(key)}.mp4`);

  try {
    // 1) Download from S3 (stream -> file)
    const getCmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const data = await s3.send(getCmd);
    await new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(inputPath);
      data.Body.pipe(writeStream);
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    // 2) Compress with ffmpeg (tune settings as required)
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .videoCodec("libx264")
        .size("1280x?") // maintain aspect ratio, width 1280
        .outputOptions(["-movflags faststart","-preset veryfast", "-crf 28"])
        .on("end", resolve)
        .on("error", reject)
        .save(outputPath);
    });

    // 3) Upload compressed to S3
    const fileStream = fs.createReadStream(outputPath);
    const putCmd = new PutObjectCommand({
      Bucket: BUCKET,
      Key: `compressed/${path.basename(outputPath)}`, // compressed/<filename>
      Body: fileStream,
      ContentType: "video/mp4",
    });
    const s = await s3.send(putCmd);

    // 4) Optional: update DB here if needed (worker shouldn't directly import Video model to keep separation)
    try {
      await mongoose.connect(`${process.env.DATABASE_URI}`);
      const video = await Video.updateOne(
        { fileKey: key },
        {
          $set: {
            fileKey: `compressed/${path.basename(outputPath)}`,
            expiry: Date.now(),
            size:s.Size
          },
        }
      );
    } catch (err) {
      console.log(err);
    }
    // 5) Cleanup
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

    console.log("Compression complete for", key);
    return { compressedKey: `compressed/${path.basename(outputPath)}` };
  } catch (err) {
    console.error("processVideo error:", err);
    // cleanup partially written files
    try {
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    } catch (e) {}
    try {
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    } catch (e) {}
    throw err;
  }
}
