import { createServer as createHttpServer } from "node:http";
import { config } from "@/config";
import { client, db } from "@/db";
import { createServer } from "@/server";
import { notifications } from "@lib/database";
import { getSocketUser } from "@lib/utils/helpers";
import type { AppSocket } from "@lib/utils/types";
import { eq } from "drizzle-orm";
import { Server } from "socket.io";

function startServer() {
  const server = createServer();

  const httpServer = createHttpServer(server);

  const io: Server = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin || config.WHITELIST.includes(origin)) {
          callback(null, true);
        } else {
          console.log("Not allowed origin: ", origin);
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    },
    path: `/${config.NAME}/socket.io`,
  });
  io.on("connection", async (socket: AppSocket) => {
    socket.on("join-stress-session", async (uid: string) => {
      socket.join(`stress-session-${uid}`);
    });
    socket.on("join-nursing-session", async (uid: string) => {
      socket.join(`nursing-session-${uid}`);
    });
    socket.on("join-interview-session", async (uid: string) => {
      socket.join(`interview-session-${uid}`);
    });
    socket.userId = await getSocketUser(config.SESSION_SECRET, socket);
    if (!socket.userId) return;
    socket.join(`notification-${socket.userId}`);
    const userNotifications = await db.select().from(notifications).where(eq(notifications.userId, socket.userId));
    socket.emit("notifications", userNotifications);
  });

  httpServer.listen(config.PORT, async () => {
    console.log(`🚀 started ${config.NAME} on [::]:${config.PORT}, url: http://localhost:${config.PORT}`);
    await client.connect();
    console.log("📦 connected to database");
  });

  return io;
}

export const io: Server = startServer();
