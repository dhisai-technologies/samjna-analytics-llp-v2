import { config } from "./env";
import { retrieve } from "./retriever";

export async function uploadPublicFile(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("files", file);
  const response = await retrieve(`${config.CORE_API_URL}/v1/files/upload?isPublic=true`, {
    method: "POST",
    body: formData,
  });
  if (!response.ok) {
    throw new Error("Error uploading image. Please try again.");
  }
  const result = (await response.json()) as {
    data: {
      keys: string[];
    };
  };
  const uid = result.data.keys[0];
  if (!uid) {
    throw new Error("Error uploading image. Please try again.");
  }
  return uid;
}
