"use client";

import { appConfig } from "@config/ui";
import type React from "react";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

interface LogSocketContextType {
  logs: string[];
  connect: (sessionId: string) => void;
  disconnect: () => void;
}

const LogSocketContext = createContext<LogSocketContextType | undefined>(undefined);

export const LogSocketProvider: React.FC<{ children: React.ReactNode; url: string }> = ({ children, url }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const websocketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(
    (sessionId: string) => {
      websocketRef.current = new WebSocket(
        `${url.replace(/^http/, "ws")}/${appConfig.api.services.analytics}/ws/${sessionId}`,
      );
      websocketRef.current.onopen = () => {
        console.log("Log Socket connected");
      };
      websocketRef.current.onmessage = (event: MessageEvent) => {
        setLogs((prevLogs) => {
          const updatedLogs = [...prevLogs, event.data];
          return updatedLogs;
        });
      };

      websocketRef.current.onclose = () => {
        console.log("Log Socket disconnected");
      };

      websocketRef.current.onerror = (error) => {
        console.error("WebSocket error", error);
      };
    },
    [url],
  );

  const disconnect = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return <LogSocketContext.Provider value={{ logs, connect, disconnect }}>{children}</LogSocketContext.Provider>;
};

export const useLogSocket = (): LogSocketContextType => {
  const context = useContext(LogSocketContext);
  if (!context) {
    throw new Error("useLogSocket must be used within a LogSocketProvider");
  }
  return context;
};
