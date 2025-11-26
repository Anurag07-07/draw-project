# 🎨 ExcilDraw - Collaborative Real-time Drawing Platform

A powerful, real-time collaborative drawing application built with **Next.js**, **Express**, **WebSockets**, and **PostgreSQL**. Think Excalidraw meets real-time collaboration with persistent storage.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript)
![WebSocket](https://img.shields.io/badge/WebSocket-realtime-green?style=for-the-badge)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)

---

## 📋 Table of Contents

- [What is ExcilDraw?](#what-is-excildraw)
- [Architecture Overview](#architecture-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Routes & Endpoints](#api-routes--endpoints)
- [WebSocket Events](#websocket-events)
- [Frontend Routes](#frontend-routes)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [How It Works](#how-it-works)
- [Contributing](#contributing)

---

## 🎯 What is ExcilDraw?

**ExcilDraw** is a **real-time collaborative drawing platform** where multiple users can:

- 🎨 **Draw together** in real-time on a shared canvas
- 💬 **Chat** while drawing
- 🔐 **Authenticate** with secure JWT-based authentication
- 💾 **Persist drawings** to a PostgreSQL database
- 🚀 **Create private rooms** for team collaboration
- 📱 **Responsive design** with modern, premium UI
- ⚡ **Real-time synchronization** via WebSockets

Perfect for:
- Remote team brainstorming
- Online tutoring with visual aids
- Collaborative design sessions
- Virtual whiteboarding
- Creative collaboration

---

## 🏗️ Architecture Overview

This project uses a **Turborepo monorepo** architecture with three main applications:

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                      │
│              Next.js App (Port 3001)                         │
│        - Landing Page                                        │
│        - Authentication (Sign In/Sign Up)                    │
│        - Canvas/Drawing Interface                            │
│        - Room Management Dashboard                           │
└────────────┬──────────────────────┬──────────────────────────┘
             │                      │
             │ HTTP Requests        │ WebSocket Connection
             │ (Auth, Rooms, Data)  │ (Real-time sync)
             │                      │
     ┌───────▼────────┐    ┌────────▼────────┐
     │  HTTP Backend  │    │  WS Backend     │
     │  Express.js    │    │  WebSocket      │
     │  Port 3000     │    │  Port 8080      │
     │                │    │                 │
     │  - Auth        │    │  - Join Rooms   │
     │  - Rooms       │    │  - Live Drawing │
     │  - User Mgmt   │    │  - Live Chat    │
     │  - JWT Tokens  │    │  - Broadcasting │
     └────────┬───────┘    └────────┬────────┘
              │                     │
              │                     │
              └──────────┬──────────┘
                         │
                  ┌──────▼──────┐
                  │ PostgreSQL  │
                  │  Database   │
                  │   (Prisma)  │
                  │             │
                  │  - Users    │
                  │  - Rooms    │
                  │  - Chats    │
                  │  - Drawings │
                  └─────────────┘
```

---

## ✨ Key Features

### 🎨 Drawing Tools
- **Rectangle Tool** - Draw rectangular shapes
- **Circle Tool** - Draw circular shapes  
- **Line Tool** - Draw straight lines
- **Pencil/Freehand Tool** - Draw freely
- **Text Tool** - Add text annotations
- **Color Picker** - Customize stroke and fill colors
- **Stroke Width** - Adjustable brush sizes
- **Opacity Control** - Transparent elements
- **Clear Canvas** - Remove all drawings
- **Download Canvas** - Export as PNG

### 🤝 Real-time Collaboration
- **Multi-user Support** - Multiple users can draw simultaneously
- **Live Synchronization** - See others' drawings in real-time
- **Real-time Chat** - Communicate while drawing
- **Room-based Isolation** - Each room has its own canvas
- **Persistent State** - Drawings saved to database automatically

### 🔐 Authentication & Security
- **JWT Authentication** - Secure token-based auth
- **HTTP-only Cookies** - Secure session management
- **Bcrypt Password Hashing** - Secure password storage
- **Protected Routes** - Middleware-based route protection
- **WebSocket Token Verification** - Secure WS connections

### 🎭 Premium UI/UX
- **Modern Design** - Glassmorphism, gradients, animations
- **Framer Motion** - Smooth animations and transitions
- **Responsive Layout** - Works on all screen sizes
- **Dark Theme** - Eye-friendly dark interface
- **Toast Notifications** - User feedback with Sonner
- **Loading States** - Elegant loading indicators

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Framer Motion** - Animation library
- **Tailwind CSS 4** - Utility-first CSS
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **Sonner** - Toast notifications
- **js-cookie** - Cookie management

### Backend
- **Express.js** - HTTP server
- **WebSocket (ws)** - Real-time communication
- **Prisma** - ORM for database
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie handling

### DevOps & Tools
- **Turborepo** - Monorepo management
- **pnpm** - Package manager
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

## 📁 Project Structure

```
draw-project/
├── apps/
│   ├── docs/                        # Next.js Frontend Application
│   │   ├── app/
│   │   │   ├── _components/
│   │   │   │   └── Main.tsx         # Landing page component
│   │   │   ├── canvas/[slug]/
│   │   │   │   └── page.tsx         # Canvas/Drawing page
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx         # User dashboard
│   │   │   ├── rooms/
│   │   │   │   └── page.tsx         # Room management
│   │   │   ├── signin/
│   │   │   │   └── page.tsx         # Sign in page
│   │   │   ├── signup/
│   │   │   │   └── page.tsx         # Sign up page
│   │   │   ├── layout.tsx           # Root layout
│   │   │   ├── page.tsx             # Home page
│   │   │   └── globals.css          # Global styles
│   │   └── package.json
│   │
│   ├── http-backend/                # Express HTTP API Server
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   └── user.controller.ts  # Request handlers
│   │   │   ├── middleware/
│   │   │   │   └── auth.ts          # Auth middleware
│   │   │   ├── routes/
│   │   │   │   └── user.route.ts    # API routes
│   │   │   ├── utils/
│   │   │   └── index.ts             # Server entry point
│   │   └── package.json
│   │
│   └── ws-backend/                  # WebSocket Server
│       ├── src/
│       │   └── index.ts             # WebSocket logic
│       └── package.json
│
├── packages/
│   ├── common/                      # Shared utilities
│   ├── database/                    # Prisma schema & client
│   │   ├── prisma/
│   │   │   └── schema.prisma        # Database schema
│   │   └── src/
│   │       └── index.ts             # Prisma client export
│   ├── eslint-config/               # Shared ESLint config
│   ├── typescript-config/           # Shared TS config
│   └── ui/                          # Shared UI components
│
├── .env                             # Environment variables
├── docker-compose.yml               # Docker orchestration
├── Dockerfile                       # Multi-stage Dockerfile
├── package.json                     # Root package.json
├── pnpm-workspace.yaml              # pnpm workspace config
├── turbo.json                       # Turborepo config
└── README.md                        # This file
```

---

## 🗄️ Database Schema

### User Table
```prisma
model User {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String                      // Bcrypt hashed
  photo     String?
  rooms     Room[]                      // Rooms created by user
  chats     Chat[]                      // User's chat messages
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Room Table
```prisma
model Room {
  id              Int              @id @default(autoincrement())
  slug            String           @unique      // URL-friendly identifier
  adminId         String                        // Room creator
  admin           User             @relation(fields: [adminId], references: [id])
  chats           Chat[]                        // Room's chat messages
  drawingElements DrawingElement[]              // Room's drawings
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt
}
```

### Chat Table
```prisma
model Chat {
  id        Int      @id @default(autoincrement())
  message   String
  userId    String
  roomId    Int
  user      User     @relation(fields: [userId], references: [id])
  room      Room     @relation(fields: [roomId], references: [id])
}
```

### DrawingElement Table
```prisma
model DrawingElement {
  id          String   @id @default(uuid())
  roomId      Int
  room        Room     @relation(fields: [roomId], references: [id], onDelete: Cascade)
  userId      String
  type        String   // "rectangle", "circle", "line", "pencil", "text"
  x           Float    // X coordinate
  y           Float    // Y coordinate
  width       Float?   // For rectangle/text
  height      Float?   // For rectangle/text
  radius      Float?   // For circle
  path        String?  // JSON stringified array for pencil tool
  text        String?  // For text elements
  strokeColor String   @default("#000000")
  fillColor   String?
  strokeWidth Float    @default(2)
  opacity     Float    @default(1)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Cascade Delete**: When a room is deleted, all associated drawings are automatically deleted.

---

## 🔌 API Routes & Endpoints

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Routes

#### 1. **Sign Up**
```http
POST /api/v1/signup
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securePassword123"
}

Response (200):
{
  "message": "User Created Successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 2. **Sign In**
```http
POST /api/v1/signin
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securePassword123"
}

Response (200):
{
  "message": "User SignIn Successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Note**: Token is also set as HTTP-only cookie named `token`.

#### 3. **Logout** 🔒
```http
POST /api/v1/logout
Cookie: token=<jwt_token>

Response (200):
{
  "message": "Logout Successfully"
}
```

### Room Management Routes (All Protected 🔒)

#### 4. **Create Room** 🔒
```http
POST /api/v1/create-room
Cookie: token=<jwt_token>
Content-Type: application/json

{
  "slug": "my-awesome-room"
}

Response (200):
{
  "message": "Room Created Successfully",
  "room": {
    "id": 1,
    "slug": "my-awesome-room",
    "adminId": "user-uuid-here",
    "createdAt": "2025-11-26T07:42:09.000Z",
    "updatedAt": "2025-11-26T07:42:09.000Z"
  }
}
```

#### 5. **Get All Rooms** 🔒
```http
GET /api/v1/rooms
Cookie: token=<jwt_token>

Response (200):
{
  "rooms": [
    {
      "id": 1,
      "slug": "my-awesome-room",
      "adminId": "user-uuid",
      "createdAt": "2025-11-26T07:42:09.000Z"
    }
  ]
}
```

#### 6. **Get Room by Slug** 🔒
```http
GET /api/v1/room/:slug
Cookie: token=<jwt_token>

Response (200):
{
  "room": {
    "id": 1,
    "slug": "my-awesome-room",
    "adminId": "user-uuid",
    "createdAt": "2025-11-26T07:42:09.000Z"
  }
}
```

### Drawing Routes (Protected 🔒)

#### 7. **Get Room Drawings** 🔒
```http
GET /api/v1/rooms/:id/drawings
Cookie: token=<jwt_token>

Response (200):
{
  "drawings": [
    {
      "id": "drawing-uuid",
      "type": "rectangle",
      "x": 100,
      "y": 150,
      "width": 200,
      "height": 100,
      "strokeColor": "#000000",
      "fillColor": "#ff0000",
      "strokeWidth": 2,
      "opacity": 1
    }
  ]
}
```

### Chat Routes (Protected 🔒)

#### 8. **Get Room Chats** 🔒
```http
GET /api/v1/chats/:id
Cookie: token=<jwt_token>

Response (200):
{
  "chats": [
    {
      "id": 1,
      "message": "Hello everyone!",
      "userId": "user-uuid",
      "roomId": 1,
      "user": {
        "username": "john_doe"
      }
    }
  ]
}
```

### Token Route (Protected 🔒)

#### 9. **Get Token** 🔒
```http
GET /api/v1/token
Cookie: token=<jwt_token>

Response (200):
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
**Purpose**: Used to retrieve JWT token for WebSocket authentication.

---

## 🔄 WebSocket Events

### WebSocket URL
```
ws://localhost:8080?token=<jwt_token>
```

### Client → Server Events

#### 1. **Join Room**
```javascript
ws.send(JSON.stringify({
  type: "join_room",
  roomId: "1"
}))
```

#### 2. **Leave Room**
```javascript
ws.send(JSON.stringify({
  type: "leave_room",
  roomId: "1"
}))
```

#### 3. **Send Chat Message**
```javascript
ws.send(JSON.stringify({
  type: "chat",
  roomId: "1",
  message: "Hello everyone!"
}))
```

#### 4. **Draw Element**
```javascript
ws.send(JSON.stringify({
  type: "draw",
  roomId: "1",
  element: {
    id: "element-uuid",
    type: "rectangle",
    x: 100,
    y: 150,
    width: 200,
    height: 100,
    strokeColor: "#000000",
    fillColor: "#ff0000",
    strokeWidth: 2,
    opacity: 1
  }
}))
```

#### 5. **Update Drawing Element**
```javascript
ws.send(JSON.stringify({
  type: "update_draw",
  roomId: "1",
  elementId: "element-uuid",
  updates: {
    x: 120,
    y: 170,
    fillColor: "#00ff00"
  }
}))
```

#### 6. **Delete Drawing Element**
```javascript
ws.send(JSON.stringify({
  type: "delete_draw",
  roomId: "1",
  elementId: "element-uuid"
}))
```

#### 7. **Clear Canvas**
```javascript
ws.send(JSON.stringify({
  type: "clear_canvas",
  roomId: "1"
}))
```

### Server → Client Events

All events sent from the server follow the same structure as above. The WebSocket server **broadcasts** events to all users in the same room.

---

## 🌐 Frontend Routes

### Public Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing Page | Homepage with features, CTA, and navigation |
| `/signin` | Sign In | User authentication page |
| `/signup` | Sign Up | New user registration page |

### Protected Routes (Require Authentication)

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Dashboard | User's personal dashboard |
| `/rooms` | Rooms | List of user's rooms, create new rooms |
| `/canvas/[slug]` | Canvas | Drawing canvas for specific room |

### Route Flow

```
User Journey:
1. /                        → Landing page
2. /signup or /signin       → Authentication
3. /dashboard or /rooms     → Room selection/creation
4. /canvas/[room-slug]      → Collaborative drawing
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** 9.0.0
- **PostgreSQL** database
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Anurag07-07/draw-project.git
cd draw-project
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/excildraw?schema=public"

# JWT Secret (Use a strong random string)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Frontend URLs (for CORS)
NEXT_PUBLIC_HTTP_BACKEND_URL="http://localhost:3000"
NEXT_PUBLIC_WS_BACKEND_URL="ws://localhost:8080"
```

4. **Set up the database**

```bash
# Navigate to database package
cd packages/database

# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev --name init

# (Optional) Seed the database
pnpm prisma db seed
```

5. **Start development servers**

From the root directory:

```bash
# Start all services simultaneously
pnpm dev
```

This will start:
- **Frontend** at http://localhost:3001
- **HTTP Backend** at http://localhost:3000
- **WebSocket Backend** at ws://localhost:8080

### Individual Service Commands

```bash
# Start only frontend
turbo dev --filter=docs

# Start only HTTP backend
turbo dev --filter=http-backend

# Start only WebSocket backend
turbo dev --filter=ws-backend
```

---

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `JWT_SECRET` | Secret key for JWT signing | `your-secret-key-min-32-chars` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_HTTP_BACKEND_URL` | HTTP API URL | `http://localhost:3000` |
| `NEXT_PUBLIC_WS_BACKEND_URL` | WebSocket URL | `ws://localhost:8080` |

---

## 🐳 Docker Deployment

See [DOCKER.md](./DOCKER.md) for detailed Docker deployment instructions.

### Quick Docker Start

```bash
# Build and run all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# Stop all services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:3001
- HTTP API: http://localhost:3000
- WebSocket: ws://localhost:8080

---

## 🔍 How It Works

### 1. **Authentication Flow**

```
User Sign Up/Sign In
       ↓
Frontend sends credentials to /api/v1/signup or /signin
       ↓
HTTP Backend validates and creates JWT token
       ↓
Token sent back as response AND set as HTTP-only cookie
       ↓
Frontend stores user state
       ↓
Protected routes check for valid token in cookie
```

### 2. **Room Creation & Access**

```
User clicks "Create Room" in Dashboard
       ↓
Frontend sends POST /api/v1/create-room with slug
       ↓
HTTP Backend creates room in database
       ↓
User redirected to /canvas/[slug]
       ↓
Canvas page loads room data via GET /api/v1/room/:slug
       ↓
WebSocket connection established with JWT token
```

### 3. **Real-time Drawing Synchronization**

```
User A draws a rectangle on canvas
       ↓
Frontend creates DrawingElement object
       ↓
Send via WebSocket: { type: "draw", element: {...} }
       ↓
WebSocket server receives message
       ↓
Server saves element to database (DrawingElement table)
       ↓
Server broadcasts to all users in the same room
       ↓
User B receives the element via WebSocket
       ↓
User B's canvas renders the rectangle
```

### 4. **Chat System**

```
User types message and clicks send
       ↓
Frontend sends: { type: "chat", message: "Hello!", roomId: "1" }
       ↓
WebSocket server receives message
       ↓
Server saves chat to database (Chat table)
       ↓
Server broadcasts to all users in room
       ↓
All users see the new chat message
```

### 5. **Canvas State Persistence**

```
New user joins room
       ↓
Canvas page fetches existing drawings: GET /api/v1/rooms/:id/drawings
       ↓
HTTP Backend queries database for all DrawingElements in room
       ↓
Frontend receives array of drawing elements
       ↓
Canvas renders all existing drawings
       ↓
User sees the current state of the canvas
       ↓
WebSocket connection established for real-time updates
```

---

## 🎨 Drawing Implementation Details

### Canvas Rendering
- Uses HTML5 `<canvas>` element
- Drawing context: `2d`
- Coordinate system: Top-left origin (0,0)

### Supported Drawing Types

1. **Rectangle**
   - Properties: `x, y, width, height, strokeColor, fillColor, strokeWidth, opacity`
   - Rendered with: `ctx.strokeRect()` and `ctx.fillRect()`

2. **Circle**
   - Properties: `x, y, radius, strokeColor, fillColor, strokeWidth, opacity`
   - Rendered with: `ctx.arc()`

3. **Line**
   - Properties: `x, y, width (endX), height (endY), strokeColor, strokeWidth, opacity`
   - Rendered with: `ctx.beginPath()`, `ctx.moveTo()`, `ctx.lineTo()`

4. **Pencil/Freehand**
   - Properties: `path (array of {x, y} points), strokeColor, strokeWidth, opacity`
   - Path stored as JSON string in database
   - Rendered with: `ctx.lineTo()` for each point

5. **Text**
   - Properties: `x, y, text, strokeColor, strokeWidth (fontSize), opacity`
   - Rendered with: `ctx.fillText()`

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Anurag07-07**

- GitHub: [@Anurag07-07](https://github.com/Anurag07-07)

---

## 🙏 Acknowledgments

- **Excalidraw** - Inspiration for the drawing features
- **Next.js Team** - Amazing React framework
- **Vercel** - For Turborepo
- **Prisma Team** - Excellent ORM
- **Framer Motion** - Beautiful animations

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [Turborepo Documentation](https://turborepo.org/docs)
- [Docker Documentation](https://docs.docker.com/)

---

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Error**
```bash
# Make sure PostgreSQL is running
# Check DATABASE_URL in .env
# Run: pnpm prisma generate && pnpm prisma migrate dev
```

**2. WebSocket Connection Failed**
```bash
# Ensure JWT token is valid
# Check WebSocket server is running on port 8080
# Verify CORS settings
```

**3. Port Already in Use**
```bash
# Change ports in respective package.json files
# Update environment variables accordingly
```

**4. Prisma Client Not Found**
```bash
cd packages/database
pnpm prisma generate
```

---

**Made with ❤️ and ☕ by Anurag**

Happy Drawing! 🎨✨
