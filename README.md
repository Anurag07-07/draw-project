# 🎨 Draw Project - Collaborative Drawing Platform

<div align="center">

![Draw Project](https://img.shields.io/badge/Draw-Project-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-ISC-green?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?style=for-the-badge&logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)

**A high-performance, real-time collaborative whiteboard built for seamless teamwork.**

[Features](#-features) • [Why This Project?](#-why-this-project) • [Tech Stack](#-tech-stack) • [System Design](#-system-design) • [Getting Started](#-getting-started)

</div>

---

## 🌟 Overview

**Draw Project** is an advanced real-time collaborative drawing application that brings the experience of tools like Excalidraw to a robust, self-hostable platform. It enables teams to brainstorm, sketch, and annotate on an infinite canvas with zero latency.

Unlike simple drawing apps, this project implements a **complex distributed architecture** handling real-time WebSocket synchronization, persistent storage, and scalable room management, all wrapped in a modern, responsive UI.

---

## 🚀 Why This Project? (Key Differentiators)

What makes this project stand out?

1.  **Infinite Canvas Implementation**:
    - Custom-built coordinate system supporting **panning** and **zooming**.
    - Efficient rendering logic that only draws visible elements (viewport culling optimization).
    - Smooth gesture handling for touch devices (mobile/tablet support).

2.  **Robust Real-Time Synchronization**:
    - **Optimistic UI Updates**: The drawer sees their changes instantly while the server acknowledges in the background.
    - **Broadcasting Strategy**: Efficiently routes messages only to users within the same room to minimize bandwidth.
    - **Persistence**: Every stroke is saved to a PostgreSQL database, ensuring no data is lost if the server restarts.

3.  **Advanced Tooling**:
    - **Resize & Manipulation**: Select elements to drag, resize, or delete them.
    - **Rich Styling**: Control stroke color, fill, opacity, and line width.
    - **Multi-Tool Support**: From basic shapes (Rect, Circle) to freehand Pencil and Text.

4.  **Production-Ready Architecture**:
    - **Monorepo Structure**: Managed with Turborepo for efficient builds and code sharing.
    - **Dockerized**: Full containerization support for easy deployment.
    - **Type Safety**: End-to-end TypeScript from database (Prisma) to frontend (React).

---

## ✨ Features

### 🎨 Creative Tools
- **Infinite Canvas**: Pan and zoom without limits.
- **Shape Primitives**: Rectangle, Circle, Line.
- **Freehand Drawing**: Smooth pencil tool for sketching.
- **Text Annotations**: Add labels and notes anywhere.
- **Eraser & Selection**: Delete or modify existing elements.
- **Styling**: Customizable colors, stroke widths, and opacity.

### 🤝 Collaboration
- **Live Multiplayer**: See cursors and drawings of other users in real-time.
- **Room System**: Create private rooms for different sessions.
- **In-Room Chat**: Dedicated chat sidebar for team communication.
- **User Presence**: Live counter of active users in the room.

### 🛠 Technical Features
- **Authentication**: Secure JWT-based signup and login.
- **Responsive Design**: Works on Desktop, Tablet, and Mobile.
- **Dark Mode**: Sleek dark interface for late-night sessions.
- **Export**: Download your canvas as an image.

---

## 🛠 Tech Stack

We chose this stack to balance **performance**, **developer experience**, and **scalability**.

### Frontend (`apps/docs`)
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router) - For SSR and SEO.
- **Language**: [TypeScript](https://www.typescriptlang.org/) - For strict type safety.
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) - For rapid, atomic styling.
- **State/Effects**: React Hooks + Canvas API.
- **Icons**: [Lucide React](https://lucide.dev/).

### Backend (`apps/http-backend` & `apps/ws-backend`)
- **Runtime**: [Node.js](https://nodejs.org/).
- **HTTP Server**: [Express.js](https://expressjs.com/) - For RESTful auth and room APIs.
- **WebSocket Server**: `ws` library - For low-overhead real-time communication.
- **Database**: [PostgreSQL](https://www.postgresql.org/) - Reliable relational storage.
- **ORM**: [Prisma](https://www.prisma.io/) - For type-safe database queries.

### DevOps
- **Build System**: [Turborepo](https://turbo.build/) - High-performance build caching.
- **Package Manager**: [pnpm](https://pnpm.io/) - Disk-efficient dependency management.
- **Containerization**: [Docker](https://www.docker.com/) & Docker Compose.

---

## 🏗 System Design & Implementation

### Data Flow Architecture

1.  **User Action**: A user draws a line on the canvas.
2.  **Optimistic Update**: The React state updates immediately, rendering the line on the user's screen.
3.  **WebSocket Message**: A JSON message (`type: "draw"`) is sent to the `ws-backend`.
4.  **Server Processing**:
    - The server validates the user's session (JWT).
    - The drawing element is **persisted** to the PostgreSQL database via Prisma.
    - The server identifies all other connected clients in the same `roomId`.
5.  **Broadcast**: The server sends the drawing data to those clients.
6.  **Client Sync**: Other clients receive the message and update their React state to render the new line.

### Database Schema

Our schema is designed for relational integrity and speed.

- **User**: Stores credentials and profile info.
- **Room**: Represents a drawing session.
- **DrawingElement**: Stores individual shapes.
    - `path`: Stores JSON stringified coordinates for freehand drawing.
    - `type`: Discriminator for rendering logic (rect, circle, etc.).
- **Chat**: Stores message history for rooms.

---

## 🚀 Getting Started

### Option A: Docker (Recommended)

Run the entire stack with a single command.

```bash
# 1. Clone the repo
git clone https://github.com/Anurag07-07/draw-project.git
cd draw-project

# 2. Start with Docker Compose
docker-compose up -d --build
```

Access the app at `http://localhost:3001`.

### Option B: Manual Setup

**Prerequisites**: Node.js 18+, PostgreSQL, pnpm.

1.  **Install Dependencies**
    ```bash
    pnpm install
    ```

2.  **Database Setup**
    - Create a `.env` file in root:
      ```env
      DATABASE_URL="postgresql://user:password@localhost:5432/draw_project"
      JWT_SECRET="your-secret"
      ```
    - Run migrations:
      ```bash
      cd packages/database
      pnpm prisma migrate dev --name init
      ```

3.  **Build**
    ```bash
    pnpm build
    ```

4.  **Run Development Servers**
    ```bash
    pnpm dev
    ```

---

## 📂 Project Structure

```
.
├── apps/
│   ├── docs/            # Next.js Frontend Application
│   ├── http-backend/    # Express API (Auth, Room creation)
│   └── ws-backend/      # WebSocket Server (Real-time sync)
├── packages/
│   ├── common/          # Shared Zod schemas & types
│   ├── database/        # Prisma Client & Schema
│   ├── ui/              # Shared React components
│   └── ...config/       # Shared TS & ESLint configs
├── docker-compose.yml   # Docker orchestration
└── turbo.json           # Turborepo pipeline config
```

---

## 🔌 API & Events

### WebSocket Events (`ws://localhost:8080`)

| Event Type | Direction | Payload | Description |
|------------|-----------|---------|-------------|
| `join_room` | Client → Server | `{ roomId, token }` | Connect to a specific room. |
| `draw` | Client → Server | `{ roomId, element }` | Send a new drawing shape. |
| `update_draw` | Client → Server | `{ roomId, elementId, updates }` | Resize or move a shape. |
| `delete_draw` | Client → Server | `{ roomId, elementId }` | Remove a shape. |
| `chat` | Bidirectional | `{ roomId, message }` | Send/Receive chat messages. |

### HTTP Endpoints (`http://localhost:3000`)

- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Login & get JWT
- `POST /api/rooms` - Create new room
- `GET /api/rooms/:slug` - Get room data (initial load)

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) (if available) or simply fork and submit a PR.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the ISC License.

---

<div align="center">
  <sub>Built with ❤️ by Anurag</sub>
</div>
