import type { Notification } from "@config/core";
import type { InterviewSession } from "@config/interview";
import type { NursingSession } from "@config/nursing";
import type { StressSession } from "@config/stress";
import { appConfig } from "@config/ui";
import type React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { type Socket, io } from "socket.io-client";

interface CoreSocketContextType {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  stressSession?: StressSession;
  setStressSession: React.Dispatch<React.SetStateAction<StressSession | undefined>>;
  joinStressSession: (uid: string) => void;
  interviewSession?: InterviewSession;
  setInterviewSession: React.Dispatch<React.SetStateAction<InterviewSession | undefined>>;
  joinInterviewSession: (uid: string) => void;
  nursingSession?: NursingSession;
  setNursingSession: React.Dispatch<React.SetStateAction<NursingSession | undefined>>;
  joinNursingSession: (uid: string) => void;
}

const CoreSocketContext = createContext<CoreSocketContextType | undefined>(undefined);

export function CoreSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [stressSession, setStressSession] = useState<StressSession>();
  const [interviewSession, setInterviewSession] = useState<InterviewSession>();
  const [nursingSession, setNursingSession] = useState<NursingSession>();
  const [socket, setSocket] = useState<Socket>();
  const joinStressSession = useCallback(
    (uid: string) => {
      if (!socket) return;
      socket.emit("join-stress-session", uid);
    },
    [socket],
  );
  const joinInterviewSession = useCallback(
    (uid: string) => {
      if (!socket) return;
      socket.emit("join-interview-session", uid);
    },
    [socket],
  );
  const joinNursingSession = useCallback(
    (uid: string) => {
      if (!socket) return;
      socket.emit("join-nursing-session", uid);
    },
    [socket],
  );
  useEffect(() => {
    const socket = io(appConfig.api.socket, {
      path: `/${appConfig.api.services.core}/socket.io`,
      withCredentials: true,
    });
    setSocket(socket);
    socket.on("connect", () => {
      console.log("Connected to notifications socket server");
      socket.on("notifications", (notifications: Notification[]) => {
        setNotifications(notifications);
      });
      socket.on("notification", (notification: Notification) => setNotifications((prev) => [...prev, notification]));
      socket.on("stress-session", (session: StressSession) => {
        setStressSession(session);
      });
      socket.on("interview-session", (session: InterviewSession) => {
        setInterviewSession(session);
      });
      socket.on("nursing-session", (session: NursingSession) => {
        setNursingSession(session);
      });
    });
  }, []);
  return (
    <CoreSocketContext.Provider
      value={{
        notifications,
        setNotifications,
        stressSession,
        setStressSession,
        joinStressSession,
        interviewSession,
        setInterviewSession,
        joinInterviewSession,
        nursingSession,
        setNursingSession,
        joinNursingSession,
      }}
    >
      {children}
    </CoreSocketContext.Provider>
  );
}

export function useCoreSocket() {
  const context = useContext(CoreSocketContext);
  if (!context) {
    throw new Error("useCoreSocket must be used within a CoreSocketProvider");
  }
  return context;
}
