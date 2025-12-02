# 🐳 Docker Setup Guide

This guide explains how to run the Draw Project using Docker and Docker Compose.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed (usually included with Docker Desktop)

## 🚀 Quick Start (Docker Compose)

The easiest way to run the entire stack is using Docker Compose.

### 1. Start All Services

```bash
docker-compose up -d --build
```

This command will:
1. Build the images for Frontend, HTTP Backend, and WebSocket Backend.
2. Pull the PostgreSQL image.
3. Start all containers in detached mode.

### 2. Verify Services

Check if containers are running:

```bash
docker-compose ps
```

You should see 4 services running:
- `draw-project-frontend-1` (Port 3001)
- `draw-project-http-backend-1` (Port 3000)
- `draw-project-ws-backend-1` (Port 8080)
- `draw-project-db-1` (Port 5432)

### 3. Access the Application

- **Frontend:** [http://localhost:3001](http://localhost:3001)
- **HTTP Backend:** [http://localhost:3000](http://localhost:3000)
- **WebSocket Backend:** [ws://localhost:8080](ws://localhost:8080)

### 4. Stop Services

```bash
docker-compose down
```

To stop and remove volumes (reset database):

```bash
docker-compose down -v
```

## 🛠 Building Individual Images

You can build specific images using the multi-stage Dockerfile.

### Frontend

```bash
docker build --target frontend -t draw-frontend .
```

### HTTP Backend

```bash
docker build --target http-backend -t draw-http-backend .
```

### WebSocket Backend

```bash
docker build --target ws-backend -t draw-ws-backend .
```

## ⚙️ Configuration

The `docker-compose.yml` file comes with default configuration for development.

### Environment Variables

You can override environment variables in `docker-compose.yml` or by creating a `.env` file in the root directory.

**Default Database Credentials:**
- User: `postgres`
- Password: `password`
- Database: `draw_project`

**Backend URLs:**
- HTTP Backend: `http://localhost:3000`
- WebSocket Backend: `ws://localhost:8080`

## 🐛 Troubleshooting

### Database Connection Issues

If the backends cannot connect to the database:
1. Ensure the `db` service is healthy.
2. Check `DATABASE_URL` in `docker-compose.yml`. It should use the service name `db` as the hostname (e.g., `postgresql://postgres:password@db:5432/draw_project`).

### Port Conflicts

If ports 3000, 3001, 8080, or 5432 are already in use on your host machine, modify the `ports` mapping in `docker-compose.yml`:

```yaml
ports:
  - "3002:3001" # Host port 3002 -> Container port 3001
```

### Rebuilding

If you make changes to the code, you need to rebuild the images:

```bash
docker-compose up -d --build
```
