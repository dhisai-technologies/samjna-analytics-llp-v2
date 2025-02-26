import { cookies } from "next/headers";

export async function retrieve(input: string | URL | globalThis.Request, init?: RequestInit): Promise<Response> {
  const cookie = cookies().get("session");
  console.log(
    `[${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}] Fetching URL: ${input.toString()}`,
  );
  const response = await fetch(input, {
    ...init,
    headers: {
      Authorization: `Bearer ${cookie?.value}`,
      "x-api-key": process.env.API_KEY || "",
      ...init?.headers,
    },
  });
  console.log(
    `[${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}] Fetched URL: ${input.toString()} with status ${response.status}`,
  );
  return response;
}
