"use client";

import { useCopyToClipboard } from "@ui/hooks/use-copy-to-clipboard";
import { cn } from "@ui/utils";
import { Check, Copy } from "lucide-react";

export const CopyToClipboard: React.FC<{
  className?: string;
  text: string;
  iconClassName?: string;
  children?: React.ReactNode;
}> = ({ className, text, iconClassName, children }) => {
  const { copied, copy } = useCopyToClipboard(text);

  return (
    <button type="button" className={className} onClick={copy}>
      {copied ? (
        <Check className={cn("size-4 text-primary", iconClassName)} />
      ) : (
        <Copy className={cn("size-4 text-primary", iconClassName)} />
      )}
      {children}
    </button>
  );
};
