export function convertSecondsToReadingTime(seconds: number): {
  mmss: string;
  hhmmss: string;
} {
  const durationToMMSS = seconds
    ? `${Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0")}:${Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0")}:${Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0")}`
    : "00:00";
  const durationInHHMMSS = seconds
    ? `${Math.floor(seconds / 3600)
        .toString()
        .padStart(2, "0")}:${Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, "0")}:${Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0")}`
    : "00:00:00";
  return { mmss: durationToMMSS, hhmmss: durationInHHMMSS };
}
