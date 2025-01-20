import { SignJWT, jwtVerify } from "jose";
import type { SessionData } from "../types";

export async function encrypt(payload: SessionData, secretKey: string) {
  const encodedKey = new TextEncoder().encode(secretKey);
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(encodedKey);
}

export async function decrypt(session: string, secretKey: string) {
  const encodedKey = new TextEncoder().encode(secretKey);
  const { payload } = await jwtVerify(session, encodedKey, {
    algorithms: ["HS256"],
  });
  return payload as SessionData;
}
