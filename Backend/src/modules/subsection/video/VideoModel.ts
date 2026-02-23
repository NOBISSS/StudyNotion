//  videoProgress{
//     videoProgressId ObjectId pk
//     userId ObjectId fk
//     videoId ObjectId fk
//     courseId ObjectId fk
//     subSectionId ObjectId fk
//     isCompleted boolean
//     lastWatchedTime string //"12:35
//     watchedPercentage number // 0-100
//     updatedAt timestamp
//   }

//   VideoAsset {
//     videoId ObjectId pk
//     courseId ObjectId fk
//     instructorId ObjectId fk
//     sourceUrl string  // original uploaded file location (S3 key)
//     masterPlaylistUrl string   // S3/CloudFront URL for master.m3u8 (relative key)
//     status enum["uploaded","processing","ready","failed"]
//     createdAt timestamp
//     updatedAt timestamp
//     variants [{     // list of generated variants
//       resolution: string,     // "360p"
//       bandwidth: number,      // e.g. 800000
//       playlistUrl: string,    // S3/CloudFront URL to variant playlist (relative key)
//     }]
//   }

import { Schema, model } from "mongoose";

const VideoSchema = new Schema(
  {
    videoName: String,
    videoS3Key: { type: String, required: true },
    videoURL: { type: String },
    status: String,
    URLExpiration: Date,
    videoSize: Number,
    subsectionId: { type: Schema.Types.ObjectId, ref: "SubSection" },
  },
  {
    timestamps: true,
  },
);

const Video = model("Video", VideoSchema);

export default Video;
