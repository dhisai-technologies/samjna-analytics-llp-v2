import { decrypt } from "@lib/utils/helpers";
import type { AppSocket, SessionData } from "@lib/utils/types";

export const getSocketUser = async (secretKey: string, socket: AppSocket) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split(";")
      .find((c) => c.trim().startsWith("session="))
      ?.split("=")[1];
    if (!token) {
      return;
    }
    let decoded: SessionData | null = null;
    try {
      decoded = await decrypt(token, secretKey);
    } catch (_) {
      return;
    }
    return decoded.id;
  } catch (_) {
    return;
  }
};
