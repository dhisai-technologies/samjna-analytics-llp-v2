export function getGenericName(email: string) {
  if (typeof email !== "string" || !email.includes("@")) {
    return "Anonymous";
  }
  const username = email.split("@")[0];
  if (!username) {
    return "Anonymous";
  }
  const genericName = username.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  return genericName;
}
