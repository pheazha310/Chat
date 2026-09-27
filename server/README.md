# Chat Backend

A small Express, TypeScript, MySQL, and native `ws` backend. REST controllers and WebSocket handlers share services; repositories contain the SQL.

## Setup

Requirements: Node.js 20+ and MySQL 8+.

1. Create the database, then apply the migrations in order:

```sql
CREATE DATABASE chat_app;
```

```sh
mysql -u root -p chat_app < migrations/001_create_users.sql
mysql -u root -p chat_app < migrations/002_create_messages.sql
```

1. Copy `.env.example` to `.env`, set the MySQL credentials, and set `JWT_SECRET` to a long random value (for example, `openssl rand -base64 32`).
1. Install dependencies and start the development server:

```sh
npm install
npm run dev
```

The API and WebSocket server share port `5000` by default. `npm run build` compiles TypeScript into `dist/`.

## REST API

| Method | Path                    | Authentication |
| ------ | ----------------------- | -------------- |
| POST   | `/api/auth/register`    | No             |
| POST   | `/api/auth/login`       | No             |
| GET    | `/api/auth/me`          | Bearer token   |
| GET    | `/api/users`            | Bearer token   |
| GET    | `/api/users/:id`        | Bearer token   |
| GET    | `/api/messages/:userId` | Bearer token   |

Successful responses use `{ "success": true, "data": ... }`; errors use `{ "success": false, "message": ... }`. There is intentionally no REST message-send endpoint.

## WebSocket

Connect with a login JWT in the query string, for example:

```text
ws://localhost:5000?token=<JWT>
```

Send JSON events `SEND_MESSAGE`, `TYPING_START`, and `TYPING_STOP`. Message events are saved before `NEW_MESSAGE` is delivered. Presence is held in memory and is not persisted.
