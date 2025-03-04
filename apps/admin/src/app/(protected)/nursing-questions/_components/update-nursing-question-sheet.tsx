"use client";
import { type NursingQuestion, type NursingQuestionType, nursingQuestionTypes } from "@config/nursing";
import {
  DataForm,
  DataFormContainer,
  DataFormError,
  DataFormField,
  DataFormSubmission,
} from "@ui/components/registry/data-form";
import { Button } from "@ui/components/ui/button";
import { Separator } from "@ui/components/ui/separator";
import type { Sheet } from "@ui/components/ui/sheet";
import { useDataFormState } from "@ui/hooks/use-data-form-state";
import { convertEnumToReadableFormat } from "@utils/helpers";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateNursingQuestion } from "../_lib/actions";
import type { UpdateNursingQuestionSchema } from "../_lib/validations";

interface UpdateNursingQuestionSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  question: NursingQuestion;
}

export function UpdateNursingQuestionSheet({ question, ...props }: UpdateNursingQuestionSheetProps) {
  const [questionType, setQuestionType] = useState<NursingQuestionType>(question.type);
  const form = useForm<UpdateNursingQuestionSchema>({
    defaultValues: {
      coreNursingQuestionId: question.id,
      title: question.title,
      description: question.description || "",
      category: question.category || "",
      order: question.order,
      timeLimit: question.timeLimit,
      type: question.type,
      options: question.options || [],
    },
  });

  const { type } = form.watch();

  useEffect(() => {
    setQuestionType(type);
  }, [type]);

  useEffect(() => {
    form.reset({
      coreNursingQuestionId: question.id,
      title: question.title,
      description: question.description || "",
      category: question.category || "",
      order: question.order,
      timeLimit: question.timeLimit,
      type: question.type,
      options: question.options || [],
    });
    setQuestionType(question.type);
  }, [question, form]);

  const [state, action] = useDataFormState(updateNursingQuestion, {
    onSuccess: () => {
      form.reset();
      toast.success("Nursing Question updated successfully");
      props.onOpenChange?.(false);
    },
  });

  return (
    <DataFormContainer
      type="sheet"
      title="Update nursing question"
      description="Modify the details below to update the nursing question."
      {...props}
    >
      <DataForm form={form} state={state} action={action}>
        <input hidden {...form.register("coreNursingQuestionId")} />
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
          <DataFormField name="description" type="text" label="Description" placeholder="For some x" />
          {(questionType === "IMAGE" || questionType === "AUDIO" || questionType === "VIDEO") && (
            <DataFormField name="file" type="file" label="file" placeholder="file" />
          )}
          {(questionType === "TEXT" || questionType === "SELECT" || questionType === "IMAGE") && (
            <DataFormField name="timeLimit" type="number" label="Time Limit" placeholder="Time limit" />
          )}
          <DataFormField name="category" type="text" label="Category" placeholder="Category" />
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
        <DataFormSubmission submissionLabel="Update" loadingLabel="Updating..." />
      </DataForm>
    </DataFormContainer>
  );
}
