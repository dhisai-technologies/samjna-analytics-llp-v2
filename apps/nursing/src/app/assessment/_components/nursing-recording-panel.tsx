"use client";
import { useNursingTest } from "@/components/providers/nursing-test-provider";
import { useNursingSession } from "@/lib/hooks/use-nursing-session";
import { BoxReveal } from "@ui/components/box-reveal";
import { LogsPopover } from "@ui/components/logs-popover";
import { MediaCard } from "@ui/components/media-card";
import { MultiStepLoader } from "@ui/components/multi-step-loader";
import { useLogSocket } from "@ui/components/providers/log-socket-provider";
import { Button } from "@ui/components/ui/button";
import { Card } from "@ui/components/ui/card";
import { Label } from "@ui/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@ui/components/ui/radio-group";
import { cn } from "@ui/utils";
import { formatElapsedToTimer } from "@utils/helpers";
import { useEffect, useRef, useState } from "react";
import ReactWebcam from "react-webcam";
import { toast } from "sonner";
import { NursingLanding } from "./nursing-test-landing";

export function NursingRecordingPanel({ userId }: { userId: string }) {
  const {
    nursingTest,
    recording,
    sessionStarted,
    processing,
    setRecording,
    setSessionStarted,
    setProcessing,
    count,
    questions,
    currentQuestion,
    GST,
    analyze,
  } = useNursingTest();
  const { logs } = useLogSocket();
  const { webcamRef, currentMediaRecorderRef, handleAnswer, handleRecording } = useNursingSession(userId);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [breakTimer, setBreakTimer] = useState<number | null>(null);
  const elapsedTimeRef = useRef(elapsedTime);
  const breakTimerRef = useRef<number | null>(null);

  const handleNextQuestionWithBreak = (count: number, answer?: string) => {
    if (count >= 28) {
      breakTimerRef.current = 10;
      setBreakTimer(10);
      const breakInterval = setInterval(() => {
        if (breakTimerRef.current && breakTimerRef.current > 1) {
          breakTimerRef.current -= 1;
          setBreakTimer(breakTimerRef.current);
        } else {
          clearInterval(breakInterval);
          breakTimerRef.current = null;
          setBreakTimer(null);
        }
      }, 1000);
    }
    if (count === 0 || answer) {
      handleAnswer({ answer });
    } else {
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
        handleRecording();
      } else {
        setElapsedTime(elapsedTimeRef.current);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion, handleRecording]);

  return (
    <section className="p-3 relative h-[calc(100vh-theme(spacing.44))] items-center justify-center">
      <div className="relative w-full h-full flex flex-col items-center justify-start gap-3">
        {sessionStarted ? (
          <div className="flex flex-col gap-3 pt-1">
            {/* MEDIA */}
            <div className="flex items-center justify-center gap-3">
              {currentQuestion && !breakTimer && (
                <>
                  {["IMAGE", "AUDIO", "VIDEO"].includes(currentQuestion.type) && currentQuestion?.file && (
                    <MediaCard
                      type={currentQuestion.type as "IMAGE" | "AUDIO" | "VIDEO"}
                      src={currentQuestion.file}
                      className="w-96 lg:w-[700px] xl:w-[800px] 2xl:w-[1000px] aspect-video flex items-center justify-center rounded-lg overflow-hidden"
                      autoplay={true}
                      controls={false}
                      onEnded={() => {
                        if (count === questions.length) {
                          setProcessing(true);
                          setRecording(false);
                          handleRecording();
                        } else {
                          handleNextQuestionWithBreak(count);
                        }
                      }}
                    />
                  )}
                </>
              )}
              <div
                className={cn(
                  "overflow-hidden rounded-xl bg-muted",
                  GST && count === 27 ? "w-96 lg:w-[700px] xl:w-[800px] 2xl:w-[1000px]" : "absolute w-5 h-5 opacity-0",
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
            <div
              className={cn(
                "flex flex-col gap-3 justify-between",
                recording ? (currentQuestion?.type !== "TEXT" ? "h-auto" : "h-32") : "h-40",
              )}
            >
              {/* INITIAL */}
              {!recording && (
                <>
                  <div className="max-w-lg h-full flex flex-col items-start justify-center overflow-hidden">
                    <BoxReveal duration={0.5}>
                      <p className="mt-2 text-sm">
                        Please answer to the questions as <span className="text-primary font-semibold">honestly</span>{" "}
                        as possible. After answering click <span className="text-primary font-semibold">Next</span> to
                        move forward. Some questions may have a{" "}
                        <span className="text-primary font-semibold">time limit</span> and
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
                      <h2 className="text-2xl font-semibold text-white">Next question in {breakTimer}s</h2>
                    </div>
                  ) : (
                    <>
                      {GST && count === 27 ? (
                        <>
                          {/* ALIGN CAMERA */}
                          <div className="max-w-lg h-full flex flex-col items-start justify-center overflow-hidden">
                            <BoxReveal duration={0.5}>
                              <h2 className="text-lg font-semibold">
                                {nursingTest.title}
                                <span className="text-primary">.</span>
                              </h2>
                            </BoxReveal>
                            <BoxReveal duration={0.5}>
                              <p className="mt-2 text-sm">
                                Please align your face with the camera and click{" "}
                                <span className="text-primary font-semibold">Start Recording</span>. Answer each
                                question and click <span className="text-primary font-semibold">Next</span> when ready.
                                Some questions may have a <span className="text-primary font-semibold">time limit</span>{" "}
                                and
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
                          {/* QUESTIONS */}
                          <div className="flex items-start justify-between">
                            <div className="max-w-lg h-full flex flex-col items-start justify-center overflow-hidden">
                              <BoxReveal duration={0.5} key={`${currentQuestion.id}-title`}>
                                <h2 className="text-lg font-semibold">{currentQuestion.title}</h2>
                              </BoxReveal>
                              {currentQuestion.description && (
                                <BoxReveal duration={0.5} key={`${currentQuestion.id}-description`}>
                                  <p className="text-sm text-muted-foreground">{currentQuestion.description}</p>
                                </BoxReveal>
                              )}
                              {currentQuestion.type === "SELECT" &&
                                currentQuestion.options &&
                                currentQuestion.options.length > 0 && (
                                  <BoxReveal duration={0.5} key={`${currentQuestion.id}-select`}>
                                    <RadioGroup onValueChange={setAnswer} className="mt-4">
                                      {currentQuestion.options.map((option) => (
                                        <div className="flex items-center space-x-2" key={option.value}>
                                          <RadioGroupItem value={option.value} id={option.value} />
                                          <Label htmlFor={option.value}>{option.label}</Label>
                                        </div>
                                      ))}
                                    </RadioGroup>
                                  </BoxReveal>
                                )}
                            </div>
                            {currentQuestion.timeLimit > 0 && (
                              <BoxReveal duration={0.5}>
                                <p className="text-sm text-primary font-semibold">
                                  Timer: {formatElapsedToTimer(elapsedTime)}
                                </p>
                              </BoxReveal>
                            )}
                          </div>
                          <div className="flex gap-3 items-center justify-end">
                            <Button
                              onClick={() => {
                                if (currentQuestion.type === "SELECT" && !answer) {
                                  toast.error("Please select an answer");
                                  return;
                                }
                                if (currentQuestion.type === "SELECT" && answer) {
                                  handleNextQuestionWithBreak(count, answer);
                                  setAnswer(null);
                                  return;
                                }
                                if (count === questions.length) {
                                  setProcessing(true);
                                  setRecording(false);
                                  handleRecording();
                                } else {
                                  handleNextQuestionWithBreak(count);
                                }
                              }}
                              className="w-24"
                            >
                              {count === questions.length ? "Finish" : "Next"}
                            </Button>
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
          <NursingLanding />
        )}
      </div>
      {processing && (
        <div className="bg-background absolute inset-0 md:rounded-tl-2xl w-full h-full flex flex-col items-center justify-center gap-3">
          {GST && (
            <Card className="absolute z-20 top-2 left-1/2 -translate-x-1/2 flex items-center gap-3 p-3">
              <dl className="grid gap-3 pb-2 w-full">
                <div className="flex gap-3 items-center justify-between">
                  <dt className="text-muted-foreground">Core Disgust</dt>
                  <dd className="font-medium">{GST.coreDisgust}</dd>
                </div>
                <div className="flex gap-3 items-center justify-between">
                  <dt className="text-muted-foreground">Animal Reminder Disgust</dt>
                  <dd className="font-medium">{GST.animalRemainderDisgust}</dd>
                </div>
                <div className="flex gap-3 items-center justify-between">
                  <dt className="text-muted-foreground">Contaminated based disgust</dt>
                  <dd className="font-medium">{GST.contaminationDisgust}</dd>
                </div>
                <div className="flex gap-3 items-center justify-between">
                  <dt className="text-muted-foreground">Disgust Sensitivity Score (By Interview)</dt>
                  <dd className="font-medium">{GST.disgustSensitivity}</dd>
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
