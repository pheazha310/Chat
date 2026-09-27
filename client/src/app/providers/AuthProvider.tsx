import { type ReactNode, useEffect } from "react";
import { useAuthStore } from "../../features/auth/model/auth.store";
import { subscribeWebSocketEvents } from "../../features/websocket/model/websocket.events";
import { useWebSocketStore } from "../../features/websocket/model/websocket.store";

/**
 * App-level wiring, mounted once:
 * - Connects the WebSocket (and subscribes server events to stores) while a
 *   session exists.
 * - Disconnects cleanly on log-out.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated && token) {
      subscribeWebSocketEvents();
      useWebSocketStore.getState().connect(token);
    } else {
      useWebSocketStore.getState().disconnect();
    }
  }, [isAuthenticated, token]);

  return <>{children}</>;
}