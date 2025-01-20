import "server-only";
import type { User } from "@config/core";
import type { SearchParams } from "@config/utils";
import { config, error, retrieve } from "@utils/server";

export async function getUsers(searchParams: SearchParams) {
  const queryParams = new URLSearchParams(searchParams as Record<string, string>).toString();
  const response = await retrieve(`${config.CORE_API_URL}/v1/users?${queryParams}`);
  const result = await response.json();
  if (!response.ok) {
    return error(result, response);
  }
  const { pageCount, users } = result.data as {
    users: User[];
    pageCount: number;
  };
  return {
    pageCount,
    users,
  };
}
