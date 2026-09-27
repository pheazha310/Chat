import { create } from "zustand";
import { extractErrorMessage } from "../../../shared/lib/errors";
import { fetchHistory } from "../api/message.api";
import type { Message } from "./types";

export interface MessageState {
  activeUserId: number | null;
  messages: Message[];
  conversations: Record<number, Message[]>;
  unreadCounts: Record<number, number>;
  loading: boolean;
  error: string | null;
  selectConversation: (userId: number) => Promise<void>;
  loadHistory: () => Promise<void>;
  clearConversation: () => void;
  receiveMessage: (message: Message, currentUserId: number) => void;
  clearUnread: (userId: number) => void;
}

function sortedByDate(messages: Message[]): Message[] {
  return [...messages].sort((a, b) => {
    if (a.createdAt !== b.createdAt) {
      return a.createdAt.localeCompare(b.createdAt);
    }
    return a.id - b.id;
  });
}

export const useMessageStore = create<MessageState>((set) => ({
  activeUserId: null,
  messages: [],
  conversations: {},
  unreadCounts: {},
  loading: false,
  error: null,
  selectConversation: async (userId) => {
    const { conversations } = useMessageStore.getState();
    const cached = conversations[userId];
    if (cached) {
      set({
        activeUserId: userId,
        messages: cached,
        unreadCounts: {
          ...useMessageStore.getState().unreadCounts,
          [userId]: 0,
        },
      });
      return;
    }
    set({ activeUserId: userId, error: null });
    await useMessageStore.getState().loadHistory();
  },
  loadHistory: async () => {
    const { activeUserId } = useMessageStore.getState();
    if (!activeUserId) return;
    set({ loading: true, error: null });
    try {
      const history = await fetchHistory(activeUserId);
      set((state) => ({
        conversations: { ...state.conversations, [activeUserId]: history },
        messages: history,
        loading: false,
      }));
    } catch (error) {
      set({ error: extractErrorMessage(error), loading: false });
    }
  },
  clearConversation: () => set({ activeUserId: null, messages: [] }),
  receiveMessage: (message, currentUserId) => {
    const otherUserId =
      message.senderId === currentUserId
        ? message.receiverId
        : message.senderId;
    const state = useMessageStore.getState();
    if (state.activeUserId === otherUserId) {
      if (state.messages.some((existing) => existing.id === message.id)) return;
      const messages = sortedByDate([...state.messages, message]);
      set({
        messages,
        conversations: { ...state.conversations, [otherUserId]: messages },
        unreadCounts: { ...state.unreadCounts, [otherUserId]: 0 },
      });
      return;
    }
    const cached = state.conversations[otherUserId];
    const merged = cached ? sortedByDate([...cached, message]) : [message];
    set({
      conversations: { ...state.conversations, [otherUserId]: merged },
      unreadCounts: {
        ...state.unreadCounts,
        [otherUserId]: (state.unreadCounts[otherUserId] ?? 0) + 1,
      },
    });
  },
  clearUnread: (userId) => {
    const unreadCounts = {
      ...useMessageStore.getState().unreadCounts,
      [userId]: 0,
    };
    set({ unreadCounts });
  },
}));