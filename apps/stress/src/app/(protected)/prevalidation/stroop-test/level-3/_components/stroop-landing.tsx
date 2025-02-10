"use client";

import { useStroopTest } from "@/components/providers/stroop-test-provider";
import StroopLandingImage from "@/lib/images/stroop-landing.jpg";
import { Button } from "@ui/components/ui/button";
import { Label } from "@ui/components/ui/label";
import { Switch } from "@ui/components/ui/switch";
import { speakText } from "@utils/helpers";
import { Computer } from "lucide-react";
import Image from "next/image";

export function StroopLanding() {
  const { setSessionStarted, analyze, setAnalyze } = useStroopTest();
  return (
    <div className="relative flex flex-col w-full items-center justify-center h-full gap-3">
      <div className="absolute top-0 right-0 flex items-center gap-3 p-3">
        <div className="flex items-center space-x-2">
          <Switch id="analyze-mode" checked={analyze} onCheckedChange={setAnalyze} disabled />
          <Label htmlFor="analyze-mode">Analyze</Label>
        </div>
      </div>
      <Image src={StroopLandingImage} alt="nursing" height={400} priority />
      <p className="text-sm text-center max-w-lg text-muted-foreground">
        Please make sure that your internet connection is <span className="text-primary font-semibold">stable</span> and
        you are in a quiet environment before starting the nursing test. Once you{" "}
        <span className="text-primary font-semibold">start</span> the recording or{" "}
        <span className="text-primary font-semibold">upload</span> recorded, you will loose the{" "}
        <span className="text-primary font-semibold">access</span> to this page if refreshed or closed.
      </p>
      <Button
        onClick={async () => {
          setSessionStarted(true);
          await speakText(
            "Hello, welcome to the stroop test. Please choose the one of the color from right side screen for each question in 3 seconds each!",
          );
        }}
        className="w-52 mt-10"
      >
        <Computer className="mr-2 size-4" />
        <span>Start Stroop Test</span>
      </Button>
    </div>
  );
}
