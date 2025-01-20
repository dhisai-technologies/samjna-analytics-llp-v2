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
import { createNursingTest } from "../_lib/actions";
import type { CreateNursingTestSchema } from "../_lib/validations";

interface CreateNursingTestDialogProps extends React.ComponentPropsWithRef<typeof Dialog> {}

export function CreateNursingTestDialog(props: CreateNursingTestDialogProps) {
  const form = useForm<CreateNursingTestSchema>({
    defaultValues: {
      title: "",
      description: "",
      level: "INTERMEDIATE",
      startTime: new Date(),
    },
  });

  const [state, action] = useDataFormState(createNursingTest, {
    onSuccess: () => {
      form.reset();
      toast.success("Nursing test created successfully");
      props.onOpenChange?.(false);
    },
  });

  return (
    <DataFormContainer
      type="dialog"
      title="Create nursing test"
      description="Fill in the details below to create a new nursing test."
      {...props}
    >
      <DataForm form={form} state={state} action={action} className="flex flex-col gap-3">
        <DataFormField
          type="text"
          name="title"
          label="Title"
          description="Good nursing tests names are simple and professional"
          placeholder="Nursing test title"
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
