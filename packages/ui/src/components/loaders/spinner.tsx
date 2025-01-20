import { cn } from "@ui/utils";

export interface SpinnerProps extends React.HTMLAttributes<SVGElement> {
  caption?: string;
}

export function Spinner({ caption, ...props }: SpinnerProps) {
  const Icon = ({ className, ...props }: React.HTMLAttributes<SVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4 animate-spin", className)}
      {...props}
    >
      <title>Spinner</title>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
  if (caption) {
    return (
      <div className="flex space-x-2">
        <span>{caption}</span>
        <Icon {...props} />
      </div>
    );
  }
  return <Icon {...props} />;
}
