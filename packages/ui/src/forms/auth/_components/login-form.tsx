"use client";

import type { Module } from "@config/core";
import { cn } from "@ui/utils";
import { useState } from "react";
import { RequestOtpForm } from "./request-otp-form";
import { VerifyOtpForm } from "./verify-otp-form";

interface LoginFormProps extends React.HTMLAttributes<HTMLDivElement> {
  module: Module;
}

export function LoginForm({ module, className, ...props }: LoginFormProps) {
  const [email, setEmail] = useState<string>();
  return (
    <div className={cn("", className)} {...props}>
      {email ? (
        <VerifyOtpForm email={email} setEmail={setEmail} module={module} />
      ) : (
        <RequestOtpForm setEmail={setEmail} module={module} />
      )}
    </div>
  );
}
