import { decrypt } from "@lib/utils/helpers";
import type { AppSocket, SessionData } from "@lib/utils/types";
import type { ExtendedError } from "socket.io";

export const verifySocketAuthentication =
  (secretKey: string) => async (socket: AppSocket, next: (err?: ExtendedError | undefined) => void) => {
    const authError = () => next(new Error("Not authenticated to access"));
    try {
      const token = socket.handshake.headers.cookie
        ?.split(";")
        .find((c) => c.trim().startsWith("session="))
        ?.split("=")[1];
      if (!token) {
        return authError();
      }
      let decoded: SessionData | null = null;
      try {
        decoded = await decrypt(token, secretKey);
      } catch (_) {
        return authError();
      }
      socket.userId = decoded.id;
      return next();
    } catch (_) {
      return authError();
    }
  };
