import { headers } from "next/headers";

import type { User } from "@config/core";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";

export function getSessionUser() {
  const encoded = headers().get("x-next-user");
  if (encoded && typeof encoded === "string") {
    try {
      const decodedUser = atob(encoded);
      const user = JSON.parse(decodedUser) as User;
      return user;
    } catch (_) {
      redirect("/auth/login");
    }
  }
  redirect("/auth/login");
}

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function decrypt(session: string | undefined = "") {
  const { payload } = await jwtVerify(session, encodedKey, {
    algorithms: ["HS256"],
  });
  return payload as User;
}
