"use client";

import type { Interview, InterviewQuestion } from "@config/interview";
import type React from "react";
import { createContext, useContext, useState } from "react";

type InterviewContext = {
  userId: string;
  interview: Interview;
  questions: InterviewQuestion[];
  sessionStarted: boolean;
  setSessionStarted: (started: boolean) => void;
  sessionId: string;
  setSessionId: (id: string) => void;
  recording: boolean;
  setRecording: (recording: boolean) => void;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  currentQuestion: InterviewQuestion | null;
  setCurrentQuestion: (question: InterviewQuestion | null) => void;
  processing: boolean;
  setProcessing: (processing: boolean) => void;
  analyze: boolean;
  setAnalyze: (analyze: boolean) => void;
};

const Context = createContext<InterviewContext | undefined>(undefined);

export function InterviewProvider({
  interview,
  questions,
  userId,
  children,
}: { interview: Interview; questions: InterviewQuestion[]; userId: string; children: React.ReactNode }) {
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [count, setCount] = useState(0);
  const [analyze, setAnalyze] = useState(false);
  return (
    <Context.Provider
      value={{
        interview,
        userId,
        questions: questions.sort((a, b) => a.order - b.order),
        sessionStarted,
        setSessionStarted,
        sessionId,
        setSessionId,
        recording,
        setRecording,
        count,
        setCount,
        currentQuestion,
        setCurrentQuestion,
        processing,
        setProcessing,
        analyze,
        setAnalyze,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useInterview() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useInterview must be used within a InterviewProvider");
  }
  return context;
}
