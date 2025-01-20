"use client";
import type { NursingTest } from "@config/nursing";
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
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateNursingTest } from "../_lib/actions";
import type { UpdateNursingTestSchema } from "../_lib/validations";

interface UpdateNursingTestSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  nursingTest: NursingTest;
}

export function UpdateNursingTestSheet({ nursingTest, ...props }: UpdateNursingTestSheetProps) {
  const form = useForm<UpdateNursingTestSchema>({
    defaultValues: {
      nursingTestId: nursingTest.id,
      title: nursingTest.title,
      description: nursingTest.description || "",
      level: nursingTest.level,
      startTime: new Date(nursingTest.startTime),
    },
  });

  useEffect(() => {
    form.reset({
      nursingTestId: nursingTest.id,
      title: nursingTest.title,
      description: nursingTest.description || "",
      level: nursingTest.level,
      startTime: new Date(nursingTest.startTime),
    });
  }, [nursingTest, form]);

  const [state, action] = useDataFormState(updateNursingTest, {
    onSuccess: () => {
      form.reset();
      toast.success("Nursing Test updated successfully");
      props.onOpenChange?.(false);
    },
  });

  return (
    <DataFormContainer
      type="sheet"
      title="Update nursing test"
      description="Modify the details below to update the nursing test."
      {...props}
    >
      <DataForm form={form} state={state} action={action} className="flex flex-col gap-3">
        <input hidden {...form.register("nursingTestId")} />
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
        <DataFormSubmission loadingLabel="Updating..." submissionLabel="Update" />
      </DataForm>
    </DataFormContainer>
  );
}
