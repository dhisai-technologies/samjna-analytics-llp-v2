"use client";

import type { User } from "@config/core";
import { Toaster } from "@ui/components/ui/sonner";
import { TooltipProvider } from "@ui/components/ui/tooltip";
import type React from "react";
import { AuthProvider } from "./auth-provider";
import { CoreSocketProvider } from "./core-socket-provider";
import { ThemeModeProvider } from "./theme-mode-provider";

export function GlobalProvider({
  user,
  children,
}: {
  user?: User;
  children: React.ReactNode;
}): JSX.Element {
  if (!user) {
    return (
      <ThemeModeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <CoreSocketProvider>{children}</CoreSocketProvider>
        </TooltipProvider>
        <Toaster richColors />
      </ThemeModeProvider>
    );
  }
  return (
    <ThemeModeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <TooltipProvider>
        <CoreSocketProvider>
          <AuthProvider user={user}>{children}</AuthProvider>
        </CoreSocketProvider>
      </TooltipProvider>
      <Toaster richColors />
    </ThemeModeProvider>
  );
}
