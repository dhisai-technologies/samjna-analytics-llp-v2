"use client";

import { modules, roles } from "@config/core";
import { convertEnumToReadableFormat } from "@utils/helpers";
import { toast } from "sonner";

import { Button } from "@ui/components/ui/button";
import { Form } from "@ui/components/ui/form";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  DataForm,
  DataFormContainer,
  DataFormError,
  DataFormField,
  DataFormSubmission,
} from "@ui/components/registry/data-form";
import { useDataFormState } from "@ui/hooks/use-data-form-state";
import { createUser } from "../_lib/actions";
import type { CreateUserSchema } from "../_lib/validations";

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateUserSchema>({
    defaultValues: {
      name: "",
      email: "",
      role: "ORGANIZATION",
      module: "INTERVIEW",
      maxParticipants: 1,
    },
  });

  const [state, action] = useDataFormState(createUser, {
    onSuccess: () => {
      form.reset();
      toast.success("User created successfully");
      setOpen(false);
    },
  });

  return (
    <div>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Plus className="mr-2 size-4" aria-hidden="true" />
        New user
      </Button>
      <DataFormContainer
        type="dialog"
        title="Create User"
        description="Fill in the details below to create a new user."
        className="min-w-[30vw]"
        open={open}
        onOpenChange={setOpen}
      >
        <Form {...form}>
          <DataForm form={form} state={state} action={action}>
            <DataFormField type="text" name="name" label="Name" placeholder="johndoe" />
            <DataFormField type="text" name="email" label="Email" placeholder="johndoe@xcompany.com" />
            <DataFormField
              type="select"
              name="role"
              label="Role"
              options={roles
                .filter((value) => !["ADMIN"].includes(value))
                .map((value) => ({ value, label: convertEnumToReadableFormat(value) }))}
            />
            <DataFormField
              type="select"
              name="module"
              label="Module"
              options={modules
                .filter((value) => !["ADMIN"].includes(value))
                .map((value) => ({ value, label: convertEnumToReadableFormat(value) }))}
            />
            <DataFormField type="number" name="maxParticipants" label="Max Participants" placeholder="count" />
            <DataFormError />
            <DataFormSubmission loadingLabel="Creating..." submissionLabel="Create" />
          </DataForm>
        </Form>
      </DataFormContainer>
    </div>
  );
}
