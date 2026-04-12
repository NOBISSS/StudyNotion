import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { getVideo, markSubsectionAsCompleted, saveVideoProgress } from "../../services/operations/subsectionAPI";

export default function PlyrPlayer({ setCompletedIds,videoSrc, setVideoSrc,setLoadingVideo, setActiveSub }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const [video, setVideo] = useState(null);
  useEffect(()=>{
    const loadVideo = async () => {
      try {
        const res = await getVideo(videoSrc.subsectionId);
        if (typeof sub === "string" && res) {
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
    if(videoSrc?.subsectionId)
    loadVideo();
  },[videoSrc?.subsectionId]);
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
  
  useEffect(()=>{
    const handleTimeUpdate = async () => {
      // if(video.isCompleted) return; // Don't save if already marked completed
      if (
        (playerRef.current.currentTime - video.startTime >= 5 &&
          !video.isCompleted) ||
        playerRef.current.ended
      ) {
        // Save progress every 5 seconds
        await saveVideoProgress(
          video.subSectionId,
          playerRef.current.currentTime,
        );
        video.startTime = playerRef.current.currentTime; // Update local startTime to avoid excessive API calls
        if (playerRef.current.ended) {
          setVideo((prev) => ({ ...prev, isCompleted: true })); // Mark as completed if video ended
          await markSubsectionAsCompleted(video.subSectionId, true); // Mark as completed in backend
          setCompletedIds((prev) => new Set(prev).add(video.subSectionId)); // Add to completed set
        }
      }
    }
    playerRef.current.on("timeupdate", handleTimeUpdate);
  }, [video?.subSectionId, video?.isCompleted]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
    />
  );
}