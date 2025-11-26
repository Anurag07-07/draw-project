# ============================================
# Multi-stage Dockerfile for Turborepo Monorepo
# Includes: Next.js frontend + Node.js backends
# ============================================

# ============================================
# Stage 1: Base - Install dependencies
# ============================================
FROM node:18-alpine AS base

# Enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy all workspace package.json files with proper structure
COPY apps/docs/package.json ./apps/docs/package.json
COPY apps/http-backend/package.json ./apps/http-backend/package.json
COPY apps/ws-backend/package.json ./apps/ws-backend/package.json

# Copy packages - need to create directory structure first
COPY packages/common/package.json ./packages/common/package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
COPY packages/ui/package.json ./packages/ui/package.json

# ============================================
# Stage 2: Dependencies - Install all dependencies
# ============================================
FROM base AS dependencies

# Use --no-frozen-lockfile for Docker builds to handle workspace variations
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile

# ============================================
# Stage 3: Builder - Build all applications
# ============================================
FROM base AS builder

# Copy node_modules from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /app/apps ./apps
COPY --from=dependencies /app/packages ./packages

# Copy source code
COPY . .

# Build all applications using Turbo
# JWT_SECRET is only needed at runtime, not build time
RUN pnpm run build

# ============================================
# Stage 4: Frontend Runner - Next.js App
# ============================================
FROM node:18-alpine AS frontend

WORKDIR /app

# Copy only necessary files for Next.js
COPY --from=builder /app/apps/docs/package.json ./apps/docs/
COPY --from=builder /app/apps/docs/.next ./apps/docs/.next
COPY --from=builder /app/apps/docs/public ./apps/docs/public
COPY --from=builder /app/apps/docs/next.config.js ./apps/docs/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001

WORKDIR /app/apps/docs

EXPOSE 3001

CMD ["npm", "run", "start"]

# ============================================
# Stage 5: HTTP Backend Runner
# ============================================
FROM node:18-alpine AS http-backend

WORKDIR /app

# Copy built files
COPY --from=builder /app/apps/http-backend/dist ./apps/http-backend/dist
COPY --from=builder /app/apps/http-backend/package.json ./apps/http-backend/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

# Set environment variables
ENV NODE_ENV=production

WORKDIR /app/apps/http-backend

EXPOSE 3000

CMD ["npm", "run", "start"]

# ============================================
# Stage 6: WebSocket Backend Runner
# ============================================
FROM node:18-alpine AS ws-backend

WORKDIR /app

# Copy built files
COPY --from=builder /app/apps/ws-backend/dist ./apps/ws-backend/dist
COPY --from=builder /app/apps/ws-backend/package.json ./apps/ws-backend/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

# Set environment variables
ENV NODE_ENV=production

WORKDIR /app/apps/ws-backend

EXPOSE 8080

CMD ["npm", "run", "start"]
