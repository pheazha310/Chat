import type { WebSocket } from "ws";

export interface ClientSocket extends WebSocket {
  userId: number;
}

export type ClientEvent =
  | { type: "SEND_MESSAGE"; payload: { receiverId: unknown; content: unknown } }
  | { type: "TYPING_START" | "TYPING_STOP"; payload: { receiverId: unknown } };

export interface ServerEvent<T = unknown> {
  type: string;
  payload: T;
}
