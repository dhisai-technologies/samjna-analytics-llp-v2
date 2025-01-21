import { generateRandomName } from "./text";

export function getDefaultProfile(str: string) {
  const split = str.split(" ");
  const initials =
    split.length > 1 && split[0]?.[0] && split[1]?.[0] ? `${split[0][0]}${split[1][0]}` : str.slice(0, 2).toUpperCase();

  const firstLetter = initials[0]?.toUpperCase() || "A";
  const colors = [
    { bgColor: "#FDE68A", textColor: "#F59E0B" },
    { bgColor: "#C7D2FE", textColor: "#6366F1" },
    { bgColor: "#FBCFE8", textColor: "#DB2777" },
    { bgColor: "#A5F3FC", textColor: "#06B6D4" },
    { bgColor: "#D8B4FE", textColor: "#9333EA" },
    { bgColor: "#FEE2E2", textColor: "#EF4444" },
    { bgColor: "#E0F2FE", textColor: "#0284C7" },
    { bgColor: "#BBF7D0", textColor: "#16A34A" },
    { bgColor: "#FED7AA", textColor: "#EA580C" },
    { bgColor: "#FECACA", textColor: "#DC2626" },
  ];
  const colorIndex = firstLetter.charCodeAt(0) % colors.length;
  const { bgColor, textColor } = colors[colorIndex] as { bgColor: string; textColor: string };
  return {
    initials,
    bgColor,
    textColor,
  };
}

export function createFileFromBlob(
  blob: Blob,
  fileName?: string,
  fileExtension = "webm",
  mimetype = "video/webm",
): File {
  const name = fileName ? `${fileName}.${fileExtension}` : `${generateRandomName().toLowerCase()}.${fileExtension}`;
  const file = new File([blob], name, { type: mimetype });
  return file;
}
