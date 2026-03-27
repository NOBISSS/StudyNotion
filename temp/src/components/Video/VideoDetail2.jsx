import React from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";

const VideoDetail2 = () => {
  const { videoId } = useParams();

  return (
    <div style={{
      display: "flex",
      background: "#0A0F1C",
      color: "#fff",
      minHeight: "100vh"
    }}>
      
      {/* LEFT */}
      <div style={{ flex: 3, padding: 20 }}>
        <VideoPlayer videoId={videoId} />
      </div>

      {/* RIGHT (empty for now) */}
      <div style={{
        flex: 1,
        borderLeft: "1px solid #2C333F"
      }}>
        {/* sidebar later */}
      </div>
    </div>
  );
};

export default VideoDetail2;