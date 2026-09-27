import type { ErrorRequestHandler } from "express";
import { AppError } from "../utils/app-error";

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof AppError) {
    response
      .status(error.statusCode)
      .json({ success: false, message: error.message });
    return;
  }

  if (isRequestBodyError(error)) {
    response
      .status(400)
      .json({ success: false, message: "Invalid request body" });
    return;
  }

  console.error(error);
  response
    .status(500)
    .json({ success: false, message: "Internal server error" });
};

function isRequestBodyError(error: unknown): error is { type: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "type" in error &&
    (error.type === "entity.parse.failed" || error.type === "entity.too.large")
  );
}
