export function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === "object" && data !== null && "error" in data) {
      const message = (data as { error: unknown }).error;
      if (typeof message === "string") return message;
    }
  }
  return "Something went wrong. Please try again";
}
