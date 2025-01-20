"use server";
import type { User } from "@config/core";
import { config, retrieve } from "@utils/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getUsers(searchParams: string) {
  const response = await retrieve(`${config.CORE_API_URL}/v1/users?${searchParams}`);
  if (!response.ok) {
    return [];
  }
  const result = await response.json();
  const {
    data: { users },
  } = result as {
    data: {
      users: User[];
    };
  };
  return users;
}

export async function logout() {
  const cookie = cookies();
  cookie.delete("session");
  revalidatePath("/", "layout");
  redirect("/auth/login");
}

export async function markNotificationAsRead(id: string) {
  const response = await retrieve(`${config.CORE_API_URL}/v1/notifications/${id}`, {
    method: "PATCH",
  });
  const json = (await response.json()) as { message: string };
  if (!response.ok) {
    throw new Error(json.message);
  }
  revalidatePath("/", "layout");
  return {
    success: true,
  };
}
