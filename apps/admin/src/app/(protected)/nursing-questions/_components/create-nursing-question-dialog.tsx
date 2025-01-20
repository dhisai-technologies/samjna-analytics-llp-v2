"use client";
import { type NursingQuestionType, nursingQuestionTypes } from "@config/nursing";
import {
  DataForm,
  DataFormContainer,
  DataFormError,
  DataFormField,
  DataFormSubmission,
} from "@ui/components/registry/data-form";
import { Button } from "@ui/components/ui/button";
import type { Dialog } from "@ui/components/ui/dialog";
import { Separator } from "@ui/components/ui/separator";
import { useDataFormState } from "@ui/hooks/use-data-form-state";
import { convertEnumToReadableFormat } from "@utils/helpers";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createNursingQuestion } from "../_lib/actions";
import type { CreateNursingQuestionSchema } from "../_lib/validations";

interface CreateNursingQuestionDialogProps extends React.ComponentPropsWithRef<typeof Dialog> {
  order?: number;
}

export function CreateNursingQuestionDialog({ order, ...props }: CreateNursingQuestionDialogProps) {
  const [questionType, setQuestionType] = useState<NursingQuestionType>("TEXT");
  const form = useForm<CreateNursingQuestionSchema>({
    defaultValues: {
      title: "",
      description: "",
      order: order ?? 1,
      timeLimit: 0,
      type: questionType,
    },
  });

  const { type } = form.watch();

  useEffect(() => {
    setQuestionType(type);
  }, [type]);

  const [state, action] = useDataFormState(createNursingQuestion, {
    onSuccess: () => {
      form.reset();
      toast.success("Nursing Question created successfully");
      props.onOpenChange?.(false);
    },
  });

  return (
    <DataFormContainer
      type="dialog"
      title="Create nursing question"
      description="Fill in the details below to create a new nursing question."
      {...props}
    >
      <DataForm form={form} state={state} action={action}>
        <Separator />
        <DataFormField
          name="type"
          type="select"
          label="Type"
          description="Please select question type"
          options={nursingQuestionTypes.map((value) => ({ value, label: convertEnumToReadableFormat(value) }))}
        />
        <Separator />
        <div className="grid grid-cols-2 gap-3">
          <DataFormField name="title" type="text" label="Title" placeholder="What is the question?" />
          <DataFormField name="description" type="text" label="Description (Optional)" placeholder="For some x" />
          {(questionType === "IMAGE" || questionType === "AUDIO" || questionType === "VIDEO") && (
            <DataFormField name="file" type="file" label="file" placeholder="file" />
          )}
          {(questionType === "TEXT" || questionType === "SELECT" || questionType === "IMAGE") && (
            <DataFormField name="timeLimit" type="number" label="Time Limit" placeholder="Time limit" />
          )}
          <DataFormField name="category" type="text" label="Category (Optional)" placeholder="Category" />
          <DataFormField name="order" type="number" label="Order" placeholder="Order" />
          {questionType === "SELECT" && (
            <div className="col-span-2">
              <Separator className="my-2" />
              <DataFormField
                type="array"
                name="options"
                label="Options"
                className="max-w-xl mr-auto"
                description="Add options for the question"
                element={({ field, index, remove }) => (
                  <div key={field.id} className="flex w-full items-center gap-2">
                    <DataFormField type="text" name={`options.${index}.label`} placeholder="Label" className="w-full" />
                    <DataFormField type="text" name={`options.${index}.value`} placeholder="Value" className="w-full" />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                      <Trash className="w-3 h-3" />
                    </Button>
                  </div>
                )}
                renderAppend={({ append }) => (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="max-w-max"
                    onClick={() => append({ value: "" })}
                  >
                    Add option
                  </Button>
                )}
              />
            </div>
          )}
        </div>
        <DataFormError />
        <DataFormSubmission submissionLabel="Create" loadingLabel="Creating..." />
      </DataForm>
    </DataFormContainer>
  );
}
