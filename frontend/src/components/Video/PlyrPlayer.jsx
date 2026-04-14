import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { getVideo, markSubsectionAsCompleted, saveVideoProgress } from "../../services/operations/subsectionAPI";

export default function PlyrPlayer({ setCompletedIds, videoSrc, setVideoSrc, setLoadingVideo, setActiveSub }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [video, setVideo] = useState(null);
  useEffect(() => {
    const loadVideo = async () => {
      try {
        const res = await getVideo(videoSrc.subsectionId);
        if (videoSrc?.subsectionId && res) {
          setActiveSub((prev) => ({ ...prev, ...res }));
        }
        setVideo({
          link: res.link,
          startTime: res.videoProgress?.currentTime || 0,
          subSectionId: videoSrc.subsectionId,
          isCompleted: res.videoProgress?.isCompleted || false,
        });
      } catch (err) {
        console.error("VIDEO FETCH ERROR:", err);
        setVideoSrc(null);
      } finally {
        setLoadingVideo(false);
      }
    }
    if (videoSrc?.subsectionId)
      loadVideo();
  }, [videoSrc?.subsectionId]);
  useEffect(() => {
    if (!containerRef.current) return;

    // 🔥 clear container manually (React won't touch inside)
    containerRef.current.innerHTML = `
      <video class="plyr">
        <source src="${video?.link || ""}" type="video/mp4" />
      </video>
    `;

    const videoElement = containerRef.current.querySelector("video");
    videoElement.currentTime = video?.startTime || 0;

    playerRef.current = new Plyr(videoElement, {
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
        } catch (e) {
          console.error("Error destroying Plyr instance:", e);
        }
        playerRef.current = null;
      }
    };
  }, [video?.link, video?.startTime]);
const isSavingRef = useRef(false);
  useEffect(() => {
    if (!playerRef.current || !video) return;

    const handleTimeUpdate = async () => {
  if (!playerRef.current || !video) return;

  // 🚀 Prevent duplicate calls
  if (isSavingRef.current) return;

  if (
    (playerRef.current.currentTime - video.startTime >= 5 &&
      !video.isCompleted) ||
    playerRef.current.ended
  ) {
    isSavingRef.current = true;

    await saveVideoProgress(
      video.subSectionId,
      playerRef.current.currentTime
    );

    setVideo((prev) => ({
      ...prev,
      startTime: playerRef.current.currentTime,
    }));

    if (playerRef.current.ended) {
      setVideo((prev) => ({ ...prev, isCompleted: true }));

      await markSubsectionAsCompleted(video.subSectionId, true);

      setCompletedIds((prev) => new Set(prev).add(video.subSectionId));
    }

    // ⏳ small delay to avoid rapid duplicate triggers
    setTimeout(() => {
      isSavingRef.current = false;
    }, 1000);
  }
};

    // ✅ ADD listener
    playerRef.current.on("timeupdate", handleTimeUpdate);

    // 🔥 CLEANUP (VERY IMPORTANT)
    return () => {
      if (playerRef.current) {
        playerRef.current.off("timeupdate", handleTimeUpdate);
      }
    };

  }, [video?.subSectionId, video?.isCompleted]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
    />
  );
}