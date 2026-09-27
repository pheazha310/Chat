import type { Server } from "node:http";
import { WebSocketServer } from "ws";
import { MessageRepository } from "../repositories/message.repository";
import { UserRepository } from "../repositories/user.repository";
import { MessageService } from "../services/message.service";
import { authenticateWebSocket } from "./websocket.auth";
import { handleConnection } from "./handlers/connection.handler";
import { handleMessage } from "./handlers/message.handler";
import { handleTyping } from "./handlers/typing.handler";
import type { ClientSocket } from "./websocket.types";

export function attachWebSocketServer(server: Server): WebSocketServer {
  const webSocketServer = new WebSocketServer({ noServer: true });
  const messageService = new MessageService(
    new MessageRepository(),
    new UserRepository(),
  );

  server.on("upgrade", (request, socket, head) => {
    try {
      const userId = authenticateWebSocket(request);
      webSocketServer.handleUpgrade(request, socket, head, (webSocket) => {
        const client = webSocket as ClientSocket;
        client.userId = userId;
        handleConnection(client);
        client.on("message", (data) => {
          let event: { type?: unknown };
          try {
            event = JSON.parse(data.toString()) as { type?: unknown };
          } catch {
            void handleMessage(client, data, messageService);
            return;
          }

          if (event.type === "TYPING_START" || event.type === "TYPING_STOP") {
            handleTyping(client, event.type, data);
          } else {
            void handleMessage(client, data, messageService);
          }
        });
      });
    } catch {
      socket.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n");
      socket.destroy();
    }
  });

  return webSocketServer;
}
