import { create } from "zustand";
import { extractErrorMessage } from "../../../shared/lib/errors";
import { fetchUsers } from "../api/user.api";
import type { User } from "./types";

export interface UserState {
  users: User[];
  onlineIds: Set<number>;
  loaded: boolean;
  loading: boolean;
  error: string | null;
  loadUsers: () => Promise<void>;
  setOnline: (userId: number) => void;
  setOffline: (userId: number) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  onlineIds: new Set(),
  loaded: false,
  loading: false,
  error: null,
  loadUsers: async () => {
    const { loaded, loading } = useUserStore.getState();
    if (loaded || loading) return;
    set({ loading: true, error: null });
    try {
      set({ users: await fetchUsers(), loaded: true, loading: false });
    } catch (error) {
      set({ error: extractErrorMessage(error), loading: false });
    }
  },
  setOnline: (userId) => {
    const onlineIds = new Set(useUserStore.getState().onlineIds);
    onlineIds.add(userId);
    set({ onlineIds });
  },
  setOffline: (userId) => {
    const onlineIds = new Set(useUserStore.getState().onlineIds);
    onlineIds.delete(userId);
    set({ onlineIds });
  },
}));