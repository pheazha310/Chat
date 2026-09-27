# Real-Time Chat Application

A complete 1-to-1 real-time chat application.

- **Backend** (`server/`): Express + TypeScript + MySQL, JWT + bcrypt authentication, native WebSockets via the `ws` package. Architecture: MVC + Service + Repository. SQL exists only in repositories; business logic only in services; controllers and WebSocket handlers are thin.
- **Frontend** (`client/`): React + TypeScript + Vite + Tailwind CSS, Axios, React Router, Zustand, and the native WebSocket API. Architecture: Feature-Sliced Design (`app` → `pages` → `widgets` → `features` → `entities` → `shared`).

No Socket.IO anywhere.

## Features

- Register / login / logout with hashed passwords and JWT sessions
- User list with live online/offline presence
- 1-to-1 chat with persisted history, real-time delivery, typing indicators, and unread badges

## Run locally

Requirements: Node.js 20+, MySQL 8+.

**1. Database**

```sql
CREATE DATABASE chat_app;
```

```sh
mysql -u root -p chat_app < server/migrations/001_create_users.sql
mysql -u root -p chat_app < server/migrations/002_create_messages.sql
```

**2. Backend** (terminal 1) — copy `server/.env.example` to `server/.env`, set MySQL credentials and a strong `JWT_SECRET`, then:

```sh
cd server
npm install
npm run dev        # http://localhost:5001
```

**3. Frontend** (terminal 2) — copy `client/.env.example` to `client/.env` (defaults point at `http://localhost:5001`), then:

```sh
cd client
npm install
npm run dev        # http://localhost:5173
```

Open http://localhost:5173, create an account, and open the app in a second browser/incognito window with another account to see real-time chat.

> **Ports:** the API and WebSocket server share one port (5001 by default in the local env — port 5000 is taken by a macOS system process on this machine). API: `http://localhost:5001/api`, WebSocket: `ws://localhost:5001/ws?token=JWT`.

## Scripts

| Project | Command | Purpose |
| ------- | ------- | ------- |
| server | `npm run dev` | Run with `tsx watch` |
| server | `npm run build` / `npm start` | Compile and run `dist/` |
| client | `npm run dev` | Vite dev server |
| client | `npm run build` | Type-check + production build |
| client | `npm run lint` | Oxlint |

## API + WebSocket reference

See `docs/API.md` and `docs/WEBSOCKET.md` (coming with the documentation phase); the endpoints are:

```
POST /api/auth/register     POST /api/auth/login
GET  /api/auth/me           GET /api/users    GET /api/users/:id
GET  /api/messages/:userId
ws://localhost:5001/ws?token=JWT
```

Success responses: `{ "success": true, "data": ... }`. Errors: `{ "success": false, "message": ... }`.