"use client";
import { useStroopTest } from "@/components/providers/stroop-test-provider";
import { useStroopSession } from "@/lib/hooks/use-stroop-session";
import { BoxReveal } from "@ui/components/box-reveal";
import { LogsPopover } from "@ui/components/logs-popover";
import { MultiStepLoader } from "@ui/components/multi-step-loader";
import { useLogSocket } from "@ui/components/providers/log-socket-provider";
import { Button } from "@ui/components/ui/button";
import { Card } from "@ui/components/ui/card";
import { cn } from "@ui/utils";
import { formatElapsedToTimer } from "@utils/helpers";
import { useEffect, useRef, useState } from "react";
import ReactWebcam from "react-webcam";
import { toast } from "sonner";
import { StroopLanding } from "./stroop-landing";

export function StroopRecordingPanel({ userId }: { userId: string }) {
  const {
    recording,
    sessionStarted,
    processing,
    setRecording,
    setSessionStarted,
    setProcessing,
    count,
    questions,
    currentQuestion,
    analyze,
    stroopScore,
  } = useStroopTest();
  const { logs } = useLogSocket();
  const { webcamRef, currentMediaRecorderRef, handleAnswer, handleRecording } = useStroopSession(userId);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [breakTimer, setBreakTimer] = useState<number | null>(null);
  const elapsedTimeRef = useRef(elapsedTime);
  const breakTimerRef = useRef<number | null>(null);

  const handleNextQuestionWithBreak = (count: number, answer?: string) => {
    if (questions.length !== count) {
      breakTimerRef.current = 500;
      setBreakTimer(500);
      const breakInterval = setInterval(() => {
        if (breakTimerRef.current && breakTimerRef.current > 100) {
          breakTimerRef.current -= 100;
          setBreakTimer(breakTimerRef.current);
        } else {
          clearInterval(breakInterval);
          breakTimerRef.current = null;
          setBreakTimer(null);
        }
      }, 100);
    }
    handleAnswer({ answer: answer ? answer : "1400" });
    setAnswer(null);
    if (count === questions.length) {
      setProcessing(true);
      setRecording(false);
      handleRecording();
    }
  };

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
        const autoAdvance = new CustomEvent("handleAutoAdvance");
        window.dispatchEvent(autoAdvance);
      } else {
        setElapsedTime(elapsedTimeRef.current);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion]);

  useEffect(() => {
    const autoAdvance = () => {
      handleAnswer({ answer: answer ? answer : "1400" });
      setAnswer(null);
      if (count === questions.length) {
        handleRecording();
        setProcessing(true);
        setRecording(false);
      }
    };
    window.addEventListener("handleAutoAdvance", autoAdvance);

    return () => {
      window.removeEventListener("handleAutoAdvance", autoAdvance);
    };
  }, [handleAnswer, answer, count, questions, handleRecording, setProcessing, setRecording]);

  return (
    <section className="p-3 relative h-[calc(100vh-theme(spacing.44))] items-center justify-center">
      <div className="relative w-full h-full flex flex-col items-center justify-start gap-3">
        {sessionStarted ? (
          <div className="flex flex-col gap-3 pt-1">
            {/* MEDIA */}
            <div className="flex items-center justify-center gap-3">
              <div
                className={cn(
                  "overflow-hidden rounded-xl bg-muted",
                  count === 0 ? "w-96 lg:w-[700px] xl:w-[800px] 2xl:w-[1000px]" : "absolute w-5 h-5 opacity-0",
                )}
              >
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
            {/* CONTROLS AND CONTENT */}
            <div className={cn("flex flex-col gap-3 justify-between", recording ? "h-32" : "h-40")}>
              {/* INITIAL */}
              {!recording && (
                <>
                  <div className="max-w-lg h-full flex flex-col items-start justify-center overflow-hidden">
                    <BoxReveal duration={0.5}>
                      <p className="mt-2 text-sm">
                        Please choose the colors from{" "}
                        <span className="text-primary font-semibold">right side screen</span> as fast as possible. After
                        answering click <span className="text-primary font-semibold">Next</span> to move forward.
                        Questions will have a <span className="text-primary font-semibold">time limit</span> and
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
                    <Button onClick={() => handleNextQuestionWithBreak(count)} className="w-32">
                      Continue
                    </Button>
                  </div>
                </>
              )}
              {recording && currentQuestion && (
                <>
                  {/* BREAK TIMER */}
                  {breakTimer !== null ? (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                      <h2 className="text-2xl font-semibold text-white">Next question in {breakTimer / 1000}s</h2>
                    </div>
                  ) : (
                    <>
                      {count === 0 ? (
                        <>
                          {/* ALIGN CAMERA */}
                          <div className="max-w-lg h-full flex flex-col items-start justify-center overflow-hidden">
                            <BoxReveal duration={0.5}>
                              <p className="mt-2 text-sm">
                                Please align your face with the camera and click{" "}
                                <span className="text-primary font-semibold">Start Recording</span>. Answer each
                                question and click <span className="text-primary font-semibold">Next</span> when ready.
                                Questions will have a{" "}
                                <span className="text-primary font-semibold">time limit of 4 seconds</span> and
                                <span className="text-primary font-semibold"> auto-advance</span>.
                              </p>
                            </BoxReveal>
                          </div>
                          <div className="flex gap-3 items-center justify-end">
                            <Button onClick={handleRecording} className="w-32">
                              Start Recording
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* QUESTION */}
                          <div className="h-full space-y-3">
                            <BoxReveal duration={0.5} key={`${currentQuestion.id}-title`}>
                              <div className="flex items-center justify-between w-96 lg:w-[800px] xl:w-[1000px] 2xl:w-[1200px]">
                                <p className="text-lg font-semibold">{currentQuestion.title}</p>
                                <div className="flex flex-col items-end justify-center gap-3">
                                  <Button
                                    onClick={() => {
                                      if (!answer) {
                                        toast.error("Please select an answer");
                                        return;
                                      }
                                      handleNextQuestionWithBreak(count, answer);
                                    }}
                                    className="w-24"
                                  >
                                    {count === questions.length ? "Finish" : "Next"}
                                  </Button>
                                  <p className="text-sm text-muted-foreground font-semibold">
                                    Timer: {formatElapsedToTimer(elapsedTime)}
                                  </p>
                                </div>
                              </div>
                            </BoxReveal>
                            <BoxReveal duration={0.5} key={`${currentQuestion.id}-question`}>
                              <div className="grid grid-cols-2 gap-3 min-h-96 w-96 lg:w-[800px] xl:w-[1000px] 2xl:w-[1200px]">
                                <div className="flex flex-col items-center justify-center p-3 rounded-md bg-neutral-800">
                                  <p
                                    style={{
                                      color: currentQuestion.source.color,
                                    }}
                                    className="text-center font-semibold text-7xl"
                                  >
                                    {currentQuestion.source.label}
                                  </p>
                                </div>
                                <div className="grid grid-cols-3 gap-3 p-6 text-center bg-neutral-800 rounded-md place-items-center">
                                  {currentQuestion.destination.map((destination) => (
                                    <button
                                      type="button"
                                      key={destination.id}
                                      style={{
                                        color: destination.color,
                                      }}
                                      className={cn(
                                        "text-center font-semibold text-2xl p-2 border w-full rounded-md",
                                        answer === destination.id
                                          ? "bg-neutral-800 border-neutral-400"
                                          : "bg-neutral-900 border-neutral-600",
                                      )}
                                      onClick={() => setAnswer(destination.id)}
                                    >
                                      {destination.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </BoxReveal>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          <StroopLanding />
        )}
      </div>
      {processing && (
        <div className="bg-background absolute inset-0 h-[calc(100vh-theme(spacing.44))] z-50 w-full flex flex-col items-center justify-center gap-3">
          {stroopScore !== undefined && (
            <Card className="absolute z-20 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center gap-3 p-3 w-96">
              <dl className="grid gap-3 pb-2 w-full">
                <div className="flex gap-3 items-center justify-between">
                  <dt className="text-muted-foreground">Correct Answers</dt>
                  <dd className="font-medium">{stroopScore}</dd>
                </div>
                <div className="flex gap-3 items-center justify-between">
                  <dt className="text-muted-foreground">Total Questions</dt>
                  <dd className="font-medium">{questions.length}</dd>
                </div>
                <div className="flex gap-3 items-center justify-between">
                  <dt className="text-muted-foreground">Accuracy</dt>
                  <dd className="font-medium">{((stroopScore / questions.length) * 100).toFixed(2)}%</dd>
                </div>
              </dl>
            </Card>
          )}
          {analyze && (
            <>
              <MultiStepLoader loading={processing} duration={2000} />
              <div className="absolute top-10 right-5 z-60">
                <LogsPopover logs={logs} />
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
