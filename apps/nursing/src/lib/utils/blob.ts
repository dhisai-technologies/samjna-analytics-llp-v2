import { generateRandomName } from "@utils/helpers";

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
