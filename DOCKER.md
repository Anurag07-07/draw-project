# Docker Deployment Guide

This guide explains how to build and run the Draw Project using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose installed (usually comes with Docker Desktop)
- `.env` file configured with required environment variables

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# JWT Secret for authentication
JWT_SECRET=your_secret_key_here

# Database connection string
DATABASE_URL=your_database_url_here

# Backend URLs (optional, defaults provided)
NEXT_PUBLIC_HTTP_BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_WS_BACKEND_URL=ws://localhost:8080
```

## Quick Start with Docker Compose

### Build and run all services:
```bash
docker-compose up --build
```

### Run in detached mode (background):
```bash
docker-compose up -d
```

### Stop all services:
```bash
docker-compose down
```

### View logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f frontend
docker-compose logs -f http-backend
docker-compose logs -f ws-backend
```

## Building Individual Services

### Build Frontend Only:
```bash
docker build --target frontend -t draw-project-frontend .
docker run -p 3001:3001 --env-file .env draw-project-frontend
```

### Build HTTP Backend Only:
```bash
docker build --target http-backend -t draw-project-http-backend .
docker run -p 3000:3000 --env-file .env draw-project-http-backend
```

### Build WebSocket Backend Only:
```bash
docker build --target ws-backend -t draw-project-ws-backend .
docker run -p 8080:8080 --env-file .env draw-project-ws-backend
```

**Note**: JWT_SECRET and other secrets are passed at **runtime** via environment variables, not at build time. This is a security best practice as build arguments can be inspected in image layers.

## Accessing the Application

Once all services are running:

- **Frontend (Next.js)**: http://localhost:3001
- **HTTP Backend API**: http://localhost:3000
- **WebSocket Backend**: ws://localhost:8080

## Production Deployment

For production deployment, make sure to:

1. Set strong `JWT_SECRET` value
2. Configure proper `DATABASE_URL`
3. Update backend URLs in environment variables
4. Use a reverse proxy (nginx/traefik) for SSL termination
5. Configure proper CORS settings

## Troubleshooting

### Build failures:
```bash
# Clean build cache
docker-compose build --no-cache
```

### Port conflicts:
If ports are already in use, modify the ports in `docker-compose.yml`:
```yaml
ports:
  - "NEW_PORT:CONTAINER_PORT"
```

### Checking container status:
```bash
docker-compose ps
```

### Restart specific service:
```bash
docker-compose restart frontend
```

## Architecture

The Dockerfile uses multi-stage builds with the following stages:

1. **base**: Sets up pnpm and copies package files
2. **dependencies**: Installs all dependencies
3. **builder**: Builds all applications using Turbo
4. **frontend**: Production Next.js runner
5. **http-backend**: Production HTTP backend runner
6. **ws-backend**: Production WebSocket backend runner

This approach minimizes final image sizes and optimizes build caching.
