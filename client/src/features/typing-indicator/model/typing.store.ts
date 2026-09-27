import { create } from "zustand";

export interface TypingState {
  typingUserIds: Set<number>;
  setTyping: (userId: number) => void;
  setStopped: (userId: number) => void;
}

export const useTypingStore = create<TypingState>((set) => ({
  typingUserIds: new Set(),
  setTyping: (userId) => {
    const typingUserIds = new Set(useTypingStore.getState().typingUserIds);
    typingUserIds.add(userId);
    set({ typingUserIds });
  },
  setStopped: (userId) => {
    const typingUserIds = new Set(useTypingStore.getState().typingUserIds);
    typingUserIds.delete(userId);
    set({ typingUserIds });
  },
}));