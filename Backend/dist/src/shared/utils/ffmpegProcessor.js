import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";
import dotenv from "dotenv";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { s3 } from "../config/s3Config.js";
dotenv.config();
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);
const BUCKET = process.env.AWS_BUCKET_NAME;
async function downloadFromS3(key, dest) {
    return new Promise((resolve, reject) => {
        const getCmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
        s3.send(getCmd)
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
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Course } from "../../modules/course/CourseModel.js";
import { Section } from "../../modules/section/SectionModel.js";
import { SubSection } from "../../modules/subsection/SubSectionModel.js";
import Video from "../../modules/subsection/video/VideoModel.js";
import { convertSecondsToReadingTime } from "../../modules/subsection/video/videoUtils.js";
export async function processVideo({ key, videoName, s3Location, }) {
    console.log("S3 location:", s3Location);
    const tempDir = path.resolve("./temp");
    if (!fs.existsSync(tempDir))
        fs.mkdirSync(tempDir, { recursive: true });
    const inputPath = path.join(tempDir, path.basename(key));
    const outputPath = path.join(tempDir, `compressed-${path.basename(key)}.mp4`);
    try {
        const getCmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
        const data = await s3.send(getCmd);
        await new Promise((resolve, reject) => {
            const writeStream = fs.createWriteStream(inputPath);
            data.Body.pipe(writeStream);
            writeStream.on("finish", resolve);
            writeStream.on("error", reject);
        });
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .videoCodec("libx264")
                .size("1280x?")
                .outputOptions(["-movflags faststart", "-preset veryfast", "-crf 28"])
                .on("end", resolve)
                .on("error", reject)
                .save(outputPath);
        });
        const fileStream = fs.createReadStream(outputPath);
        const compressedKey = `compressed/${path.basename(outputPath)}`;
        const putCmd = new PutObjectCommand({
            Bucket: BUCKET,
            Key: compressedKey,
            Body: fileStream,
            ContentType: "video/mp4",
        });
        const s = await s3.send(putCmd);
        async function getVideoDuration(filePath) {
            return new Promise((resolve, reject) => {
                ffmpeg.ffprobe(filePath, (err, metadata) => {
                    if (err)
                        return reject(err);
                    const duration = metadata.format.duration;
                    if (typeof duration === "number")
                        resolve(duration);
                    else
                        reject(new Error("Could not get duration"));
                });
            });
        }
        try {
            await mongoose.connect(`${process.env.MONGODB_URI}`);
            const videoDuration = await getVideoDuration(outputPath);
            const video = await Video.findOneAndUpdate({ videoS3Key: key }, {
                $set: {
                    videoS3Key: compressedKey,
                    URLExpiration: Date.now(),
                    videoSize: s.Size || fs.readFileSync(outputPath).byteLength,
                    duration: videoDuration,
                    status: "ready",
                },
            }, { returnDocument: "after" });
            if (!video) {
                throw new Error("Video not found");
            }
            if (!video.isNew) {
                video.videoName = video.tempVideoName;
                video.originalVideoS3Key = video.tempVideoS3Key;
                video.tempVideoName = null;
                video.tempVideoS3Key = null;
                await video.save({ validateBeforeSave: false });
            }
            await SubSection.findByIdAndUpdate(video.subsectionId, {
                $set: { isAvailable: true },
            });
            const course = await Course.findById(video.courseId);
            if (course) {
                course.totalDuration = (course.totalDuration || 0) + videoDuration;
                course.totalLectures >= 0 ? course.totalLectures += 1 : course.totalLectures = 1;
                course.totalSubsections >= 0 ? course.totalSubsections += 1 : course.totalSubsections = 1;
                await course.save();
                course.totalDurationFormatted = convertSecondsToReadingTime(course.totalDuration).hhmmss;
                await course.save();
            }
        }
        catch (err) {
            console.log(err);
        }
        fs.unlinkSync(inputPath);
        fs.unlinkSync(outputPath);
        return { compressedKey: `compressed/${path.basename(outputPath)}` };
    }
    catch (err) {
        console.error("processVideo error:", err);
        try {
            if (fs.existsSync(inputPath))
                fs.unlinkSync(inputPath);
        }
        catch (e) { }
        try {
            if (fs.existsSync(outputPath))
                fs.unlinkSync(outputPath);
        }
        catch (e) { }
        throw err;
    }
}
//# sourceMappingURL=ffmpegProcessor.js.map