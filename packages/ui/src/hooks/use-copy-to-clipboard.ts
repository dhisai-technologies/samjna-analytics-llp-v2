"use client";

import { useState } from "react";
import { toast } from "sonner";

export function useCopyToClipboard(text: string) {
  const [copied, setCopiedState] = useState(false);

  return {
    copied,
    copy: () => {
      if (copied) return;
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
      setCopiedState(true);
      setTimeout(() => {
        setCopiedState(false);
      }, 1000);
    },
  };
}
