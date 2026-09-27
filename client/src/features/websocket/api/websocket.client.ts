import { appEnv } from "../../../shared/config/env";
import type { ClientEvent, ServerEvent } from "../../../shared/types/websocket";

export type WebSocketStatus = "disconnected" | "connecting" | "connected";

type EventHandler = (event: ServerEvent) => void;
type StatusHandler = (status: WebSocketStatus) => void;

const RECONNECT_DELAY_MS = 2500;
const MAX_RECONNECT_ATTEMPTS = 5;

/**
 * A thin wrapper around the native WebSocket API.
 *
 * - One connection per token (idempotent connect).
 * - Automatic cleanup, bounded auto-reconnect, and status notifications.
 * - Consumers subscribe with onServerEvent(handler) and never touch the socket.
 */
class WebSocketClient {
  private socket: WebSocket | null = null;
  private token: string | null = null;
  private shouldReconnect = false;
  private reconnectAttempts = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly eventHandlers = new Set<EventHandler>();
  private readonly statusHandlers = new Set<StatusHandler>();

  connect(token: string): void {
    if (
      this.socket &&
      this.token === token &&
      this.socket.readyState === WebSocket.OPEN
    ) {
      return;
    }
    this.closeSocket();
    this.token = token;
    this.shouldReconnect = true;
    this.reconnectAttempts = 0;
    this.openSocket();
  }

  disconnect(): void {
    this.shouldReconnect = false;
    this.closeSocket();
    this.token = null;
    this.setStatus("disconnected");
  }

  send(event: ClientEvent): boolean {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(event));
      return true;
    }
    return false;
  }

  /** Subscribes to parsed server events. Returns an unsubscribe function. */
  onServerEvent(handler: EventHandler): () => void {
    this.eventHandlers.add(handler);
    return () => void this.eventHandlers.delete(handler);
  }

  /** Subscribes to connection status changes. Returns an unsubscribe function. */
  subscribeStatus(handler: StatusHandler): () => void {
    this.statusHandlers.add(handler);
    return () => void this.statusHandlers.delete(handler);
  }

  private openSocket(): void {
    const token = this.token;
    if (!token) return;
    this.clearReconnectTimer();
    this.setStatus("connecting");
    const socket = new WebSocket(
      `${appEnv.wsUrl}?token=${encodeURIComponent(token)}`,
    );
    this.socket = socket;

    socket.onopen = () => {
      this.reconnectAttempts = 0;
      this.setStatus("connected");
    };
    socket.onmessage = (event) => void this.dispatch(event);
    socket.onclose = () => {
      if (this.socket === socket) this.socket = null;
      this.setStatus("disconnected");
      if (!this.shouldReconnect) return;
      if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        this.shouldReconnect = false;
        return;
      }
      this.reconnectAttempts += 1;
      this.reconnectTimer = setTimeout(() => {
        if (this.shouldReconnect) this.openSocket();
      }, RECONNECT_DELAY_MS);
    };
    // Errors are always followed by a close event; no extra handling needed.
    socket.onerror = () => undefined;
  }

  private async dispatch(event: MessageEvent): Promise<void> {
    const raw =
      typeof event.data === "string" ? event.data : await event.data.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return; // Malformed server data is ignored safely.
    }
    for (const handler of this.eventHandlers) {
      handler(parsed as ServerEvent);
    }
  }

  private closeSocket(): void {
    this.clearReconnectTimer();
    if (!this.socket) return;
    const socket = this.socket;
    this.socket = null;
    socket.onclose = null;
    if (
      socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING
    ) {
      try {
        socket.close(1000, "Client closed");
      } catch {
        // The socket was already closing.
      }
    }
  }

  private setStatus(status: WebSocketStatus): void {
    for (const handler of this.statusHandlers) handler(status);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

export const websocketClient = new WebSocketClient();