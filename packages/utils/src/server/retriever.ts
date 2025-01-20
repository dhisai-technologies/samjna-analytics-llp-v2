import { cookies } from "next/headers";

export async function retrieve(input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response> {
  const cookie = cookies().get("session");
  return fetch(input, {
    ...init,
    headers: {
      Authorization: `Bearer ${cookie?.value}`,
      "x-api-key": process.env.API_KEY || "",
      ...init?.headers,
    },
  });
}
