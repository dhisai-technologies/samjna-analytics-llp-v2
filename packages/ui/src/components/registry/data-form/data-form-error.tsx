"use client";

import { cn } from "@ui/utils";
import { CircleX } from "lucide-react";
import * as React from "react";
import { useDataForm } from "./data-form";

const DataFormError = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    const { state } = useDataForm();
    if (!state?.error) {
      return null;
    }
    return (
      <p
        ref={ref}
        className={cn("text-xs font-medium text-destructive flex space-x-1 items-center", className)}
        {...props}
      >
        <CircleX className="w-3 h-3" />
        <span>{state?.error}</span>
      </p>
    );
  },
);

DataFormError.displayName = "DataFormError";

export { DataFormError };
