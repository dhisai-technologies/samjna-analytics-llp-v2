export function getErrorMessage(res: unknown, defaultError = "An error occurred") {
  return typeof res === "object" && res && "message" in res ? (res.message as string) : defaultError;
}
