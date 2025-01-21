"use client";

import { StressTestAnalytics } from "@/components/stress-analytics/stress-test-analytics";
import { TypewriterEffectSmooth } from "@/components/typewriter-effect";
import { analyzeStressVideo, createStressSession } from "@/lib/actions";
import StressLanding from "@/lib/images/stress-landing.png";
import { type Word, stressQuestions } from "@config/stress";
import { FileUploader } from "@ui/components/file-uploader";
import { useAuth } from "@ui/components/providers/auth-provider";
import { useCoreSocket } from "@ui/components/providers/core-socket-provider";
import { useLogSocket } from "@ui/components/providers/log-socket-provider";
import { Button } from "@ui/components/ui/button";
import { Card, CardContent, CardHeader } from "@ui/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/components/ui/dialog";
import { createFileFromBlob } from "@utils/helpers";
import fixWebmDuration from "fix-webm-duration";
import { HardDriveUpload, History, TvMinimalPlay } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ReactWebcam from "react-webcam";
import RecordRTC from "recordrtc";
import { toast } from "sonner";
import { MultiStepLoader } from "./multi-step-loader";

export default function VideoSession() {
  const [recording, setRecording] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [count, setCount] = useState(0);
  const [words, setWords] = useState<Word[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const webcamRef = useRef<ReactWebcam>(null);
  const currentMediaRecorderRef = useRef<RecordRTC>(null);
  const totalMediaRecorderRef = useRef<RecordRTC>(null);
  const { stressSession, setStressSession, joinStressSession } = useCoreSocket();
  const { user } = useAuth();
  const [totalStartTime, setTotalStartTime] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [sessionId, setSessionId] = useState("");
  const { connect, disconnect, logs } = useLogSocket();
  const downloadEntireVideo = (sessionId: string) => {
    if (!totalMediaRecorderRef.current) return;
    totalMediaRecorderRef.current.stopRecording(() => {
      if (!totalMediaRecorderRef.current) return;
      const blob = totalMediaRecorderRef.current.getBlob();
      const duration = Date.now() - totalStartTime;
      fixWebmDuration(blob, duration, async (seekableBlob) => {
        const url = URL.createObjectURL(seekableBlob);
        const anchor = document.createElement("a");
        anchor.style.display = "none";
        anchor.href = url;
        anchor.download = `${sessionId}_video.webm`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
        toast.success("Video downloaded successfully");
      });
      // Destroy the current recorder
      totalMediaRecorderRef.current?.destroy();
      //@ts-ignore
      totalMediaRecorderRef.current = null;
    });
  };
  const startRecording = (count: number) => {
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
      setTotalStartTime(Date.now());
    }
  };
  const handleNext = async (sessionId: string, count: number, time: number) => {
    if (count === 0) {
      setRecording(true);
      const uid = `${Date.now()}`;
      await createStressSession(uid);
      joinStressSession(uid);

      setSessionId(uid);
      startRecording(count);
      const current = stressQuestions[count];
      if (!current) return;
      setWords(current);
      setCount(1);
      return;
    }
    if (!currentMediaRecorderRef.current) return;
    const current = stressQuestions[count];
    currentMediaRecorderRef.current.stopRecording(() => {
      if (!currentMediaRecorderRef.current) return;
      const blob = currentMediaRecorderRef.current.getBlob();
      const duration = Date.now() - time;
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
      setWords([]);
      setCount(0);
      return;
    }
    setWords(current);
    setCount((count) => count + 1);
  };
  const sendChunk = (sessionId: string, blob: Blob, duration: number, count: number) => {
    fixWebmDuration(blob, duration, async (seekableBlob) => {
      const file = createFileFromBlob(seekableBlob);
      const formData = new FormData();
      formData.append("files", file);
      formData.append("user_id", user.id.toString());
      formData.append("uid", sessionId);
      formData.append("count", count.toString());
      formData.append("final", count === stressQuestions.length ? "true" : "false");
      if (count === stressQuestions.length) {
        downloadEntireVideo(sessionId);
      }
      await analyzeStressVideo(formData);
    });
  };
  useEffect(() => {
    const text = words.map((word) => word.text).join(" ");
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
  }, [words]);
  useEffect(() => {
    if (stressSession) {
      setProcessing(false);
    }
  }, [stressSession]);
  useEffect(() => {
    if (user.email.length === 0) {
      window.location.href = `${window.location.origin}/site`;
    }
  }, [user]);
  useEffect(() => {
    if (sessionId) {
      connect(sessionId);
    }
    return () => {
      disconnect();
    };
  }, [sessionId, connect, disconnect]);
  return (
    <>
      {!stressSession ? (
        <div className="relative w-full h-full flex flex-col items-center justify-center gap-3">
          {sessionStarted ? (
            <Card className="p-3 w-[75vw]">
              <CardHeader className="px-3 py-0 flex flex-col gap-3">
                {!recording ? (
                  <>
                    <div className="h-20 bg-muted flex flex-row justify-center items-center rounded-xl px-2">
                      <p className="text-sm text-muted-foreground text-center">
                        Please align your face to the <span className="text-primary">center</span> of your camera, and
                        click on <span className="text-primary">start recording</span>. A series of questions will be
                        asked, please click on <span className="text-primary">next</span> once you feel you have
                        answered the question to the best of your ability.
                      </p>
                    </div>
                    <div className="grid gap-3 grid-cols-2">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setRecording(false);
                          setSessionStarted(false);
                          currentMediaRecorderRef.current?.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => handleNext(sessionId, 0, Date.now())}>Start Recording</Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="h-20 bg-muted flex flex-row justify-center items-center rounded-xl">
                      <p className="font-semibold mr-3">AI: </p>
                      <TypewriterEffectSmooth
                        className="items-center my-0 pb-5 mt-2"
                        words={words}
                        cursorClassName="!h-6 mt-2"
                      />
                    </div>
                    <div className="grid gap-3 grid-cols-3">
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setRecording(false);
                          setSessionStarted(false);
                          currentMediaRecorderRef.current?.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          setRecording(false);
                          setCount(0);
                          setWords([]);
                          setStressSession(undefined);
                          currentMediaRecorderRef.current?.reset();
                          handleNext(sessionId, 0, Date.now());
                          setProcessing(false);
                        }}
                        variant="outline"
                      >
                        Restart Recording
                      </Button>
                      {count === stressQuestions.length ? (
                        <Button
                          onClick={() => {
                            setProcessing(true);
                            setRecording(false);
                            handleNext(sessionId, count, startTime);
                          }}
                        >
                          Analyze
                        </Button>
                      ) : (
                        <Button onClick={() => handleNext(sessionId, count, startTime)}>Next Question</Button>
                      )}
                    </div>
                  </>
                )}
              </CardHeader>
              <CardContent className="pt-3 pb-0 px-0">
                <div className="w-[calc(75vw-theme(spacing.6))] rounded-xl bg-muted">
                  <ReactWebcam
                    className="rounded-xl w-full"
                    ref={webcamRef}
                    audio={true}
                    videoConstraints={{
                      width: 1280,
                      height: 720,
                      facingMode: "user",
                    }}
                    muted={true}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Button asChild className="fixed top-16 right-3" variant="secondary">
                <Link href="/sessions">
                  <History className="size-5 text-primary" />
                  <span className="font-semibold">Previous Session</span>
                </Link>
              </Button>
              <Image src={StressLanding} alt="sesison" className="w-60 mb-10" />
              <Button onClick={() => setSessionStarted(true)} className="w-52">
                <TvMinimalPlay className="mr-2 size-4" />
                <span>Start Live Session</span>
              </Button>
              <p className="text-muted-foreground">or</p>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-52">
                    <HardDriveUpload className="mr-2 size-4" />
                    <span>Inference Existing</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Upload a file</DialogTitle>
                    <DialogDescription>Drag and drop your file here or click to browse.</DialogDescription>
                  </DialogHeader>
                  <FileUploader
                    maxFiles={1}
                    maxSize={1000 * 1024 * 1024}
                    onValueChange={setFiles}
                    accept={{ "video/*": [] }}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      disabled={files.length === 0}
                      onClick={async () => {
                        if (files.length === 0) {
                          toast.error("Please select a file");
                          return;
                        }
                        if (files.length > 1) {
                          toast.error("Please select only one file");
                          return;
                        }
                        const file = files[0];
                        if (!file) {
                          toast.error("Please select a file");
                          return;
                        }
                        const formData = new FormData();
                        const uid = `${Date.now()}`;
                        setOpen(false);
                        setProcessing(true);
                        await createStressSession(uid);
                        joinStressSession(uid);

                        setSessionId(uid);
                        formData.append("files", file);
                        formData.append("user_id", user.id.toString());
                        formData.append("uid", uid);
                        formData.append("count", "1");
                        formData.append("final", "true");
                        await analyzeStressVideo(formData);
                      }}
                    >
                      Upload
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 w-full p-3 h-full">
          <StressTestAnalytics session={stressSession} liveLogs={logs} />
        </div>
      )}
      {processing && (
        <div className="bg-background md:rounded-tl-2xl relative w-full h-full flex flex-col items-center justify-center gap-3">
          <div className="fixed inset-0 bg-background">
            <MultiStepLoader loading={processing} duration={2000} />
          </div>
        </div>
      )}
    </>
  );
}
