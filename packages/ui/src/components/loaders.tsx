import { cn } from "@ui/utils";

import { Icons } from "./icons";
import { RotatingLines } from "./loaders/rotating-lines";

export type LoaderProps = React.HTMLAttributes<HTMLDivElement>;

export const Loaders = {
  buttonLoader: ({
    caption,
    className,
    ...props
  }: LoaderProps & {
    caption?: string;
  }) => (
    <div className={cn("flex space-x-2", className)} {...props}>
      <span>{caption}</span>
      <Icons.spinner className="h-4 w-4 animate-spin" />
    </div>
  ),
  wavyBubblesLoader: ({ backgroundColor }: { backgroundColor?: string } = {}) => (
    <div className="flex items-center justify-center gap-0.5">
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
  ),
  pageLoader: ({ className, ...props }: LoaderProps) => (
    <div className={cn("flex items-center justify-center h-screen w-screen", className)} {...props}>
      <RotatingLines />
    </div>
  ),
};
