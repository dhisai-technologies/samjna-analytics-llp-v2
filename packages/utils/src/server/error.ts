export function error(response: Response, result?: unknown) {
  const statusCode = response.status;
  const message =
    result && typeof result === "object" && "message" in result && typeof result.message === "string"
      ? result.message
      : "Internal server error";
  return {
    error: {
      statusCode,
      message,
    },
  };
}
