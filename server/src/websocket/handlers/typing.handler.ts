import type { RawData } from "ws";
import { connectionManager } from "../connection.manager";
import type { ClientSocket } from "../websocket.types";

export function handleTyping(
  socket: ClientSocket,
  type: "TYPING_START" | "TYPING_STOP",
  data: RawData,
): void {
  let event: unknown;
  try {
    event = JSON.parse(data.toString());
  } catch {
    sendError(socket, "Invalid JSON message");
    return;
  }

  if (
    typeof event !== "object" ||
    event === null ||
    !("payload" in event) ||
    typeof event.payload !== "object" ||
    event.payload === null ||
    !("receiverId" in event.payload)
  ) {
    sendError(socket, "Invalid typing event payload");
    return;
  }
  const receiverId = Number(event.payload.receiverId);
  if (
    !Number.isSafeInteger(receiverId) ||
    receiverId < 1 ||
    receiverId === socket.userId
  ) {
    sendError(socket, "Invalid receiver id");
    return;
  }

  connectionManager.send(connectionManager.getConnection(receiverId), {
    type: type === "TYPING_START" ? "USER_TYPING" : "USER_STOPPED_TYPING",
    payload: { userId: socket.userId },
  });
}

function sendError(socket: ClientSocket, message: string): void {
  connectionManager.send(socket, { type: "ERROR", payload: { message } });
}
