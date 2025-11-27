# 🎨 Draw Project - Collaborative Drawing Platform

<div align="center">

![Draw Project](https://img.shields.io/badge/Draw-Project-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-ISC-green?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?style=for-the-badge&logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)

**A real-time collaborative drawing application built with Next.js, Express, WebSockets, and Prisma**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture) • [Deployment](#-deployment) • [Troubleshooting](#-troubleshooting)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [WebSocket Events](#-websocket-events)
- [Database Schema](#-database-schema)
- [Deployment](#-deployment)
- [Docker Support](#-docker-support)
- [Scripts](#-scripts)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Draw Project** is a modern, real-time collaborative drawing application similar to Excalidraw. It allows multiple users to draw together on shared canvases, chat in real-time, and manage drawing rooms. The application is built using a **monorepo architecture** powered by Turborepo, featuring separate frontend, HTTP backend, and WebSocket backend services.

### Key Highlights

- 🎨 **Real-time Collaborative Drawing** - Multiple users can draw simultaneously on the same canvas
- 💬 **Live Chat** - Built-in chat system for each drawing room
- 🔐 **Authentication & Authorization** - Secure JWT-based authentication
- 🎯 **Multiple Drawing Tools** - Rectangle, Circle, Line, Pencil (Freehand), Text, Eraser
- 🎨 **Color & Style Customization** - Stroke color, fill color, stroke width, and opacity controls
- 📱 **Touch Support** - Full support for mobile and tablet devices
- 🌙 **Dark/Light Mode** - Theme support with next-themes
- 🚀 **High Performance** - Built with Next.js 16 and optimized WebSocket connections
- 🐳 **Docker Ready** - Complete Docker and Docker Compose setup
- 📦 **Monorepo Structure** - Organized codebase using Turborepo and pnpm workspaces

---

## ✨ Features

### Drawing Tools
- **Rectangle** - Draw rectangular shapes with customizable fill and stroke
- **Circle** - Create circles with adjustable radius
- **Line** - Draw straight lines between two points
- **Pencil** - Freehand drawing with smooth path rendering
- **Text** - Add text annotations to the canvas
- **Eraser** - Remove unwanted drawing elements with click detection

### Collaboration
- **Real-time Synchronization** - See other users' drawings instantly
- **Multi-user Rooms** - Create and join collaborative drawing rooms
- **Live Chat** - Communicate with collaborators in real-time
- **User Presence** - See who's currently in the room

### Customization
- **Color Picker** - Choose from preset colors or custom colors
- **Stroke Width** - Adjustable line thickness
- **Opacity Control** - Set transparency for drawing elements
- **Fill/No Fill** - Toggle fill for shapes

### User Management
- **User Authentication** - Sign up and sign in with username/password
- **Room Administration** - Create and manage drawing rooms
- **Persistent Storage** - All drawings are saved to the database

---

## 🛠 Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[Axios](https://axios-http.com/)** - HTTP client
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management

### Backend
- **[Express.js 5](https://expressjs.com/)** - HTTP server framework
- **[WebSocket (ws)](https://github.com/websockets/ws)** - Real-time bidirectional communication
- **[Prisma](https://www.prisma.io/)** - Database ORM
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[JWT (jsonwebtoken)](https://jwt.io/)** - Authentication tokens
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** - Password hashing
- **[CORS](https://expressjs.com/en/resources/middleware/cors.html)** - Cross-origin resource sharing

### DevOps & Tooling
- **[Turborepo](https://turbo.build/repo)** - Monorepo build system
- **[pnpm](https://pnpm.io/)** - Fast, disk-efficient package manager
- **[Docker](https://www.docker.com/)** - Containerization
- **[Docker Compose](https://docs.docker.com/compose/)** - Multi-container orchestration
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting

---

## 📁 Project Structure

```
draw-project/
├── apps/                           # Application packages
│   ├── docs/                       # Next.js Frontend
│   │   ├── app/                    # Next.js App Router
│   │   │   ├── _components/        # Shared components
│   │   │   ├── canvas/[slug]/      # Canvas page (collaborative drawing)
│   │   │   ├── dashboard/          # User dashboard
│   │   │   ├── rooms/              # Rooms listing page
│   │   │   ├── signin/             # Sign in page
│   │   │   ├── signup/             # Sign up page
│   │   │   ├── api.ts              # Axios instance with auth
│   │   │   ├── config.ts           # Backend URLs configuration
│   │   │   ├── globals.css         # Global styles
│   │   │   └── layout.tsx          # Root layout
│   │   ├── public/                 # Static assets
│   │   ├── next.config.ts          # Next.js configuration
│   │   ├── tailwind.config.ts      # Tailwind configuration
│   │   └── package.json
│   │
│   ├── http-backend/               # HTTP API Server
│   │   ├── src/
│   │   │   ├── controllers/        # Route controllers
│   │   │   ├── middleware/         # Express middleware (auth)
│   │   │   ├── routes/             # API routes
│   │   │   ├── utils/              # Utility functions
│   │   │   └── index.ts            # Express server entry
│   │   ├── dist/                   # Compiled JavaScript (build output)
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── ws-backend/                 # WebSocket Server
│       ├── src/
│       │   └── index.ts            # WebSocket server entry
│       ├── dist/                   # Compiled JavaScript (build output)
│       ├── tsconfig.json
│       └── package.json
│
├── packages/                       # Shared packages
│   ├── common/                     # Common utilities
│   ├── database/                   # Prisma schema & client
│   │   ├── prisma/
│   │   │   └── schema.prisma       # Database schema
│   │   ├── dist/                   # Generated Prisma client
│   │   └── package.json
│   ├── eslint-config/              # Shared ESLint configs
│   ├── typescript-config/          # Shared TypeScript configs
│   └── ui/                         # Shared UI components
│
├── .dockerignore                   # Docker ignore rules
├── .env                            # Environment variables
├── .gitignore
├── docker-compose.yml              # Docker Compose configuration
├── Dockerfile                      # Multi-stage Dockerfile
├── package.json                    # Root package.json
├── pnpm-lock.yaml                  # pnpm lock file
├── pnpm-workspace.yaml             # pnpm workspace config
├── turbo.json                      # Turborepo configuration
├── README.md                       # This file
├── DOCKER.md                       # Docker setup guide
├── CORS_FIX_GUIDE.md               # CORS troubleshooting
├── DOCKER_FIXES.md                 # Docker troubleshooting
└── TROUBLESHOOTING_DEPLOYMENT.md   # Deployment troubleshooting
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **pnpm** >= 9.0.0 ([Install](https://pnpm.io/installation))
- **PostgreSQL** >= 14.0 ([Download](https://www.postgresql.org/download/))
- **Git** ([Download](https://git-scm.com/downloads))

**Optional (for Docker deployment):**
- **Docker** ([Install](https://docs.docker.com/get-docker/))
- **Docker Compose** ([Install](https://docs.docker.com/compose/install/))

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Anurag07-07/draw-project.git
cd draw-project
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all dependencies for all workspaces in the monorepo.

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# .env
DATABASE_URL="postgresql://username:password@localhost:5432/draw_project?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

**Frontend Environment Variables** (optional, for production deployment):

Create `apps/docs/.env.local`:

```bash
NEXT_PUBLIC_HTTP_BACKEND=http://localhost:3000
NEXT_PUBLIC_WS_BACKEND=ws://localhost:8080
```

### 4. Set Up the Database

```bash
# Navigate to the database package
cd packages/database

# Generate Prisma Client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev --name init

# (Optional) Seed the database
pnpm prisma db seed
```

### 5. Build All Packages

From the root directory:

```bash
pnpm build
```

This will build all packages in the correct order using Turborepo.

### 6. Start Development Servers

Open **three separate terminal windows**:

**Terminal 1 - Frontend** (runs on port 3001):
```bash
cd apps/docs
pnpm dev
```

**Terminal 2 - HTTP Backend** (runs on port 3000):
```bash
cd apps/http-backend
pnpm dev
```

**Terminal 3 - WebSocket Backend** (runs on port 8080):
```bash
cd apps/ws-backend
pnpm dev
```

**OR** use Turborepo to run all dev servers at once:

```bash
pnpm dev
```

### 7. Access the Application

Open your browser and navigate to:

```
http://localhost:3001
```

---

## 🏗 Architecture

The application follows a **microservices architecture** with three main components:

### 1. Frontend (Next.js)
- **Port**: 3001
- **Responsibility**: User interface, routing, client-side state management
- **Key Features**:
  - Server-side rendering (SSR) with Next.js App Router
  - Real-time canvas updates via WebSocket
  - JWT token management in localStorage and cookies
  - Responsive design with Tailwind CSS

### 2. HTTP Backend (Express)
- **Port**: 3000
- **Responsibility**: RESTful API, authentication, room management
- **Key Endpoints**:
  - `POST /api/auth/signup` - User registration
  - `POST /api/auth/signin` - User login
  - `GET /api/rooms` - Get all rooms (authenticated)
  - `POST /api/rooms` - Create a new room (authenticated)
  - `GET /api/rooms/:slug` - Get room details

### 3. WebSocket Backend (ws)
- **Port**: 8080
- **Responsibility**: Real-time communication, drawing synchronization, chat
- **Key Events**:
  - `join-room` - User joins a drawing room
  - `draw` - User draws on canvas (broadcast to others)
  - `clear-canvas` - Clear all drawings
  - `chat-message` - Send/receive chat messages
  - `user-joined` / `user-left` - User presence updates

### Data Flow

```
┌─────────────┐         HTTP/REST          ┌─────────────────┐
│             │ ◄─────────────────────────► │                 │
│   Next.js   │                             │  HTTP Backend   │
│  Frontend   │                             │   (Express)     │
│             │         WebSocket           │                 │
│   (3001)    │ ◄───────────────────┐       │     (3000)      │
└─────────────┘                     │       └─────────────────┘
                                    │                │
                                    │                │
                                    │                │ Prisma
                                    ▼                ▼
                          ┌─────────────────┐  ┌──────────────┐
                          │   WebSocket     │  │  PostgreSQL  │
                          │    Backend      │  │   Database   │
                          │      (ws)       │  │              │
                          │     (8080)      │  │              │
                          └─────────────────┘  └──────────────┘
                                    │ Prisma
                                    ▼
                          ┌──────────────────┐
                          │   PostgreSQL     │
                          │    Database      │
                          └──────────────────┘
```

---

## 🔐 Environment Variables

### Root `.env`

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ | - |
| `JWT_SECRET` | Secret key for JWT signing | ✅ | - |

### Frontend `.env.local` (apps/docs/)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_HTTP_BACKEND` | HTTP backend URL | ❌ | `http://localhost:3000` |
| `NEXT_PUBLIC_WS_BACKEND` | WebSocket backend URL | ❌ | `ws://localhost:8080` |

---

## 📡 API Documentation

### Authentication

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "username": "johndoe"
  }
}
```

#### Sign In
```http
POST /api/auth/signin
Content-Type: application/json

{
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "username": "johndoe"
  }
}
```

### Rooms

#### Get All Rooms
```http
GET /api/rooms
Authorization: Bearer <token>
```

**Response:**
```json
{
  "rooms": [
    {
      "id": 1,
      "slug": "my-awesome-room",
      "adminId": "uuid-here",
      "createdAt": "2025-11-27T12:00:00.000Z"
    }
  ]
}
```

#### Create Room
```http
POST /api/rooms
Authorization: Bearer <token>
Content-Type: application/json

{
  "slug": "my-new-room"
}
```

**Response:**
```json
{
  "room": {
    "id": 2,
    "slug": "my-new-room",
    "adminId": "uuid-here",
    "createdAt": "2025-11-27T12:00:00.000Z"
  }
}
```

#### Get Room by Slug
```http
GET /api/rooms/:slug
```

**Response:**
```json
{
  "room": {
    "id": 1,
    "slug": "my-awesome-room",
    "adminId": "uuid-here",
    "drawingElements": [...],
    "chats": [...]
  }
}
```

---

## 🔌 WebSocket Events

### Client → Server

#### Join Room
```javascript
ws.send(JSON.stringify({
  type: 'join-room',
  roomId: 'room-slug',
  token: 'jwt-token'
}));
```

#### Draw Element
```javascript
ws.send(JSON.stringify({
  type: 'draw',
  roomId: 'room-slug',
  element: {
    id: 'element-uuid',
    type: 'rectangle', // 'rectangle', 'circle', 'line', 'pencil', 'text'
    x: 100,
    y: 100,
    width: 200,
    height: 150,
    strokeColor: '#000000',
    fillColor: '#FF0000',
    strokeWidth: 2,
    opacity: 1
  }
}));
```

#### Delete Element (Eraser)
```javascript
ws.send(JSON.stringify({
  type: 'delete-element',
  roomId: 'room-slug',
  elementId: 'element-uuid'
}));
```

#### Send Chat Message
```javascript
ws.send(JSON.stringify({
  type: 'chat-message',
  roomId: 'room-slug',
  message: 'Hello everyone!'
}));
```

### Server → Client

#### Initial State
```javascript
{
  type: 'initial-state',
  elements: [...],
  chats: [...],
  users: [...]
}
```

#### New Drawing
```javascript
{
  type: 'new-drawing',
  element: {...}
}
```

#### Element Deleted
```javascript
{
  type: 'element-deleted',
  elementId: 'element-uuid'
}
```

#### New Chat Message
```javascript
{
  type: 'new-chat',
  chat: {
    id: 123,
    message: 'Hello!',
    userId: 'user-uuid',
    username: 'johndoe'
  }
}
```

#### User Joined
```javascript
{
  type: 'user-joined',
  userId: 'user-uuid',
  username: 'johndoe'
}
```

#### User Left
```javascript
{
  type: 'user-left',
  userId: 'user-uuid'
}
```

---

## 🗄 Database Schema

### User
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary key |
| `username` | String | Unique username |
| `password` | String | Hashed password (bcrypt) |
| `photo` | String? | Optional profile photo URL |
| `createdAt` | DateTime | Account creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

### Room
| Field | Type | Description |
|-------|------|-------------|
| `id` | Int | Primary key (auto-increment) |
| `slug` | String | Unique room identifier |
| `adminId` | String | Foreign key to User |
| `createdAt` | DateTime | Room creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

### DrawingElement
| Field | Type | Description |
|-------|------|-------------|
| `id` | String (UUID) | Primary key |
| `roomId` | Int | Foreign key to Room |
| `userId` | String | User who created the element |
| `type` | String | Element type (rectangle, circle, line, pencil, text) |
| `x` | Float | X coordinate |
| `y` | Float | Y coordinate |
| `width` | Float? | Width (for rectangles) |
| `height` | Float? | Height (for rectangles) |
| `radius` | Float? | Radius (for circles) |
| `path` | String? | JSON path data (for pencil) |
| `text` | String? | Text content (for text) |
| `strokeColor` | String | Stroke color (hex) |
| `fillColor` | String? | Fill color (hex) |
| `strokeWidth` | Float | Stroke width (default: 2) |
| `opacity` | Float | Opacity (default: 1) |
| `createdAt` | DateTime | Creation timestamp |
| `updatedAt` | DateTime | Last update timestamp |

### Chat
| Field | Type | Description |
|-------|------|-------------|
| `id` | Int | Primary key (auto-increment) |
| `message` | String | Chat message content |
| `userId` | String | Foreign key to User |
| `roomId` | Int | Foreign key to Room |

---

## 🚢 Deployment

### Environment Setup

For production deployment, you need to:

1. **Set up a PostgreSQL database** (e.g., on Railway, Neon, Supabase, or AWS RDS)
2. **Deploy the HTTP Backend** (e.g., on Railway, Render, or Fly.io)
3. **Deploy the WebSocket Backend** (e.g., on Railway, Render, or Fly.io)
4. **Deploy the Frontend** (e.g., on Vercel, Netlify, or Railway)

### Deployment Checklist

- [ ] Set `DATABASE_URL` environment variable
- [ ] Set `JWT_SECRET` environment variable (use a strong random string)
- [ ] Set `NEXT_PUBLIC_HTTP_BACKEND` to your HTTP backend URL
- [ ] Set `NEXT_PUBLIC_WS_BACKEND` to your WebSocket backend URL
- [ ] Run Prisma migrations on production database
- [ ] Configure CORS origins in `apps/http-backend/src/index.ts`
- [ ] Enable HTTPS for production (especially important for WebSocket)

### Build Commands

**HTTP Backend:**
```bash
cd apps/http-backend && npm install && npm run build && npm run start
```

**WebSocket Backend:**
```bash
cd apps/ws-backend && npm install && npm run build && npm run start
```

**Frontend:**
```bash
cd apps/docs && npm install && npm run build && npm run start
```

### Example Railway Deployment

1. **Create three services** in Railway:
   - `draw-http-backend`
   - `draw-ws-backend`
   - `draw-frontend`

2. **HTTP Backend Service:**
   - Build Command: `cd apps/http-backend && pnpm install && pnpm run build`
   - Start Command: `cd apps/http-backend && pnpm run start`
   - Environment Variables: `DATABASE_URL`, `JWT_SECRET`, `PORT`

3. **WebSocket Backend Service:**
   - Build Command: `cd apps/ws-backend && pnpm install && pnpm run build`
   - Start Command: `cd apps/ws-backend && pnpm run start`
   - Environment Variables: `DATABASE_URL`, `JWT_SECRET`, `PORT`

4. **Frontend Service:**
   - Build Command: `cd apps/docs && pnpm install && pnpm run build`
   - Start Command: `cd apps/docs && pnpm run start`
   - Environment Variables: `NEXT_PUBLIC_HTTP_BACKEND`, `NEXT_PUBLIC_WS_BACKEND`

---

## 🐳 Docker Support

The project includes full Docker and Docker Compose support for easy deployment.

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

This will start:
- Frontend on port **3001**
- HTTP Backend on port **3000**
- WebSocket Backend on port **8080**

### Build Individual Docker Images

```bash
# Frontend
docker build --target frontend -t draw-frontend .

# HTTP Backend
docker build --target http-backend -t draw-http-backend .

# WebSocket Backend
docker build --target ws-backend -t draw-ws-backend .
```

### Docker Environment Variables

Create a `.env` file for Docker Compose:

```bash
DATABASE_URL=postgresql://user:password@db:5432/draw_project
JWT_SECRET=your-secret-key
NEXT_PUBLIC_HTTP_BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_WS_BACKEND_URL=ws://localhost:8080
```

For more details, see [DOCKER.md](DOCKER.md).

---

## 📜 Scripts

### Root Scripts

```bash
# Install all dependencies
pnpm install

# Run all dev servers
pnpm dev

# Build all packages
pnpm build

# Lint all packages
pnpm lint

# Type-check all packages
pnpm check-types

# Format code
pnpm format
```

### Frontend Scripts (apps/docs)

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint
pnpm lint

# Type-check
pnpm check-types
```

### Backend Scripts (apps/http-backend, apps/ws-backend)

```bash
# Build TypeScript
pnpm build

# Start server
pnpm start

# Development (build + start)
pnpm dev
```

### Database Scripts (packages/database)

```bash
# Generate Prisma Client
pnpm prisma generate

# Create migration
pnpm prisma migrate dev --name migration_name

# Apply migrations
pnpm prisma migrate deploy

# Open Prisma Studio
pnpm prisma studio

# Reset database
pnpm prisma migrate reset
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. **Cannot connect to database**

**Error:** `PrismaClientInitializationError: Can't reach database server`

**Solution:**
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database exists
- Test connection: `psql "postgresql://user:pass@localhost:5432/draw_project"`

#### 2. **401 Unauthorized on API calls**

**Solution:**
- Ensure you're signed in
- Check that JWT token is in `localStorage` (key: `token`)
- Verify `Authorization` header is being sent
- Check JWT_SECRET matches between frontend and backend

#### 3. **WebSocket connection failed**

**Solution:**
- Verify WebSocket backend is running on port 8080
- Check `NEXT_PUBLIC_WS_BACKEND` in frontend config
- Ensure JWT token is valid
- Check browser console for WebSocket errors

#### 4. **CORS errors in production**

**Solution:**
- Update CORS origins in `apps/http-backend/src/index.ts`
- Add your frontend domain to allowed origins
- Ensure credentials are enabled: `credentials: true`
- See [CORS_FIX_GUIDE.md](CORS_FIX_GUIDE.md)

#### 5. **Prisma Client not found**

**Error:** `@prisma/client did not initialize yet`

**Solution:**
```bash
cd packages/database
pnpm prisma generate
cd ../..
pnpm build
```

#### 6. **Port already in use**

**Error:** `EADDRINUSE: address already in use`

**Solution:**
```bash
# Find process using the port (e.g., 3000)
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i :3000

# Kill the process
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

### Additional Resources

- [TROUBLESHOOTING_DEPLOYMENT.md](TROUBLESHOOTING_DEPLOYMENT.md) - Deployment-specific issues
- [DOCKER_FIXES.md](DOCKER_FIXES.md) - Docker-related troubleshooting
- [CORS_FIX_GUIDE.md](CORS_FIX_GUIDE.md) - CORS configuration guide

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "Add some amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style

- Use **TypeScript** for all new code
- Follow the existing **ESLint** configuration
- Run `pnpm format` before committing
- Ensure all tests pass: `pnpm test`

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Anurag**
- GitHub: [@Anurag07-07](https://github.com/Anurag07-07)

---

## 🙏 Acknowledgments

- Inspired by [Excalidraw](https://excalidraw.com/)
- Built with [Next.js](https://nextjs.org/)
- Powered by [Turborepo](https://turbo.build/repo)
- UI components from [shadcn/ui](https://ui.shadcn.com/)

---

<div align="center">

**⭐ If you find this project helpful, please consider giving it a star! ⭐**

</div>
