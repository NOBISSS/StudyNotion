export function convertSecondsToReadingTime(seconds: number): { mmss: string; hhmmss: string } {
    const durationToMMSS = seconds
        ? `${Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0")}:${Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0")}:${Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0")}`
        : "00:00";
      console.log("Video duration mm:ss", durationToMMSS);
      const durationInHHMMSS = seconds
        ? `${Math.floor(seconds / 3600)
            .toString()
            .padStart(2, "0")}:${Math.floor((seconds % 3600) / 60)
            .toString()
            .padStart(2, "0")}:${Math.floor(seconds % 60)
            .toString().padStart(2, "0")}`
        : "00:00:00";
      console.log("Video duration hh:mm:ss", durationInHHMMSS);
      return { mmss: durationToMMSS, hhmmss: durationInHHMMSS };
}