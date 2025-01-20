"use client";
import { Button } from "@ui/components/ui/button";
import { DialogClose, DialogFooter } from "@ui/components/ui/dialog";
import { SheetClose, SheetFooter } from "@ui/components/ui/sheet";
import { cn } from "@ui/utils";
import { useFormStatus } from "react-dom";
import { match } from "ts-pattern";
import { Icons } from "../../icons";
import { CardFooter } from "../../ui/card";
import { useDataFormContainer } from "./data-form-container";

interface DataFormSubmissionProps {
  submissionLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  hideCancel?: boolean;
  className?: string;
  submissionClassName?: string;
  cancelClassName?: string;
  children?: React.ReactNode;
}

export function DataFormSubmission({
  submissionLabel,
  cancelLabel,
  hideCancel,
  loadingLabel,
  className,
  submissionClassName,
  cancelClassName,
  children,
}: DataFormSubmissionProps) {
  const { pending } = useFormStatus();
  const { type } = useDataFormContainer();
  return match(type)
    .with("dialog", () => (
      <DialogFooter className={cn("gap-2 pt-2 sm:space-x-0 w-full", className)}>
        {children}
        {!hideCancel && (
          <DialogClose asChild>
            <Button type="button" variant="outline" className={cancelClassName}>
              {cancelLabel || "Cancel"}
            </Button>
          </DialogClose>
        )}
        <Button type="submit" disabled={pending} className={submissionClassName}>
          {pending ? (
            <Icons.spinner caption={loadingLabel || "Submitting ..."} />
          ) : (
            <span>{submissionLabel || "Submit"}</span>
          )}
        </Button>
      </DialogFooter>
    ))
    .with("sheet", () => (
      <SheetFooter className={cn("gap-2 pt-2 sm:space-x-0", className)}>
        {children}
        {!hideCancel && (
          <SheetClose asChild>
            <Button type="button" variant="outline" className={cancelClassName}>
              {cancelLabel || "Cancel"}
            </Button>
          </SheetClose>
        )}
        <Button type="submit" disabled={pending} className={submissionClassName}>
          {pending ? (
            <Icons.spinner caption={loadingLabel || "Submitting ..."} />
          ) : (
            <span>{submissionLabel || "Submit"}</span>
          )}
        </Button>
      </SheetFooter>
    ))
    .with("card", () => (
      <CardFooter className={cn("flex justify-end gap-2 pt-2", className)}>
        {children}
        {!hideCancel && (
          <Button type="button" variant="outline" className={cancelClassName}>
            {cancelLabel || "Cancel"}
          </Button>
        )}
        <Button type="submit" disabled={pending} className={submissionClassName}>
          {pending ? (
            <Icons.spinner caption={loadingLabel || "Submitting ..."} />
          ) : (
            <span>{submissionLabel || "Submit"}</span>
          )}
        </Button>
      </CardFooter>
    ))
    .exhaustive();
}
