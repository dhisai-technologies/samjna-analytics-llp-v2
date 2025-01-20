import type { ServerActionResponse } from "@config/utils";
import { isRedirectError } from "next/dist/client/components/redirect";

export const catchAsync = <U>(fn: (state: ServerActionResponse, formData: FormData) => Promise<U>) => {
  return async (state: ServerActionResponse, formData: FormData): Promise<ServerActionResponse> => {
    let response: ServerActionResponse = null;
    try {
      response = (await fn(state, formData)) as ServerActionResponse;
    } catch (err) {
      if (isRedirectError(err)) {
        throw err;
      }
      console.error("💥 Error: ", err);
      return {
        error: "Something went wrong, please try again later",
      };
    }
    return response;
  };
};
