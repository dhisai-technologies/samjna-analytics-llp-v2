import { containerClient } from "@/tools";
import type { MulterBlobFile } from "@/types";

export async function uploadBlob(key: string, file: MulterBlobFile) {
  const blobClient = containerClient.getBlockBlobClient(key);
  await blobClient.uploadData(file.buffer, {
    blockSize: file.size,
    blobHTTPHeaders: {
      blobContentType: file.mimetype,
    },
  });
}

export function getBlobUrl(key: string) {
  const blobClient = containerClient.getBlobClient(key);
  return blobClient.url;
}

export function downloadBlob(key: string) {
  const blobClient = containerClient.getBlobClient(key);
  return blobClient.download(0);
}

export async function deleteBlob(key: string) {
  const blobClient = containerClient.getBlobClient(key);
  await blobClient.delete();
}
