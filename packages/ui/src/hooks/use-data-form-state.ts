import type { ServerActionResponse } from "@config/utils";
import { useFormState } from "react-dom";

export function useDataFormState(
  action: (state: ServerActionResponse, payload: FormData) => Promise<ServerActionResponse>,
  options?: {
    onSuccess?: ((state: ServerActionResponse) => void) | null;
    onFailure?: ((state: ServerActionResponse) => void) | null;
  },
) {
  const [state, dynamicAction] = useFormState(async (state: ServerActionResponse, payload: FormData) => {
    const result = await action(state, payload);
    if (options?.onSuccess && (result?.success || result?.data)) {
      options.onSuccess(result);
    }
    if (options?.onFailure && (result?.error || result?.errors)) {
      options.onFailure(result);
    }
    return result;
  }, null);
  return [state, dynamicAction] as const;
}
