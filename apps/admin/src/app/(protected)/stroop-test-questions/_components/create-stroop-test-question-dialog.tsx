"use client";
import { stroopTestLevels } from "@config/stress";
import { ColorPicker } from "@ui/components/color-picker";
import {
  DataForm,
  DataFormContainer,
  DataFormError,
  DataFormField,
  DataFormSubmission,
} from "@ui/components/registry/data-form";
import { Button } from "@ui/components/ui/button";
import type { Dialog } from "@ui/components/ui/dialog";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { Separator } from "@ui/components/ui/separator";
import { useDataFormState } from "@ui/hooks/use-data-form-state";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createStroopTestQuestion } from "../_lib/actions";
import type { CreateStroopTestQuestionSchema } from "../_lib/validations";

interface CreateStroopTestQuestionDialogProps extends React.ComponentPropsWithRef<typeof Dialog> {
  order?: number;
}

export function CreateStroopTestQuestionDialog({ order, ...props }: CreateStroopTestQuestionDialogProps) {
  const form = useForm<CreateStroopTestQuestionSchema>({
    defaultValues: {
      title: "Choose the correct matching color word from the right side screen",
      order: order ?? 1,
      level: "LEVEL-1",
      timeLimit: 6,
      answer: "",
      sourceLabel: "",
      sourceColor: "",
    },
  });

  const [state, action] = useDataFormState(createStroopTestQuestion, {
    onSuccess: () => {
      form.reset();
      toast.success("Stroop Test Question created successfully");
      props.onOpenChange?.(false);
    },
  });

  return (
    <DataFormContainer
      type="dialog"
      title="Create stroop test question"
      description="Fill in the details below to create a new stroop test question."
      {...props}
    >
      <DataForm form={form} state={state} action={action}>
        <ScrollArea className="max-h-[80vh]">
          <div className="grid grid-cols-2 gap-3 p-1">
            <DataFormField
              name="title"
              type="text"
              label="Title"
              placeholder="What is the question?"
              className="col-span-2"
            />
            <DataFormField
              name="level"
              type="select"
              label="Level"
              placeholder="For some level x"
              options={stroopTestLevels.map((value) => ({ label: value, value }))}
            />
            <DataFormField name="order" type="number" label="Order" placeholder="Order" />
            <DataFormField name="timeLimit" type="number" label="Time Limit" placeholder="Time limit" />
            <DataFormField name="answer" type="text" label="Answer" placeholder="ID of the destination option" />
            <DataFormField name="sourceLabel" type="text" label="Source Label" placeholder="Source Label" />
            <DataFormField
              name="sourceColor"
              type="others"
              label="Source Color"
              render={({ field }) => (
                <ColorPicker
                  id={field.name}
                  value={field.value}
                  onChange={(color) => form.setValue(field.name as "sourceColor", color)}
                />
              )}
            />
            <div className="col-span-2">
              <Separator className="my-2" />
              <DataFormField
                type="array"
                name="destination"
                label="Destination"
                className="max-w-xl mr-auto"
                description="Add destination option"
                element={({ field, index, remove }) => (
                  <div key={field.id} className="flex w-full items-center gap-2">
                    <DataFormField
                      type="text"
                      name={`destination.${index}.id`}
                      placeholder="ID"
                      className="w-full"
                      disabled
                    />
                    <DataFormField
                      type="text"
                      name={`destination.${index}.label`}
                      placeholder="Label"
                      className="w-full"
                    />
                    <DataFormField
                      name={`destination.${index}.color`}
                      type="others"
                      render={({ field }) => (
                        <ColorPicker
                          id={field.name}
                          value={field.value}
                          onChange={(color) => form.setValue(field.name as `destination.${number}.color`, color)}
                        />
                      )}
                    />
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
                    onClick={() =>
                      append({
                        id: (form.getValues("destination").length + 1).toString(),
                        label: "",
                        color: "",
                      })
                    }
                  >
                    Add option
                  </Button>
                )}
              />
            </div>
          </div>
        </ScrollArea>
        <DataFormError />
        <DataFormSubmission submissionLabel="Create" loadingLabel="Creating..." />
      </DataForm>
    </DataFormContainer>
  );
}
