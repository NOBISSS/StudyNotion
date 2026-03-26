import { useEffect, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

export default function PlyrPlayer({ src }) {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      playerRef.current = new Plyr(videoRef.current, {
        controls: [
          "play",
          "progress",
          "current-time",
          "duration",
          "mute",
          "volume",
          "settings",
          "fullscreen",
        ],
        settings: ["speed"],
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <video ref={videoRef} className="plyr-react plyr" controls>
      <source src={src} type="video/mp4" />
    </video>
  );
}