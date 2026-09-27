export const appEnv = {
  apiUrl: import.meta.env.VITE_API_URL ?? "http://localhost:5000/api",
  wsUrl: import.meta.env.VITE_WS_URL ?? "ws://localhost:5000/ws",
};