interface ErrorResponseShape {
  response?: { data?: { message?: unknown } };
}

/**
 * Extracts a human-readable message from an Axios error, an Error, or an
 * unknown value. Never surfaces stack traces or server internals.
 */
export function extractErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const data = (error as ErrorResponseShape).response?.data;
    if (data && typeof data.message === "string" && data.message.length > 0) {
      return data.message;
    }
  }
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
}