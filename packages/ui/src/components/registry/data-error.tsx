"use client";

import { Alert, AlertDescription, AlertTitle } from "@ui/components/ui/alert";
import { Badge } from "@ui/components/ui/badge";
import { AlertTriangle, Server } from "lucide-react";
import { CopyToClipboard } from "../copy-to-clipboard";
import { Button } from "../ui/button";

interface ErrorInfo {
  statusCode: number;
  category: "clientError" | "serverError";
  description: string;
}

const errorData: ErrorInfo[] = [
  { statusCode: 400, category: "clientError", description: "Bad Request" },
  { statusCode: 401, category: "clientError", description: "Unauthorized" },
  { statusCode: 403, category: "clientError", description: "Forbidden" },
  { statusCode: 404, category: "clientError", description: "Not Found" },
  { statusCode: 500, category: "serverError", description: "Internal Server Error" },
  { statusCode: 501, category: "serverError", description: "Not Implemented" },
  { statusCode: 502, category: "serverError", description: "Bad Gateway" },
  { statusCode: 503, category: "serverError", description: "Service Unavailable" },
];

export function DataError({ statusCode = 404, message }: { statusCode?: number; message?: string }) {
  const error = errorData.find((e) => e.statusCode === statusCode) || (errorData[3] as ErrorInfo);
  const description = message || error.description;
  return (
    <div className="fixed inset-0 z-[1000] w-screen h-screen bg-background flex items-center justify-center p-4">
      <Alert className="max-w-md w-full bg-background shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <AlertTitle className="text-2xl font-semibold">{error.description}</AlertTitle>
            {error.category === "clientError" ? (
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            ) : (
              <Server className="h-6 w-6 text-red-500" />
            )}
          </div>
          <AlertDescription>
            <p>We encountered an error while processing your request.</p>
          </AlertDescription>
          <div className="flex items-center space-x-2">
            <Badge variant={"destructive"}>{error.category === "clientError" ? "Client Error" : "Server Error"}</Badge>
            <Badge variant="outline">{error.statusCode}</Badge>
          </div>
        </div>
        <div className="p-6 pt-0">
          <div className="relative bg-muted p-4 rounded-lg font-mono text-muted-foreground text-sm">
            <CopyToClipboard text={description} className="absolute top-4 right-4" />
            <p>{description}</p>
          </div>
          <div className="flex mt-6 flex-col items-center justify-center gap-6">
            <Button
              className="rounded-full w-48"
              size="lg"
              onClick={() => {
                window.location.reload();
              }}
            >
              Retry
            </Button>
            <div className="w-full flex justify-between px-3">
              <a href="/" className="text-sm font-medium text-muted-foreground hover:underline">
                Contact Support
              </a>
              <a href="/auth/login" className="text-sm font-medium text-muted-foreground hover:underline">
                Sign in again
              </a>
            </div>
          </div>
        </div>
      </Alert>
    </div>
  );
}
