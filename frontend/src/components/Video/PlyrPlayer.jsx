import { useEffect, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

export default function PlyrPlayer({ src }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 🔥 clear container manually (React won't touch inside)
    containerRef.current.innerHTML = `
      <video class="plyr">
        <source src="${src || ""}" type="video/mp4" />
      </video>
    `;

    const video = containerRef.current.querySelector("video");

    playerRef.current = new Plyr(video, {
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
    });

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {}
        playerRef.current = null;
      }
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
    />
  );
}