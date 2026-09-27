import { useMessageStore } from "../../../entities/message/model/message.store";
import { useUserStore } from "../../../entities/user/model/user.store";
import { useAuthStore } from "../../auth/model/auth.store";
import { useTypingStore } from "../../typing-indicator/model/typing.store";
import type { ServerEvent } from "../../../shared/types/websocket";
import { websocketClient } from "../api/websocket.client";

let subscribed = false;

/**
 * Routes incoming WebSocket events into the entity stores.
 * Called once from the app providers while authenticated.
 */
export function subscribeWebSocketEvents(): void {
  if (subscribed) return;
  subscribed = true;

  websocketClient.onServerEvent((event: ServerEvent) => {
    switch (event.type) {
      case "NEW_MESSAGE": {
        const currentUserId = useAuthStore.getState().user?.id;
        if (currentUserId) {
          useMessageStore
            .getState()
            .receiveMessage(event.payload, currentUserId);
          useTypingStore.getState().setStopped(event.payload.senderId);
        }
        break;
      }
      case "USER_ONLINE":
        useUserStore.getState().setOnline(event.payload.userId);
        break;
      case "USER_OFFLINE":
        useUserStore.getState().setOffline(event.payload.userId);
        break;
      case "USER_TYPING":
        useTypingStore.getState().setTyping(event.payload.userId);
        break;
      case "USER_STOPPED_TYPING":
        useTypingStore.getState().setStopped(event.payload.userId);
        break;
      default:
        break;
    }
  });
}