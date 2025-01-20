"use client";

import { getGoldStandardTestScores } from "@/lib/utils/gold-standard-test";
import type { NursingAnalytics, NursingQuestion, NursingTest } from "@config/nursing";
import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type NursingTestContext = {
  userId: string;
  nursingTest: NursingTest;
  questions: NursingQuestion[];
  sessionStarted: boolean;
  setSessionStarted: (started: boolean) => void;
  sessionId: string;
  setSessionId: (id: string) => void;
  recording: boolean;
  setRecording: (recording: boolean) => void;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  currentQuestion: NursingQuestion | null;
  setCurrentQuestion: (question: NursingQuestion | null) => void;
  processing: boolean;
  setProcessing: (processing: boolean) => void;
  analyze: boolean;
  setAnalyze: (analyze: boolean) => void;
  scores: NursingAnalytics[];
  setScores: React.Dispatch<React.SetStateAction<NursingAnalytics[]>>;
  GST: ReturnType<typeof getGoldStandardTestScores>;
};

const Context = createContext<NursingTestContext | undefined>(undefined);

export function NursingTestProvider({
  nursingTest,
  questions,
  userId,
  children,
}: { nursingTest: NursingTest; questions: NursingQuestion[]; userId: string; children: React.ReactNode }) {
  const [currentQuestion, setCurrentQuestion] = useState<NursingQuestion | null>(null);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [count, setCount] = useState(0);
  const [analyze, setAnalyze] = useState(false);
  const [scores, setScores] = useState<NursingAnalytics[]>([]);
  const [GST, setGST] = useState<ReturnType<typeof getGoldStandardTestScores>>(null);

  useEffect(() => {
    if (scores.length === 27) {
      setGST(getGoldStandardTestScores(scores));
    }
  }, [scores]);

  return (
    <Context.Provider
      value={{
        nursingTest,
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
        GST,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useNursingTest() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useNursingTest must be used within a NursingTestProvider");
  }
  return context;
}
