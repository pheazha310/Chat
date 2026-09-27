import type { ClientSocket, ServerEvent } from "./websocket.types";

class ConnectionManager {
  private readonly connections = new Map<number, ClientSocket>();

  addConnection(userId: number, socket: ClientSocket): void {
    const previous = this.connections.get(userId);
    if (previous && previous !== socket) {
      previous.close(4001, "A newer connection was opened");
    }
    this.connections.set(userId, socket);
  }

  removeConnection(userId: number, socket: ClientSocket): boolean {
    if (this.connections.get(userId) !== socket) {
      return false;
    }
    this.connections.delete(userId);
    return true;
  }

  getConnection(userId: number): ClientSocket | undefined {
    return this.connections.get(userId);
  }

  isOnline(userId: number): boolean {
    return this.connections.get(userId)?.readyState === 1;
  }

  getOnlineUserIds(): number[] {
    return [...this.connections.keys()];
  }

  broadcast(event: ServerEvent, exceptUserId?: number): void {
    for (const [userId, socket] of this.connections) {
      if (userId !== exceptUserId) {
        this.send(socket, event);
      }
    }
  }

  send(socket: ClientSocket | undefined, event: ServerEvent): void {
    if (socket?.readyState === 1) {
      socket.send(JSON.stringify(event));
    }
  }
}

export const connectionManager = new ConnectionManager();
