import type { ClientEvent } from "../../../shared/types/websocket";
import { useWebSocketStore } from "../../websocket/model/websocket.store";

function sendTypingEvent(
  type: "TYPING_START" | "TYPING_STOP",
  receiverId: number,
): void {
  if (!Number.isSafeInteger(receiverId) || receiverId < 1) return;
  const event: ClientEvent = { type, payload: { receiverId } };
  useWebSocketStore.getState().sendEvent(event);
}

export function sendTypingStart(receiverId: number): void {
  sendTypingEvent("TYPING_START", receiverId);
}

export function sendTypingStop(receiverId: number): void {
  sendTypingEvent("TYPING_STOP", receiverId);
}