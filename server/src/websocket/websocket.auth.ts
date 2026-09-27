import type { IncomingMessage } from "node:http";
import { AppError } from "../utils/app-error";
import { verifyToken } from "../utils/jwt";

export function authenticateWebSocket(request: IncomingMessage): number {
  const url = new URL(request.url ?? "/", "http://localhost");
  const token = url.searchParams.get("token");
  if (!token) {
    throw new AppError("Authentication required", 401);
  }
  try {
    return verifyToken(token).userId;
  } catch {
    throw new AppError("Invalid or expired token", 401);
  }
}
