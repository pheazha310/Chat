import { createServer } from "node:http";
import { createApp } from "./app";
import { database } from "./config/database";
import { env } from "./config/env";
import { attachWebSocketServer } from "./websocket/websocket.server";

async function startServer(): Promise<void> {
  await database.query("SELECT 1");

  const app = createApp();
  const server = createServer(app);
  attachWebSocketServer(server);

  server.listen(env.port, () => {
    console.log(`Chat API listening on port ${env.port}`);
  });
}

startServer().catch((error: unknown) => {
  console.error("Failed to start server:", error);
  process.exitCode = 1;
});
