import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export interface TokenPayload {
  userId: number;
}

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  });
}

export function verifyToken(token: string): TokenPayload {
  const payload = jwt.verify(token, env.jwtSecret);
  if (typeof payload === "string" || typeof payload.userId !== "number") {
    throw new Error("Invalid token payload");
  }
  return { userId: payload.userId };
}
