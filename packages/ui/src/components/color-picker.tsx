"use client";

import type { ButtonProps } from "@ui/components/ui/button";
import { Button } from "@ui/components/ui/button";
import { Input } from "@ui/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/components/ui/popover";
import { useForwardedRef } from "@ui/hooks/use-forwarded-ref";
import { cn } from "@ui/utils";
import { forwardRef, useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

const ColorPicker = forwardRef<HTMLInputElement, Omit<ButtonProps, "value" | "onChange" | "onBlur"> & ColorPickerProps>(
  ({ disabled, value, onChange, onBlur, name, className, id, ...props }, forwardedRef) => {
    const ref = useForwardedRef(forwardedRef);
    const [open, setOpen] = useState(false);

    const parsedValue = useMemo(() => {
      return value || "#FFFFFF";
    }, [value]);

    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
          <Button
            {...props}
            className={cn("block", className)}
            name={name}
            onClick={() => {
              setOpen(true);
            }}
            size="icon"
            style={{
              backgroundColor: parsedValue,
            }}
            variant="outline"
          >
            <div />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full space-y-2">
          <HexColorPicker color={parsedValue} onChange={onChange} />
          <Input
            id={id}
            maxLength={7}
            onChange={(e) => {
              onChange(e?.currentTarget?.value);
            }}
            ref={ref}
            value={parsedValue}
          />
        </PopoverContent>
      </Popover>
    );
  },
);
ColorPicker.displayName = "ColorPicker";

export { ColorPicker };
