"use client";
import {
  DataForm,
  DataFormContainer,
  DataFormError,
  DataFormField,
  DataFormSubmission,
} from "@ui/components/registry/data-form";
import type { Dialog } from "@ui/components/ui/dialog";
import { useDataFormState } from "@ui/hooks/use-data-form-state";
import type React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createInterview } from "../_lib/actions";
import type { CreateInterviewSchema } from "../_lib/validations";

interface CreateInterviewDialogProps extends React.ComponentPropsWithRef<typeof Dialog> {}

export function CreateInterviewDialog(props: CreateInterviewDialogProps) {
  const form = useForm<CreateInterviewSchema>({
    defaultValues: {
      title: "",
      description: "",
      level: "INTERMEDIATE",
      startTime: new Date(),
    },
  });

  const [state, action] = useDataFormState(createInterview, {
    onSuccess: () => {
      form.reset();
      toast.success("Interview created successfully");
      props.onOpenChange?.(false);
    },
  });

  return (
    <DataFormContainer
      type="dialog"
      title="Create interview"
      description="Fill in the details below to create a new interview."
      {...props}
    >
      <DataForm form={form} state={state} action={action} className="flex flex-col gap-3">
        <DataFormField
          type="text"
          name="title"
          label="Title"
          description="Good interviews names are simple and professional"
          placeholder="Interview title"
        />
        <DataFormField type="text" name="description" label="Description (Optional)" />
        <input hidden {...form.register("level")} />
        <input hidden {...form.register("startTime")} />
        <DataFormError />
        <DataFormSubmission loadingLabel="Creating..." submissionLabel="Create" />
      </DataForm>
    </DataFormContainer>
  );
}
