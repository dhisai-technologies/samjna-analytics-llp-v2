"use client";

import type { ServerActionResponse } from "@config/utils";
import { Form } from "@ui/components/ui/form";
import { cn } from "@ui/utils";
import type React from "react";
import { createContext, useCallback, useContext } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

interface DataFormContextType<TFieldValues extends FieldValues> {
  form: UseFormReturn<TFieldValues, unknown, undefined>;
  state: ServerActionResponse;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const DataFormContext = createContext<DataFormContextType<any> | undefined>(undefined);

interface DataFormProps<TFieldValues extends FieldValues> extends React.FormHTMLAttributes<HTMLFormElement> {
  form: UseFormReturn<TFieldValues, unknown, undefined>;
  state: ServerActionResponse;
}

function DataForm<TFieldValues extends FieldValues>({
  form,
  state,
  children,
  action,
  className,
  ...props
}: DataFormProps<TFieldValues>) {
  const customAction = useCallback(
    (form: UseFormReturn<TFieldValues>, formData: FormData) => {
      if (!action || typeof action === "string") return;
      const values = form.getValues();
      for (const key of Object.keys(values)) {
        if (!formData.has(key)) {
          const value = values[key];
          if (typeof value === "string") {
            formData.append(key, value);
          } else if (typeof value === "number") {
            formData.append(key, value.toString());
          } else if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else if (Array.isArray(value) || typeof value === "object") {
            formData.append(key, JSON.stringify(value));
          }
        }
      }
      action(formData);
    },
    [action],
  );
  return (
    <Form {...form}>
      <form action={(data) => customAction(form, data)} className={cn("grid gap-4", className)} {...props}>
        <DataFormContext.Provider
          value={{
            form,
            state,
          }}
        >
          {children}
        </DataFormContext.Provider>
      </form>
    </Form>
  );
}

function useDataForm<TFieldValues extends FieldValues>() {
  const context = useContext(DataFormContext);
  if (!context) {
    throw new Error("useDataForm must be used within a DataForm");
  }
  return context as DataFormContextType<TFieldValues>;
}

export { DataForm, useDataForm };
