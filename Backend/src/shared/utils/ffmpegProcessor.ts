// backend/ffmpegProcessor.js
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import dotenv from "dotenv";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { s3 } from "../config/s3Config.js";
dotenv.config();
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const BUCKET = process.env.AWS_BUCKET_NAME;

// Download stream from S3 to local file
async function downloadFromS3(key: string, dest: string) {
  return new Promise((resolve, reject) => {
    const getCmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    s3.send(getCmd)
      .then((resp) => {
        const body = resp.Body as NodeJS.ReadableStream;
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
import { Course } from "../../modules/course/CourseModel.js";
import { Section } from "../../modules/section/SectionModel.js";
import { SubSection } from "../../modules/subsection/SubSectionModel.js";
import Video from "../../modules/subsection/video/VideoModel.js";
import { convertSecondsToReadingTime } from "../../modules/subsection/video/videoUtils.js";

export async function processVideo({
  key,
  videoName,
}: {
  key: string;
  videoName: string;
}) {
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
      (data.Body as NodeJS.ReadableStream).pipe(writeStream);
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    // 2) Compress with ffmpeg (tune settings as required)
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .videoCodec("libx264")
        .size("1280x?") // maintain aspect ratio, width 1280
        .outputOptions(["-movflags faststart", "-preset veryfast", "-crf 28"])
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

    async function getVideoDuration(filePath: string): Promise<number> {
      return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err:any, metadata:any) => {
          if (err) return reject(err);
          const duration = metadata.format.duration;
          if (typeof duration === "number") resolve(duration);
          else reject(new Error("Could not get duration"));
        });
      });
    }
    try {
      await mongoose.connect(`${process.env.MONGODB_URI}`);
      const videoDuration = await getVideoDuration(outputPath);
      const video = await Video.findOneAndUpdate(
        { videoS3Key: key },
        {
          $set: {
            videoS3Key: `compressed/${path.basename(outputPath)}`,
            URLExpiration: Date.now(),
            videoSize: s.Size || fs.readFileSync(outputPath).byteLength,
            duration: videoDuration,
            status: "ready",
          },
        },
        { new: true },
      );
      if (!video) {
        throw new Error("Video not found");
      }
      await Section.findByIdAndUpdate(video.sectionId, {
        $push: { subsections: video.subsectionId },
      });
      await SubSection.findByIdAndUpdate(video.subsectionId, {
        $set: { isActive: true },
      });
      const course = await Course.findByIdAndUpdate(
        video.courseId,
        {
          $set: {
            totalDuration: {
              $add: [video.duration || videoDuration, "$totalDuration"],
            },
            totalLectures: {
              $add: [1, "$totalLectures"],
            },
            totalSubsections: { $add: [1, "$totalSubsections"] },
          },
        },
        { new: true },
      );
      if (course) {
      course.totalDurationFormatted = convertSecondsToReadingTime(course.totalDuration).hhmmss;
      await course.save();
      }
    } catch (err) {
      console.log(err);
    }
    // 5) Cleanup
    fs.unlinkSync(inputPath);
    fs.unlinkSync(outputPath);

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
