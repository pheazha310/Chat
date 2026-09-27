import { create } from "zustand";
import type { ClientEvent } from "../../../shared/types/websocket";
import { websocketClient, type WebSocketStatus } from "../api/websocket.client";

export interface WebSocketState {
  status: WebSocketStatus;
  connect: (token: string) => void;
  disconnect: () => void;
  sendEvent: (event: ClientEvent) => boolean;
}

export const useWebSocketStore = create<WebSocketState>(() => ({
  status: "disconnected",
  connect: (token) => websocketClient.connect(token),
  disconnect: () => websocketClient.disconnect(),
  sendEvent: (event) => websocketClient.send(event),
}));

// Mirror the underlying socket status into the store so widgets can render it.
websocketClient.subscribeStatus((status) =>
  useWebSocketStore.setState({ status }),
);