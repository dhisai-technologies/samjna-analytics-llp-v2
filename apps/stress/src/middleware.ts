import { decrypt } from "@utils/server";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  try {
    const cookie = cookies().get("session");
    if (!cookie || !cookie.value) {
      return NextResponse.redirect(new URL("/preview", request.url));
    }
    const user = await decrypt(cookie.value);
    headers.set("x-next-user", btoa(JSON.stringify(user)));
  } catch (_) {
    return NextResponse.redirect(new URL("/preview", request.url));
  }
  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: ["/((?!auth/login|_next/static|_next/image|preview|landing.png|icon.png|logo.png).*)"],
};
