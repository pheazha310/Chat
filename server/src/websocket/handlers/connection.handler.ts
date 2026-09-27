import type { ClientSocket } from "../websocket.types";
import { connectionManager } from "../connection.manager";

export function handleConnection(socket: ClientSocket): void {
  const onlineBeforeConnect = connectionManager.getOnlineUserIds();
  connectionManager.addConnection(socket.userId, socket);

  for (const userId of onlineBeforeConnect) {
    connectionManager.send(socket, {
      type: "USER_ONLINE",
      payload: { userId },
    });
  }
  connectionManager.broadcast(
    { type: "USER_ONLINE", payload: { userId: socket.userId } },
    socket.userId,
  );

  socket.on("close", () => {
    if (connectionManager.removeConnection(socket.userId, socket)) {
      connectionManager.broadcast({
        type: "USER_OFFLINE",
        payload: { userId: socket.userId },
      });
    }
  });
}
