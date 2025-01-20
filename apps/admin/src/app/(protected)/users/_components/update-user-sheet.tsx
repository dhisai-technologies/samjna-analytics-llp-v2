"use client";

import { type User, roles } from "@config/core";
import type { Sheet } from "@ui/components/ui/sheet";
import { convertEnumToReadableFormat } from "@utils/helpers";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  DataForm,
  DataFormContainer,
  DataFormError,
  DataFormField,
  DataFormSubmission,
} from "@ui/components/registry/data-form";
import { useDataFormState } from "@ui/hooks/use-data-form-state";
import { updateUser } from "../_lib/actions";
import type { UpdateUserSchema } from "../_lib/validations";

interface UpdateUserSheetProps extends React.ComponentPropsWithRef<typeof Sheet> {
  user: User;
}

export function UpdateUserSheet({ user, ...props }: UpdateUserSheetProps) {
  const form = useForm<UpdateUserSchema>({
    defaultValues: {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      maxParticipants: user.maxParticipants,
    },
  });
  const [state, action] = useDataFormState(updateUser, {
    onSuccess: () => {
      form.reset();
      props.onOpenChange?.(false);
      toast.success("User updated successfully");
    },
  });

  useEffect(() => {
    form.reset({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      maxParticipants: user.maxParticipants,
    });
  }, [user, form]);

  return (
    <DataFormContainer
      type="sheet"
      title="Update user"
      description="Modify the details below to update the user."
      {...props}
    >
      <DataForm form={form} state={state} action={action}>
        <input hidden {...form.register("userId")} />
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
        <DataFormField type="number" name="maxParticipants" label="Max participants" />
        <DataFormError />
        <DataFormSubmission loadingLabel="Updating..." submissionLabel="Update" />
      </DataForm>
    </DataFormContainer>
  );
}
