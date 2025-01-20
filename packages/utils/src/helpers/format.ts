import { formatDuration, intervalToDuration } from "date-fns";

export const formatDateToHumanReadable = (time: Date, future?: boolean) => {
  const start = future ? Date.now() : new Date(time).getTime();
  const end = future ? new Date(time).getTime() : Date.now();
  const durations = intervalToDuration({
    start,
    end,
  });
  if (end - start < 3600 * 1000) {
    return formatDuration(durations, {
      format: ["hours", "minutes", "seconds"],
    });
  }
  if (end - start >= 3600 * 24 * 365.25 * 1000) {
    return formatDuration(durations, {
      format: ["years"],
    });
  }
  return formatDuration(durations, {
    format: ["hours", "days", "weeks", "months", "years"],
  });
};

export const formatElapsedToTimer = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return [hours, minutes, secs].map((unit) => String(unit).padStart(2, "0")).join(":");
};

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(decimals)} ${
    sizeType === "accurate" ? (accurateSizes[i] ?? "Bytest") : (sizes[i] ?? "Bytes")
  }`;
}
