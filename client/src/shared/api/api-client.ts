import axios from "axios";
import { appEnv } from "../config/env";
import { TOKEN_STORAGE_KEY, loadFromStorage } from "../lib/storage";

export const apiClient = axios.create({
  baseURL: appEnv.apiUrl,
  headers: { "Content-Type": "application/json" },
});

// Attach the JWT that the auth feature keeps in localStorage to every request.
apiClient.interceptors.request.use((config) => {
  const token = loadFromStorage<string>(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});