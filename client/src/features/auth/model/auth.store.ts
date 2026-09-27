import { create } from "zustand";
import type { User } from "../../../entities/user/model/types";
import { extractErrorMessage } from "../../../shared/lib/errors";
import {
  TOKEN_STORAGE_KEY,
  USER_STORAGE_KEY,
  loadFromStorage,
  removeFromStorage,
  saveToStorage,
} from "../../../shared/lib/storage";
import { signIn, signUp } from "../api/auth.api";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

function restoreSession(): { user: User | null; token: string | null } {
  return {
    token: loadFromStorage<string>(TOKEN_STORAGE_KEY),
    user: loadFromStorage<User>(USER_STORAGE_KEY),
  };
}

export const useAuthStore = create<AuthState>((set) => {
  const { token, user } = restoreSession();
  return {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading: false,
    error: null,
    login: async (email, password) => {
      set({ loading: true, error: null });
      try {
        const result = await signIn(email, password);
        saveToStorage(TOKEN_STORAGE_KEY, result.token);
        saveToStorage(USER_STORAGE_KEY, result.user);
        set({
          token: result.token,
          user: result.user,
          isAuthenticated: true,
          loading: false,
        });
        return true;
      } catch (error) {
        set({ error: extractErrorMessage(error), loading: false });
        return false;
      }
    },
    register: async (name, email, password) => {
      set({ loading: true, error: null });
      try {
        await signUp(name, email, password);
        // Registration does not return a token, so sign the user in right away.
        const result = await signIn(email, password);
        saveToStorage(TOKEN_STORAGE_KEY, result.token);
        saveToStorage(USER_STORAGE_KEY, result.user);
        set({
          token: result.token,
          user: result.user,
          isAuthenticated: true,
          loading: false,
        });
        return true;
      } catch (error) {
        set({ error: extractErrorMessage(error), loading: false });
        return false;
      }
    },
    logout: () => {
      removeFromStorage(TOKEN_STORAGE_KEY);
      removeFromStorage(USER_STORAGE_KEY);
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        error: null,
      });
    },
  };
});