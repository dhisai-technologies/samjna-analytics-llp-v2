"use client";

import { useStroopTest } from "@/components/providers/stroop-test-provider";
import { analyzeStroopTestVideo, createStroopTestSession, uploadStroopTestAnswer } from "@/lib/actions";
import { useCoreSocket } from "@ui/components/providers/core-socket-provider";
import { useLogSocket } from "@ui/components/providers/log-socket-provider";
import { createFileFromBlob } from "@utils/helpers";
import fixWebmDuration from "fix-webm-duration";
import { useCallback, useEffect, useRef, useState } from "react";
import type ReactWebcam from "react-webcam";
import RecordRTC from "recordrtc";

export function useStroopSession(userId: string) {
  const { joinNursingSession, nursingSession } = useCoreSocket();
  const { connect, disconnect } = useLogSocket();
  const {
    setRecording,
    sessionId,
    setSessionId,
    questions,
    setCurrentQuestion,
    setCount,
    setProcessing,
    count,
    analyze,
    setScores,
  } = useStroopTest();
  const webcamRef = useRef<ReactWebcam>(null);
  const currentMediaRecorderRef = useRef<RecordRTC>(null);
  const [startTime, setStartTime] = useState(0);

  const startRecording = useCallback(() => {
    if (!webcamRef.current?.stream) return;
    //@ts-ignore
    currentMediaRecorderRef.current = new RecordRTC(webcamRef.current.stream, {
      type: "video",
      mimeType: "video/webm",
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 1280000,
      bitsPerSecond: 1280000,
      disableLogs: true,
    });
    currentMediaRecorderRef.current.startRecording();
    setStartTime(Date.now());
  }, []);
  const sendChunk = useCallback(
    (sessionId: string, blob: Blob, duration: number, count: number) => {
      fixWebmDuration(blob, duration, async (seekableBlob) => {
        const file = createFileFromBlob(seekableBlob, `${sessionId}-${count - 27}`);
        const formData = new FormData();
        const question = questions[count - 1];
        formData.append("files", file);
        formData.append("user_id", userId);
        formData.append("uid", sessionId);
        formData.append("count", count.toString());
        formData.append("final", count === questions.length ? "true" : "false");
        if (question) {
          formData.append("question_id", question.id);
        }
        await analyzeStroopTestVideo(formData, analyze);
      });
    },
    [userId, questions, analyze],
  );

  const handleAnswer = useCallback(
    async (data?: Record<string, unknown>) => {
      const nextQuestion = questions[count];
      if (count === 0) {
        if (!nextQuestion) {
          setCurrentQuestion(null);
          setCount(0);
          return;
        }
        setRecording(true);
        const uid = `${Date.now()}`;
        await createStroopTestSession(uid);
        joinNursingSession(uid);
        setSessionId(uid);
        setCurrentQuestion(nextQuestion);
        setCount(1);
        startRecording();
        return;
      }
      if (!data) return;
      const question = questions[count - 1];
      if (question) {
        setScores((scores) => [...scores, { id: question.id, count, answer: data.answer as string }]);
        uploadStroopTestAnswer({ uid: sessionId, question_id: question.id, count, data });
      }
      if (!nextQuestion) {
        setCurrentQuestion(null);
        setCount(0);
        return;
      }
      setCurrentQuestion(nextQuestion);
      setCount((count) => count + 1);
    },
    [
      sessionId,
      count,
      setRecording,
      joinNursingSession,
      setSessionId,
      questions,
      setCurrentQuestion,
      setCount,
      setScores,
      startRecording,
    ],
  );

  const handleRecording = useCallback(() => {
    const nextQuestion = questions[count];
    if (!currentMediaRecorderRef.current) return;
    currentMediaRecorderRef.current.stopRecording(() => {
      if (!currentMediaRecorderRef.current) return;
      const blob = currentMediaRecorderRef.current.getBlob();
      const duration = Date.now() - startTime;
      sendChunk(sessionId, blob, duration, count);
      // Destroy the current recorder
      currentMediaRecorderRef.current?.destroy();
      //@ts-ignore
      currentMediaRecorderRef.current = null;
      if (!nextQuestion) return;
      // Start a new recording for the next chunk
      setTimeout(() => {
        setCurrentQuestion(nextQuestion);
        setCount((count) => count + 1);
        startRecording();
      }, 500);
    });
    if (!nextQuestion) {
      setCurrentQuestion(null);
      setCount(0);
      return;
    }
  }, [sessionId, count, questions, setCurrentQuestion, setCount, sendChunk, startRecording, startTime]);

  // Utter question
  // useEffect(() => {
  //   if (!currentQuestion) return;
  //   const text = currentQuestion.title;
  //   if (text.length === 0) return;
  //   const synth = window.speechSynthesis;
  //   const utterance = new SpeechSynthesisUtterance(text);
  //   if (synth.paused) {
  //     synth.resume();
  //   }
  //   synth.speak(utterance);
  //   return () => {
  //     synth.cancel();
  //   };
  // }, [currentQuestion]);

  // Stop processing on getting session
  useEffect(() => {
    if (nursingSession) {
      setProcessing(false);
    }
  }, [nursingSession, setProcessing]);

  // Connect to log socket
  useEffect(() => {
    if (sessionId) {
      connect(sessionId);
    }
    return () => {
      disconnect();
    };
  }, [sessionId, connect, disconnect]);

  return {
    startTime,
    handleAnswer,
    handleRecording,
    webcamRef,
    currentMediaRecorderRef,
  };
}
