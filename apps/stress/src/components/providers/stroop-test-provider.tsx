"use client";
import type { StroopTestAnalytics, StroopTestQuestion } from "@config/stress";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type StroopTestContext = {
  userId: string;
  questions: StroopTestQuestion[];
  sessionStarted: boolean;
  setSessionStarted: (started: boolean) => void;
  sessionId: string;
  setSessionId: (id: string) => void;
  recording: boolean;
  setRecording: (recording: boolean) => void;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  currentQuestion: StroopTestQuestion | null;
  setCurrentQuestion: (question: StroopTestQuestion | null) => void;
  processing: boolean;
  setProcessing: (processing: boolean) => void;
  analyze: boolean;
  setAnalyze: (analyze: boolean) => void;
  scores: StroopTestAnalytics[];
  setScores: React.Dispatch<React.SetStateAction<StroopTestAnalytics[]>>;
  stroopScore: number | undefined;
};

const Context = createContext<StroopTestContext | undefined>(undefined);

export function StroopTestProvider({
  questions,
  userId,
  children,
}: { questions: StroopTestQuestion[]; userId: string; children: React.ReactNode }) {
  const [currentQuestion, setCurrentQuestion] = useState<StroopTestQuestion | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [count, setCount] = useState(0);
  const [analyze, setAnalyze] = useState(false);
  const [scores, setScores] = useState<StroopTestAnalytics[]>([]);
  const [stroopScore, setStroopScore] = useState<number | undefined>();

  useEffect(() => {
    if (scores.length !== questions.length) return;
    const score = questions.reduce((acc, question) => {
      const analytics = scores.find((q) => q.id === question.id);
      return question.answer.toString() === analytics?.answer?.toString() ? acc + 1 : acc;
    }, 0);
    setStroopScore(score);
  }, [scores, questions]);

  return (
    <Context.Provider
      value={{
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
        scores,
        setScores,
        stroopScore,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useStroopTest() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useStroopTest must be used within a StroopTestProvider");
  }
  return context;
}
