import { cn } from "@ui/utils";

export interface WavyBubblesProps extends React.HTMLAttributes<HTMLDivElement> {
  backgroundColor?: string;
}

export function WavyBubbles({ backgroundColor, className, ...props }: WavyBubblesProps) {
  return (
    <div className={cn("flex items-center justify-center gap-0.5", className)} {...props}>
      <div
        style={{
          backgroundColor: backgroundColor || "hsl(var(--color-primary))",
        }}
        className="h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.3s]"
      />
      <div
        style={{
          backgroundColor: backgroundColor || "hsl(var(--color-primary))",
        }}
        className="h-1.5 w-1.5 animate-bounce rounded-full [animation-delay:-0.15s]"
      />
      <div
        style={{
          backgroundColor: backgroundColor || "hsl(var(--color-primary))",
        }}
        className="h-1.5 w-1.5 animate-bounce rounded-full"
      />
    </div>
  );
}
