"use client";

import { Button } from "@ui/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui/components/ui/tooltip";
import { useHasMounted } from "@ui/hooks/use-has-mounted";
import { cn } from "@ui/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const hasMounted = useHasMounted();
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          onClick={() => {
            setTheme(theme === "light" ? "dark" : "light");
          }}
          size="icon"
          className={cn("rounded-full", className)}
        >
          {hasMounted && (theme === "light" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Theme</TooltipContent>
    </Tooltip>
  );
}
