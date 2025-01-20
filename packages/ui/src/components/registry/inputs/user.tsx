"use client";
import { MultipleSelector, type MultipleSelectorRef } from "@ui/components/registry/multiple-selector";
import { getUsers } from "@utils/actions";
import React from "react";
import { Icons } from "../../icons";

interface InputMultipleUsersProps extends React.ComponentProps<typeof MultipleSelector> {}

const InputMultipleUsers = React.forwardRef<MultipleSelectorRef, InputMultipleUsersProps>(
  (props: InputMultipleUsersProps, ref) => {
    return (
      <MultipleSelector
        ref={ref}
        onSearch={async (search) => {
          const users = await getUsers(`page=1&limit=5&search=${search}`);
          const options = users.map((user) => ({ label: user.name, value: user.id.toString() }));
          return options;
        }}
        placeholder="Search users to add..."
        triggerSearchOnFocus
        loadingIndicator={
          <div className="flex items-center justify-center w-full">
            <Icons.spinner />
          </div>
        }
        emptyIndicator={<p className="w-full text-center text-xs leading-10 text-muted-foreground">no users found</p>}
        {...props}
      />
    );
  },
);

export { InputMultipleUsers };
