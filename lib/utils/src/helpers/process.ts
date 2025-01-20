import type { IncomingMessage, Server, ServerResponse } from "node:http";

export function handleProcessErrors(connection: Server<typeof IncomingMessage, typeof ServerResponse>) {
  process.on("uncaughtException", (err) => {
    console.error("💥 UNCAUGHT EXCEPTION");
    console.error(err);
    console.log("🤕 closing server now...");
    process.exit(1);
  });

  process.on("unhandledRejection", (err) => {
    console.error("⛔️ UNHANDLED REJECTION");
    console.error(err);
    console.log("🤕 closing server now...");
    connection.close(() => {
      process.exit(1);
    });
  });

  process.on("SIGTERM", () => {
    console.log("👀 SIGTERM received. Shutting down gracefully..");
    connection.close(() => {
      console.log(" ✅ closed remaining connections");
      process.exit(0);
    });
  });
}
