import React, { useEffect, useState } from "react";
import axios from "axios";

const VideoPlayer = ({ videoId }) => {
  const [videoUrl, setVideoUrl] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const res = await axios.get(
        `http://localhost:3000/api/v1/subsections/video/getone/${videoId}`,{
            withCredentials:true
        }
      );

      setVideoUrl(res.data.link);
    };

    fetchVideo();
  }, [videoId]);

  if (!videoUrl) return <p>Loading...</p>;

  return (
    <video
      src={videoUrl}
      controls
      style={{ width: "100%", borderRadius: 8 }}
    />
  );
};

export default VideoPlayer;