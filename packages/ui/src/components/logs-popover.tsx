"use client";
import type { PopoverContentProps } from "@radix-ui/react-popover";
import { Button, type ButtonProps } from "@ui/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/components/ui/popover";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { MoveRight } from "lucide-react";

interface LogsPopoverProps extends React.ComponentPropsWithRef<typeof Popover> {
  logs: string[];
  variant?: ButtonProps["variant"];
  side?: PopoverContentProps["side"];
  align?: PopoverContentProps["align"];
}

export function LogsPopover({ logs, side, align = "end", variant, ...props }: LogsPopoverProps) {
  return (
    <Popover {...props}>
      <PopoverTrigger asChild>
        <Button size="sm" variant={variant}>
          <span className="flex items-center space-x-2">
            <span>Logs</span>
            <span className="text-xs">({logs.length})</span>
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" side={side} align={align}>
        <ScrollArea className="h-96 p-2">
          {logs.map((log, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={index} className="flex py-2 items-start text-sm border-b border-border">
              <span className="mr-2 pt-[6px]">
                <MoveRight className="size-2" />
              </span>
              <p>{log}</p>
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
