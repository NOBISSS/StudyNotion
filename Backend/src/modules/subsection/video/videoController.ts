import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  HeadObjectCommand,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import path from "path";
import querystring from "querystring";
import { s3 } from "../../../shared/config/s3Config.js";
import { AppError } from "../../../shared/lib/AppError.js";
import { asyncHandler } from "../../../shared/lib/asyncHandler.js";
import { videoQueue } from "../../../shared/queue/videoQueue.js";
import Video from "./VideoModel.js";
import { Types } from "mongoose";
import { SubSection } from "../SubSectionModel.js";

const BUCKET = process.env.AWS_BUCKET_NAME;

export const addVideo = asyncHandler(async (req, res) => {});
export const initializeVideoUpload = asyncHandler(async (req, res) => {
  const { filename, contentType } = req.body;
  console.log(req.body);
  if (!filename) throw AppError.badRequest("Filename is required");

  const key = `originals/${Date.now()}-${path.basename(filename)}`;
  const subsection = await SubSection.create({
    title: "Course Introducton",
    isPreview: true,
    contentType: "video",
    courseId: new Types.ObjectId("69c3a5205b2f3dcdfcd16bf0"),
    sectionId: new Types.ObjectId("69c3a5f9e02a4bedf94606e0"),
  });
  const newVideo = await Video.create({
    videoName: filename,
    videoS3Key: key,
    // videoURL,
    status: "uploaded",
    courseId: new Types.ObjectId("69c3a5205b2f3dcdfcd16bf0"),
    subsectionId: subsection._id,
  });
  const createCmd = new CreateMultipartUploadCommand({
    Bucket: BUCKET,
    Key: key,
    ContentType: contentType || "application/octet-stream",
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
  if (!uploadId || !partNumber || !key)
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
  console.log("Body on complete: ", req.body);
  // const { key } = req.query;
  // const { parts } = req.body;
  // if (!uploadId || !key || !parts)
  //   return res.status(400).json({ error: "Missing params" });

  // Uppy might send parts as {etag, part} — normalize to ETag/PartNumber
  const key = req.body.key || req.query.key;
  const parts = req.body.parts || req.body.uploadParts || req.body.partsList;

  if (!uploadId || !key || !parts) {
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

  await videoQueue.add("compress-video", {
    key,
    videoName: key.split("/").pop(),
    s3Location: completeResp.Location,
  });

  res.json({ ...completeResp, key });
});
export const videoBatchHandler = asyncHandler(async (req, res) => {
  const { uploadId } = req.params;
  let { key, partNumbers } = req.query || {};

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
  const { key } = req.body;
  if (!uploadId || !key) throw AppError.badRequest("Missing params");
  const abortCmd = new AbortMultipartUploadCommand({
    Bucket: BUCKET,
    Key: key,
    UploadId: uploadId,
  });
  await s3.send(abortCmd);
  res.json({ ok: true });
});
export const getVideo = asyncHandler(async (req, res) => {
  // const { start, end } = req.query;
  const { videoId } = req.params;
  // if (start === undefined || end === undefined) {
  //   return res
  //     .status(400)
  //     .json({ message: "start and end query params are required" });
  // }
  const video = await Video.findById(videoId);
  if (!video) {
    return res.status(404).json({ message: "Video not found!" });
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
  res.json({ video, link: signedUrl });
});
