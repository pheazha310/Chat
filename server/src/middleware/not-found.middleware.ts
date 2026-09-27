import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";

export function notFound(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  next(
    new AppError(
      `Route ${request.method} ${request.originalUrl} not found`,
      404,
    ),
  );
}
