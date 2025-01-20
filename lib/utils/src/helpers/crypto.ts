import crypto from "node:crypto";

export function crypticRandomBytes(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}
