import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListPartsCommand,
  UploadPartCommand,
  type Part,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Types } from "mongoose";
import path from "path";
import querystring from "querystring";
import { s3 } from "../../../shared/config/s3Config.js";
import { ApiResponse } from "../../../shared/lib/ApiResponse.js";
import { AppError } from "../../../shared/lib/AppError.js";
import { asyncHandler } from "../../../shared/lib/asyncHandler.js";
import { videoQueue } from "../../../shared/queue/videoQueue.js";
import { SubSection } from "../SubSectionModel.js";
import Video from "./VideoModel.js";
import VideoProgress from "./VideoProgressModel.js";
import { videoUploadSchema } from "./videoValidation.js";
import { Section } from "../../section/SectionModel.js";
import { updateUserStreak } from "../../../shared/utils/updateStreak.js";

const BUCKET = process.env.AWS_BUCKET_NAME as string;

export const addVideo = asyncHandler(async (req, res) => {});

export const initializeVideoUpload = asyncHandler(async (req, res) => {
  const parsedVideoData = videoUploadSchema.safeParse(req.body);
  if (!parsedVideoData.success) {
    throw AppError.badRequest(
      parsedVideoData.error.issues[0]?.message || "Invalid video upload data",
    );
  }

  const { filename, type, metadata } = parsedVideoData.data;

  const key = `originals/${Date.now()}-${path.basename(filename)}`;
  let newVideo;
  if(!metadata.isEditing){
  const subsection = await SubSection.create({
    title: metadata.title,
    isPreview: metadata.isPreview,
    contentType: "video",
    courseId: new Types.ObjectId(metadata.courseId),
    sectionId: new Types.ObjectId(metadata.sectionId),
    description: metadata.description || "",
    isActive: true,
    isAvailable: false,
  });
  newVideo = await Video.create({
    videoName: filename,
    videoS3Key: key,
    originalVideoS3Key: key,
    // videoURL,
    type,
    status: "processing",
    courseId: new Types.ObjectId(metadata.courseId),
    sectionId: new Types.ObjectId(metadata.sectionId),
    subsectionId: subsection._id,
    isNew: true,
  });
  await Section.findByIdAndUpdate(metadata.sectionId, {
    $push: { subSectionIds: subsection._id },
  });
} else {
  if (!metadata.subsectionId) {
    throw AppError.badRequest("subsectionId is required for editing");
  }
  const subsection = await SubSection.findOneAndUpdate(
    { _id: new Types.ObjectId(metadata.subsectionId), isActive: true },
    { $set: { title: metadata.title, description: metadata.description, isPreview: metadata.isPreview, isAvailable:false } },
    { returnDocument: "after" }
  );
  if (!subsection) {
    throw AppError.notFound("Subsection not found for editing");
  }
  newVideo = await Video.findOneAndUpdate(
    { subsectionId: new Types.ObjectId(metadata.subsectionId) },
    { $set: { tempVideoName:filename, tempVideoS3Key:key, type, status: "processing",isNew:false } },
  );
  if(!newVideo)
    throw AppError.notFound("Video not found for the given subsection ID");  
}
  const createCmd = new CreateMultipartUploadCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: type || "application/octet-stream",
  });
  const createResp = await s3.send(createCmd);
  const uploadId = createResp.UploadId;

  res.json({
    uploadId,
    key,
    bucket: BUCKET,
    region: process.env.AWS_REGION,
    id: newVideo._id,
  });
});
export const generateMultipartPresignedURL = asyncHandler(async (req, res) => {
  const { uploadId } = req.params;
  const partNumber = Number(req.query.partNumber);
  const key = req.query.key;

  if (!uploadId || !partNumber || !key)
    throw AppError.badRequest("uploadId, partNumber, and key are required");
  if (!uploadId || typeof uploadId !== "string" || !partNumber || !key)
    throw AppError.badRequest("Missing params");

  const cmd = new UploadPartCommand({
    Bucket: BUCKET,
    Key: key.toString(),
    UploadId: uploadId,
    PartNumber: partNumber,
  });

  const presignedUrl = await getSignedUrl(s3, cmd, { expiresIn: 3600 });
  res.json({ url: presignedUrl });
});
export const completeVideoUpload = asyncHandler(async (req, res) => {
  const { uploadId } = req.params;
  // const { key } = req.query;
  // const { parts } = req.body;
  // if (!uploadId || !key || !parts)
  //   return res.status(400).json({ error: "Missing params" });

  // Uppy might send parts as {etag, part} — normalize to ETag/PartNumber
  const key = req.body.key || req.query.key;
  const parts = req.body.parts || req.body.uploadParts || req.body.partsList;

  if (!uploadId || typeof uploadId !== "string" || !key || !parts) {
    throw AppError.badRequest("Missing params");
  }

  const sortedParts = parts
    .map(
      (p: {
        etag: any;
        ETag: any;
        eTag: any;
        part: any;
        partNumber: any;
        PartNumber: any;
      }) => ({
        ETag: p.etag ?? p.ETag ?? p.eTag,
        PartNumber: Number(p.part ?? p.partNumber ?? p.PartNumber),
      }),
    )
    .sort(
      (a: { PartNumber: number }, b: { PartNumber: number }) =>
        a.PartNumber - b.PartNumber,
    );

  const completeCmd = new CompleteMultipartUploadCommand({
    Bucket: BUCKET,
    Key: key,
    UploadId: uploadId,
    MultipartUpload: { Parts: sortedParts },
  });

  const completeResp = await s3.send(completeCmd);

  await videoQueue.add("video-processing", {
    key,
    videoName: key.split("/").pop(),
    s3Location: completeResp.Location,
  });

  res.json({ ...completeResp, key });
});
export const videoBatchHandler = asyncHandler(async (req, res) => {
  const { uploadId } = req.params;
  let { key, partNumbers } = req.query || {};
  if (!uploadId || typeof uploadId !== "string") {
    throw AppError.badRequest("uploadId is required");
  }
  // fallback: parse from originalUrl (robustness for strange clients)
  if ((!partNumbers || !key) && req.originalUrl) {
    const idx = req.originalUrl.indexOf("?");
    if (idx !== -1) {
      const qs = req.originalUrl.slice(idx + 1);
      const parsed = querystring.parse(qs);
      key = key || parsed.key;
      partNumbers = partNumbers || parsed.partNumbers || parsed.partNumbers;
    }
  }

  // handle malformed key that includes '?partNumbers='
  if (
    (!partNumbers || partNumbers === "") &&
    key &&
    typeof key === "string" &&
    key.includes("?partNumbers=")
  ) {
    const [realKey, pnRaw] = key.split("?partNumbers=");
    key = realKey;
    const pnClean = String(pnRaw)?.split("&")[0]?.split("?")[0];
    partNumbers = pnClean;
  }

  if (!key || !partNumbers) {
    throw AppError.badRequest("Missing key or partNumbers");
  }

  const partsRequested = String(partNumbers || "")
    .split(",")
    .map((p) => Number(p))
    .filter((n) => Number.isInteger(n) && n > 0);

  if (!partsRequested.length) {
    throw AppError.badRequest("No valid partNumbers provided");
  }

  const signedParts = await Promise.all(
    partsRequested.map(async (partNumber) => {
      const cmd = new UploadPartCommand({
        Bucket: BUCKET,
        Key: key as string,
        UploadId: uploadId,
        PartNumber: partNumber,
      });
      const url = await getSignedUrl(s3, cmd, { expiresIn: 3600 });
      return { part: partNumber, url };
    }),
  );

  const presignedUrls = signedParts.reduce(
    (acc, { part, url }) => {
      if (!acc) {
        return acc;
      }
      acc[String(part)] = url;
      return acc;
    },
    {} as Record<string, string>,
  );

  res.json({ presignedUrls });
});
export const abortVideoUpload = asyncHandler(async (req, res) => {
  const { uploadId } = req.params;
  const { key } = req.query;
  if (!uploadId || typeof uploadId !== "string" || !key || typeof key !== "string") throw AppError.badRequest("Missing params");
  const abortCmd = new AbortMultipartUploadCommand({
    Bucket: BUCKET,
    Key: key,
    UploadId: uploadId,
  });
  await s3.send(abortCmd);
  const video = await Video.findOne({tempVideoS3Key:key});
  if (!video) {
    throw AppError.internal("Something went wrong while aborting video upload");
  }
  const subsection = await SubSection.findOne({_id:video.subsectionId});
  if(!subsection)
    throw AppError.internal("Something went wrong while aborting video upload");
  if(video.isNew){
  subsection.isActive = false;
  video.isActive = false;
  const section = await Section.findOneAndUpdate({_id:subsection.sectionId},{$pull: { subSectionIds: subsection._id },})
}else{
  video.tempVideoName = null;
  video.tempVideoS3Key = null;
  video.status = "ready";
  subsection.isAvailable = true;
}
await video.save({validateBeforeSave:false});
await subsection.save({validateBeforeSave:false})
  res.json({ ok: true });
});
export const RestartVideoUpload = asyncHandler(async (req, res, next) => {
  const { uploadId } = req.params;
  const { key } = req.query;

  if (
    !uploadId ||
    typeof uploadId !== "string" ||
    !key ||
    typeof key !== "string"
  ) {
    throw AppError.badRequest("Missing params");
  }

  const parts: Part[] = [];

  function listPartsPage(startsAt: number | undefined = undefined) {
    // ← number not string
    s3.send(
      new ListPartsCommand({
        Bucket: BUCKET,
        Key: key as string,
        UploadId: uploadId as string,
        PartNumberMarker: startsAt?.toString(),
      }),
      (err, data) => {
        if (err) {
          next(err);
          return;
        }
        if (data && data.Parts) {
          parts.push(...data.Parts);
        }

        if (data?.IsTruncated && data?.NextPartNumberMarker) {
          listPartsPage(Number(data.NextPartNumberMarker)); // ← cast to number
        } else {
          res.json(parts);
        }
      },
    );
  }

  listPartsPage();
});
export const getVideo = asyncHandler(async (req, res) => {
  // const { start, end } = req.query;
  const { subsectionId } = req.params;
  // if (start === undefined || end === undefined) {
  //   return res
  //     .status(400)
  //     .json({ message: "start and end query params are required" });
  // }
  if (!subsectionId || typeof subsectionId !== "string") {
    throw AppError.badRequest("SubSection ID is required");
  }
  const subsection = await SubSection.findOne({
    _id: new Types.ObjectId(subsectionId),
    isActive: true,
  });
  if (!subsection) {
    throw AppError.notFound("Subsection not found");
  }
  const video = await Video.findOne({
    subsectionId: new Types.ObjectId(subsectionId),
    // isActive: true,
  });
  if (!video) {
    throw AppError.notFound("Video not found for this subsection");
  }
  let videoProgress = await VideoProgress.findOne({
    videoId: video._id,
    userId: req.user._id,
    subSectionId: new Types.ObjectId(subsectionId),
  });
  if (!videoProgress) {
    videoProgress = await VideoProgress.create({
      videoId: video._id,
      userId: req.user._id,
      subSectionId: new Types.ObjectId(subsectionId),
      courseId: subsection.courseId,
      currentTime: 0,
      watchedPercentage: 0,
      isCompleted: false,
      duration: video.duration || 0,
    });
  }
  const headData = await s3.send(
    new HeadObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: video.videoS3Key,
    }),
  );
  const fileSize = headData.ContentLength;
  const CHUNK_SIZE = 1024 * 1024; // 1MB
  const start = 0;
  const end = 1048575;
  // const start = Number(range.re  place(/\D/g, ""));
  // const end = Math.min(start + CHUNK_SIZE - 1, fileSize - 1);
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    // Range: `bytes=${start}-${end}`,
    Key: video.videoS3Key,
  });
  const commandResponse = await s3.send(command);
  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
  // video.link = signedUrl;
  // await video.save({ validateBeforeSave: false });
  ApiResponse.success(
    res,
    { video, link: signedUrl, subsection, videoProgress },
    "Video fetched successfully",
  );
  // res.json({ video, link: signedUrl,subsection });
});
export const saveVideoProgress = asyncHandler(async (req, res) => {
  const { currentTime, subsectionId, duration } = req.body;

  if (
    currentTime === undefined ||
    !subsectionId ||
    typeof currentTime !== "number" ||
    typeof subsectionId !== "string"
  ) {
    throw AppError.badRequest(
      "currentTime (number) and subsectionId (string) are required",
    );
  }

  const userId = req.userId; // fix: use req.userId not req.user._id
  if (!userId) throw AppError.unauthorized("User ID is required");

  const userObjectId = new Types.ObjectId(userId);

  const video = await Video.findOne({
    subsectionId: new Types.ObjectId(subsectionId),
    // fix: removed isActive — VideoProgress has no isActive field
  });
  if (!video) throw AppError.notFound("Video not found for this subsection");

  const videoDuration = video.duration || duration || 0;
  const watchedPercentage =
    videoDuration > 0
      ? Math.min(Math.floor((currentTime / videoDuration) * 100), 100)
      : 0;
  const isCompleted = videoDuration > 0 && currentTime / videoDuration >= 0.95;

  let videoProgress = await VideoProgress.findOne(
    {
      userId: userObjectId,
      subSectionId: new Types.ObjectId(subsectionId),
      videoId: video._id,
      courseId: video.courseId,
    });
    if(videoProgress){
      videoProgress.currentTime = currentTime;
      videoProgress.watchedPercentage = watchedPercentage;
      videoProgress.duration = videoDuration;
      if(isCompleted && !videoProgress.isCompleted){
        videoProgress.isCompleted = true;
      }
      await videoProgress.save();
    }else{
      videoProgress = await VideoProgress.create({
        userId: userObjectId,
        subSectionId: new Types.ObjectId(subsectionId),
        videoId: video._id,
        courseId: video.courseId,
        currentTime,
        watchedPercentage,
        isCompleted,
        duration: videoDuration,
      });
    }
  // fix: only update streak if meaningful watch time (> 30 seconds)
  if (currentTime > 30) {
    await updateUserStreak(
      userObjectId,
      currentTime / 3600, // fix: watched time not remaining time
    );
  }

  ApiResponse.success(res, videoProgress, "Video progress saved successfully");
});
