"use client";

import { convertEnumToReadableFormat, formatDateToHumanReadable, getErrorMessage } from "@utils/helpers";
import Link from "next/link";
import { toast } from "sonner";

import { Ellipsis, Eye, LinkIcon, PencilLine, Trash } from "lucide-react";
import { useEffect, useState } from "react";

import type { NursingTest } from "@config/nursing";
import { apps } from "@config/ui";
import { useAuth } from "@ui/components/providers/auth-provider";
import { Badge } from "@ui/components/ui/badge";
import { Button } from "@ui/components/ui/button";
import { Card } from "@ui/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/components/ui/dropdown-menu";
import { useCopyToClipboard } from "@ui/hooks/use-copy-to-clipboard";
import { cn } from "@ui/utils";
import { deleteNursingTest } from "../_lib/actions";
import { UpdateNursingTestSheet } from "./update-nursing-test-sheet";

interface NursingTestCardProps extends React.HTMLAttributes<HTMLDivElement> {
  nursingTest: NursingTest;
}

export function NursingTestCard({ nursingTest, className, ...props }: NursingTestCardProps) {
  const [showUpdateNursingTestSheet, setShowUpdateNursingTestSheet] = useState(false);
  const [started, setStarted] = useState("");
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();
  const { copy } = useCopyToClipboard(`${apps.nursing.url}/auth/assessment?nursingTestId=${nursingTest.id}`);
  useEffect(() => {
    setStarted(formatDateToHumanReadable(nursingTest.startTime, true));
    setMounted(true);
  }, [nursingTest]);
  return (
    <Card className={cn("p-3 flex flex-col space-y-3", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link className="text-lg font-semibold hover:underline" href={`/${nursingTest.id}`}>
            {nursingTest.title}
          </Link>
          <Badge variant="secondary" className="text-[10px] border-muted" role="banner">
            {convertEnumToReadableFormat(nursingTest.level)}
          </Badge>
        </div>
        <UpdateNursingTestSheet
          nursingTest={nursingTest}
          open={showUpdateNursingTestSheet}
          onOpenChange={setShowUpdateNursingTestSheet}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
              <Ellipsis className="size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link href={`/${nursingTest.id}`} className="space-x-2 cursor-pointer">
                <Eye className="w-3 h-3" />
                <span>View</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={copy} className="space-x-2 cursor-pointer">
              <LinkIcon className="w-3 h-3" />
              <span>Copy Link</span>
            </DropdownMenuItem>

            {user?.role === "ORGANIZATION" && (
              <DropdownMenuItem
                onSelect={() => setShowUpdateNursingTestSheet(true)}
                className="space-x-2 cursor-pointer"
              >
                <PencilLine className="w-3 h-3" />
                <span>Update Details</span>
              </DropdownMenuItem>
            )}
            {user?.role === "ORGANIZATION" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="space-x-2 cursor-pointer"
                  onSelect={() => {
                    toast.promise(deleteNursingTest(nursingTest.id), {
                      loading: "Deleting the nursing test...",
                      success: "Deleted the nursing test successfully",
                      error: (err) => getErrorMessage(err),
                    });
                  }}
                >
                  <Trash className="w-3 h-3 text-destructive" />
                  <span className="text-destructive">Delete</span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="text-sm text-muted-foreground">{nursingTest.description}</p>
      <div className="flex">
        <div className="text-xs text-muted-foreground">
          {mounted && (
            <p>
              {started.length > 0 && !started.startsWith("-") ? (
                <>
                  Scheduled In <span className="text-orange-500 font-medium">{started}</span>
                </>
              ) : (
                "Started"
              )}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
