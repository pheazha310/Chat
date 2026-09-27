import type { RawData } from "ws";
import { AppError } from "../../utils/app-error";
import { MessageService } from "../../services/message.service";
import { connectionManager } from "../connection.manager";
import type { ClientEvent, ClientSocket } from "../websocket.types";

export async function handleMessage(
  socket: ClientSocket,
  data: RawData,
  messageService: MessageService,
): Promise<void> {
  let event: unknown;
  try {
    event = JSON.parse(data.toString());
  } catch {
    sendError(socket, "Invalid JSON message");
    return;
  }

  if (!isClientEvent(event)) {
    sendError(socket, "Unknown or invalid message type");
    return;
  }

  if (event.type !== "SEND_MESSAGE") {
    sendError(socket, "Unsupported message event");
    return;
  }

  try {
    const message = await messageService.sendMessage(
      socket.userId,
      event.payload.receiverId,
      event.payload.content,
    );
    const outgoing = {
      id: message.id,
      senderId: message.senderId,
      receiverId: message.receiverId,
      content: message.content,
      createdAt: message.createdAt,
    };
    connectionManager.send(
      connectionManager.getConnection(message.receiverId),
      {
        type: "NEW_MESSAGE",
        payload: outgoing,
      },
    );
    connectionManager.send(socket, { type: "NEW_MESSAGE", payload: outgoing });
  } catch (error) {
    sendError(
      socket,
      error instanceof AppError ? error.message : "Unable to send message",
    );
  }
}

function isClientEvent(value: unknown): value is ClientEvent {
  if (
    typeof value !== "object" ||
    value === null ||
    !("type" in value) ||
    !("payload" in value)
  ) {
    return false;
  }
  const event = value as { type: unknown; payload: unknown };
  return (
    (event.type === "SEND_MESSAGE" ||
      event.type === "TYPING_START" ||
      event.type === "TYPING_STOP") &&
    typeof event.payload === "object" &&
    event.payload !== null
  );
}

function sendError(socket: ClientSocket, message: string): void {
  connectionManager.send(socket, { type: "ERROR", payload: { message } });
}
