import type { ClientEvent } from "../../../shared/types/websocket";
import { useWebSocketStore } from "../../websocket/model/websocket.store";

export const MAX_MESSAGE_LENGTH = 5000;

/**
 * Validates the content and sends a chat message over WebSocket.
 * Messages are never sent through REST (there is no send endpoint).
 */
export function sendMessage(receiverId: number, content: string): boolean {
  const trimmed = content.trim();
  if (
    !Number.isSafeInteger(receiverId) ||
    trimmed.length === 0 ||
    trimmed.length > MAX_MESSAGE_LENGTH
  ) {
    return false;
  }
  const event: ClientEvent = {
    type: "SEND_MESSAGE",
    payload: { receiverId, content: trimmed },
  };
  return useWebSocketStore.getState().sendEvent(event);
}