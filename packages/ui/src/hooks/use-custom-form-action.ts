import { useCallback } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

export function useCustomFormAction<T extends FieldValues>(formAction: (_payload: FormData) => void) {
  const action = useCallback(
    (form: UseFormReturn<T>, formData: FormData) => {
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
      formAction(formData);
    },
    [formAction],
  );
  return { action };
}
