"use client";

import { useNursingTest } from "@/components/providers/nursing-test-provider";
import { analyzeNursingVideo, createNursingSession } from "@/lib/actions";
import NursingLandingImg from "@/lib/images/nursing-landing.png";
import { FileUploader } from "@ui/components/file-uploader";
import { useCoreSocket } from "@ui/components/providers/core-socket-provider";
import { Button } from "@ui/components/ui/button";
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
import { Label } from "@ui/components/ui/label";
import { Switch } from "@ui/components/ui/switch";
import { speakText } from "@utils/helpers";
import { Computer, HardDriveUpload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export function NursingLanding() {
  const { joinNursingSession } = useCoreSocket();
  const { nursingTest, setSessionStarted, setProcessing, setSessionId, userId, analyze, setAnalyze } = useNursingTest();
  const [showFileUploadDialog, setShowFileUploadDialog] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div className="relative flex flex-col w-full items-center justify-center h-full gap-3">
      <div className="absolute top-0 right-0 flex items-center gap-3 p-3">
        <div className="flex items-center space-x-2">
          <Switch id="analyze-mode" checked={analyze} onCheckedChange={setAnalyze} />
          <Label htmlFor="analyze-mode">Analyze</Label>
        </div>
      </div>
      <Image src={NursingLandingImg} alt="nursing" height={400} priority />
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
          await speakText("Hello, welcome to the nursing test. Please answer the questions as honestly as possible!");
        }}
        className="w-52 mt-10"
      >
        <Computer className="mr-2 size-4" />
        <span>Start Nursing Test</span>
      </Button>
      <p className="text-muted-foreground">or</p>
      <Dialog open={showFileUploadDialog} onOpenChange={setShowFileUploadDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-52">
            <HardDriveUpload className="mr-2 size-4" />
            <span>Upload Recorded</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Upload a file</DialogTitle>
            <DialogDescription>Drag and drop your file here or click to browse.</DialogDescription>
          </DialogHeader>
          <FileUploader maxFiles={1} maxSize={1000 * 1024 * 1024} onValueChange={setFiles} accept={{ "video/*": [] }} />
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
                setShowFileUploadDialog(false);
                setProcessing(true);
                await createNursingSession(uid, nursingTest.id, userId);
                joinNursingSession(uid);

                setSessionId(uid);
                formData.append("files", file);
                formData.append("user_id", `${userId}`);
                formData.append("uid", uid);
                formData.append("count", "1");
                formData.append("final", "true");
                formData.append("test", nursingTest.level === "INTERMEDIATE" ? "true" : "false");
                formData.append("question_id", "combined");
                await analyzeNursingVideo(formData);
              }}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
