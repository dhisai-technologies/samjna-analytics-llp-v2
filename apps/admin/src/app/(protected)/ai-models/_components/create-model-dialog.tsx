"use client";
import { FileUploader } from "@ui/components/file-uploader";
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
import { getErrorMessage } from "@utils/helpers";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createModel } from "../_lib/actions";

export function CreateModelDialog() {
  const [files, setFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) {
      setFiles([]);
    }
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Upload model file</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload model</DialogTitle>
          <DialogDescription>Drag and drop your model here or click to browse.</DialogDescription>
        </DialogHeader>
        <FileUploader maxFiles={1} maxSize={1000 * 1024 * 1024} onValueChange={setFiles} accept={{}} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={files.length === 0}
            onClick={() => {
              const formData = new FormData();
              files.forEach((file) => {
                formData.append("files", file);
              });
              toast.promise(createModel(formData), {
                loading: "Uploading files...",
                success: () => {
                  setOpen(false);
                  return "Model created successfully";
                },
                error: (res) => {
                  setOpen(false);
                  return getErrorMessage(res);
                },
              });
            }}
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
