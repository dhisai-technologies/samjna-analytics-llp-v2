"use client";
import { format } from "date-fns";

import { CalendarIcon } from "lucide-react";
import type React from "react";
import type { Matcher } from "react-day-picker";
import type { ControllerRenderProps, FieldValues } from "react-hook-form";

import { Button } from "@ui/components/ui/button";
import { Calendar } from "@ui/components/ui/calendar";
import { FormControl } from "@ui/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/components/ui/popover";
import { cn } from "@ui/utils";
import { TimePicker } from "../time-picker/time-picker";

interface InputDateProps<T extends FieldValues> extends React.ComponentPropsWithRef<typeof Popover> {
  type?: "date" | "datetime";
  field: ControllerRenderProps<T>;
  placeholder?: string;
  disabled?: Matcher | Matcher[];
  showSeconds?: boolean;
}

const InputDate = <T extends FieldValues>({
  type,
  field,
  showSeconds,
  placeholder,
  disabled,
  ...props
}: InputDateProps<T>) => {
  if (type === "datetime") {
    return (
      <Popover {...props}>
        <PopoverTrigger asChild className="!mt-2">
          <FormControl>
            <Button
              variant={"outline"}
              className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
            >
              {field.value ? (
                format(field.value, showSeconds ? "PPP HH:mm:ss" : "PPP HH:mm")
              ) : (
                <span>{placeholder || "Pick a date"}</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b border-border flex justify-center">
            <TimePicker setDate={field.onChange} date={field.value} showSeconds={showSeconds} />
          </div>
          <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={disabled} initialFocus />
        </PopoverContent>
      </Popover>
    );
  }
  return (
    <Popover {...props}>
      <PopoverTrigger asChild className="!mt-2">
        <FormControl>
          <Button
            variant={"outline"}
            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
          >
            {field.value ? format(field.value, "PPP") : <span>{placeholder || "Pick a date"}</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={disabled} initialFocus />
      </PopoverContent>
    </Popover>
  );
};

export { InputDate };
