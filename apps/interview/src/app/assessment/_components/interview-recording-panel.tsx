"use client";
import { useInterview } from "@/components/providers/interview-provider";
import { useInterviewSession } from "@/lib/hooks/use-interview-session";
import { BoxReveal } from "@ui/components/box-reveal";
import { LogsPopover } from "@ui/components/logs-popover";
import { MultiStepLoader } from "@ui/components/multi-step-loader";
import { useLogSocket } from "@ui/components/providers/log-socket-provider";
import { Button } from "@ui/components/ui/button";
import { cn } from "@ui/utils";
import { formatElapsedToTimer } from "@utils/helpers";
import { useEffect, useRef, useState } from "react";
import ReactWebcam from "react-webcam";
import { InterviewLanding } from "./interview-landing";

export function InterviewRecordingPanel({ userId }: { userId: string }) {
  const {
    interview,
    recording,
    sessionStarted,
    processing,
    setRecording,
    setSessionStarted,
    setProcessing,
    count,
    questions,
    currentQuestion,
  } = useInterview();
  const { logs } = useLogSocket();
  const { webcamRef, currentMediaRecorderRef, handleNextQuestion } = useInterviewSession(userId);
  const [elapsedTime, setElapsedTime] = useState(0);

  const elapsedTimeRef = useRef(elapsedTime);

  // Auto advance
  useEffect(() => {
    if (!currentQuestion) return;
    if (currentQuestion.timeLimit === 0) return;
    setElapsedTime(0);
    elapsedTimeRef.current = 0;
    const timer = setInterval(() => {
      elapsedTimeRef.current += 1;
      if (elapsedTimeRef.current >= currentQuestion.timeLimit) {
        clearInterval(timer);
        handleNextQuestion();
      } else {
        setElapsedTime(elapsedTimeRef.current);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [currentQuestion, handleNextQuestion]);

  return (
    <section className="p-3 relative">
      <div className="relative w-full h-full flex flex-col items-center justify-start gap-3">
        {sessionStarted ? (
          <div className="flex flex-col gap-3 pt-1">
            <div className={cn("flex flex-col gap-3 justify-between", recording ? "h-32" : "h-40")}>
              {/* INITIAL + ALIGN CAMERA */}
              {!recording && (
                <>
                  <div className="max-w-lg h-full flex flex-col items-start justify-center overflow-hidden">
                    <BoxReveal duration={0.5}>
                      <h2 className="text-lg font-semibold">
                        {interview.title}
                        <span className="text-primary">.</span>
                      </h2>
                    </BoxReveal>
                    <BoxReveal duration={0.5}>
                      <p className="mt-2 text-sm">
                        Please align your face with the camera and click{" "}
                        <span className="text-primary font-semibold">Start Recording</span>. Answer each question and
                        click <span className="text-primary font-semibold">Next</span> when ready. Some questions may
                        have a <span className="text-primary font-semibold">time limit</span> and
                        <span className="text-primary font-semibold"> auto-advance</span>.
                      </p>
                    </BoxReveal>
                  </div>
                  <div className="flex gap-3 items-center justify-end">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setRecording(false);
                        setSessionStarted(false);
                        currentMediaRecorderRef.current?.reset();
                      }}
                      className="w-32"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleNextQuestion} className="w-32">
                      Start Recording
                    </Button>
                  </div>
                </>
              )}
              {/* QUESTIONS */}
              {recording && currentQuestion && (
                <>
                  <div className="flex items-start justify-between">
                    <div className="max-w-lg h-full flex flex-col items-start justify-center overflow-hidden">
                      <BoxReveal duration={0.5}>
                        <h2 className="text-lg font-semibold">{currentQuestion.title}</h2>
                      </BoxReveal>
                      {currentQuestion.description && (
                        <BoxReveal duration={0.5}>
                          <p className="text-sm text-muted-foreground">{currentQuestion.description}</p>
                        </BoxReveal>
                      )}
                    </div>
                    {currentQuestion.timeLimit > 0 && (
                      <BoxReveal duration={0.5}>
                        <p className="text-sm text-primary font-semibold">Timer: {formatElapsedToTimer(elapsedTime)}</p>
                      </BoxReveal>
                    )}
                  </div>
                  <div className="flex gap-3 items-center justify-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRecording(false);
                        setSessionStarted(false);
                        currentMediaRecorderRef.current?.reset();
                      }}
                      className="w-24"
                    >
                      Cancel
                    </Button>
                    {count === questions.length ? (
                      <Button
                        onClick={() => {
                          setProcessing(true);
                          setRecording(false);
                          handleNextQuestion();
                        }}
                        className="w-24"
                      >
                        Finish
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          handleNextQuestion();
                        }}
                        className="w-24"
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
            {/* MEDIA */}
            <div className="w-96 lg:w-[700px] xl:w-[800px] 2xl:w-[1000px]  rounded-xl bg-muted">
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
          </div>
        ) : (
          <InterviewLanding />
        )}
      </div>
      {processing && (
        <div className="bg-background absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-3">
          <MultiStepLoader loading={processing} duration={2000} />
          <div className="absolute top-10 right-5 z-60">
            <LogsPopover logs={logs} />
          </div>
        </div>
      )}
    </section>
  );
}
