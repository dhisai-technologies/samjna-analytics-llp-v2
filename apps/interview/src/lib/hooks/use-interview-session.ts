"use client";

import { createFileFromBlob } from "@/lib/utils/blob";
import { useCoreSocket } from "@ui/components/providers/core-socket-provider";
import { useLogSocket } from "@ui/components/providers/log-socket-provider";
import fixWebmDuration from "fix-webm-duration";
import { useCallback, useEffect, useRef, useState } from "react";
import type ReactWebcam from "react-webcam";
import RecordRTC from "recordrtc";
import { useInterview } from "../../components/providers/interview-provider";
import { analyzeVideo, createInterviewSession } from "../actions";

export function useInterviewSession(userId: string) {
  const { joinInterviewSession, interviewSession } = useCoreSocket();
  const { connect, disconnect } = useLogSocket();
  const {
    interview,
    setRecording,
    sessionId,
    setSessionId,
    questions,
    currentQuestion,
    setCurrentQuestion,
    setCount,
    setProcessing,
    count,
    analyze,
  } = useInterview();
  const webcamRef = useRef<ReactWebcam>(null);
  const currentMediaRecorderRef = useRef<RecordRTC>(null);
  const totalMediaRecorderRef = useRef<RecordRTC>(null);
  const [startTime, setStartTime] = useState(0);

  const startRecording = useCallback((count: number) => {
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
    if (count === 0) {
      //@ts-ignore
      totalMediaRecorderRef.current = new RecordRTC(webcamRef.current.stream, {
        type: "video",
        mimeType: "video/webm",
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 1280000,
        bitsPerSecond: 1280000,
        disableLogs: true,
      });
      totalMediaRecorderRef.current.startRecording();
    }
  }, []);
  const sendChunk = useCallback(
    (sessionId: string, blob: Blob, duration: number, count: number) => {
      fixWebmDuration(blob, duration, async (seekableBlob) => {
        const file = createFileFromBlob(seekableBlob, `${sessionId}-${count}`);
        const formData = new FormData();
        const question = questions[count - 1];
        formData.append("files", file);
        formData.append("user_id", userId);
        formData.append("uid", sessionId);
        formData.append("count", count.toString());
        formData.append("final", count === questions.length ? "true" : "false");
        formData.append("test", interview.level === "INTERMEDIATE" ? "true" : "false");
        if (question) {
          formData.append("question_id", question.id);
        }
        await analyzeVideo(formData, analyze);
        if (count === questions.length) {
          window.location.reload();
        }
      });
    },
    [interview, userId, questions, analyze],
  );

  const handleNextQuestion = useCallback(async () => {
    if (count === 0) {
      setRecording(true);
      const uid = `${Date.now()}`;
      await createInterviewSession(uid, interview.id, userId);
      joinInterviewSession(uid);
      setSessionId(uid);
      startRecording(count);
      const current = questions[count];
      if (!current) return;
      setCurrentQuestion(current);
      setCount(1);
      return;
    }
    if (!currentMediaRecorderRef.current) return;
    const current = questions[count];
    currentMediaRecorderRef.current.stopRecording(() => {
      if (!currentMediaRecorderRef.current) return;
      const blob = currentMediaRecorderRef.current.getBlob();
      const duration = Date.now() - startTime;
      sendChunk(sessionId, blob, duration, count);
      // Destroy the current recorder
      currentMediaRecorderRef.current?.destroy();
      //@ts-ignore
      currentMediaRecorderRef.current = null;
      if (!current) return;
      // Start a new recording for the next chunk
      startRecording(count);
    });
    if (!current) {
      setCurrentQuestion(null);
      setCount(0);
      return;
    }
    setCurrentQuestion(current);
    setCount((count) => count + 1);
  }, [
    sessionId,
    count,
    startTime,
    setRecording,
    interview,
    joinInterviewSession,
    setSessionId,
    questions,
    setCurrentQuestion,
    setCount,
    startRecording,
    userId,
    sendChunk,
  ]);

  // Utter question
  useEffect(() => {
    if (!currentQuestion) return;
    const text = currentQuestion.title;
    if (text.length === 0) return;
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    if (synth.paused) {
      synth.resume();
    }
    synth.speak(utterance);
    return () => {
      synth.cancel();
    };
  }, [currentQuestion]);

  // Stop processing on getting session
  useEffect(() => {
    if (interviewSession) {
      setProcessing(false);
    }
  }, [interviewSession, setProcessing]);

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
    handleNextQuestion,
    webcamRef,
    currentMediaRecorderRef,
  };
}
