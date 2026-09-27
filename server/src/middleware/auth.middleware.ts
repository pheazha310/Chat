import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error";
import { verifyToken } from "../utils/jwt";

export function authenticate(
  request: Request,
  _response: Response,
  next: NextFunction,
): void {
  const authorization = request.get("authorization");
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    next(new AppError("Authentication required", 401));
    return;
  }

  try {
    request.user = { id: verifyToken(match[1]).userId };
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
}
