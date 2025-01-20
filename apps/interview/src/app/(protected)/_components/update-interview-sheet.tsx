"use client";
import { useForm } from "react-hook-form";

import type { Interview } from "@config/interview";
import {
  DataForm,
  DataFormContainer,
  DataFormError,
  DataFormField,
  DataFormSubmission,
} from "@ui/components/registry/data-form";
import type { Sheet } from "@ui/components/ui/sheet";
import { useDataFormState } from "@ui/hooks/use-data-form-state";
import type React from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { updateInterview } from "../_lib/actions";
import type { UpdateInterviewSchema } from "../_lib/validations";

interface UpdateInterviewSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  interview: Interview;
}

export function UpdateInterviewSheet({ interview, ...props }: UpdateInterviewSheetProps) {
  const form = useForm<UpdateInterviewSchema>({
    defaultValues: {
      interviewId: interview.id,
      title: interview.title,
      description: interview.description || "",
      level: interview.level,
      startTime: new Date(interview.startTime),
    },
  });

  useEffect(() => {
    form.reset({
      interviewId: interview.id,
      title: interview.title,
      description: interview.description || "",
      level: interview.level,
      startTime: new Date(interview.startTime),
    });
  }, [interview, form]);

  const [state, action] = useDataFormState(updateInterview, {
    onSuccess: () => {
      form.reset();
      toast.success("Interview updated successfully");
      props.onOpenChange?.(false);
    },
  });

  return (
    <DataFormContainer
      type="sheet"
      title="Update interview"
      description="Modify the details below to update the interview."
      {...props}
    >
      <DataForm form={form} state={state} action={action} className="flex flex-col gap-3">
        <input hidden {...form.register("interviewId")} />
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
        <DataFormSubmission loadingLabel="Updating..." submissionLabel="Update" />
      </DataForm>
    </DataFormContainer>
  );
}
