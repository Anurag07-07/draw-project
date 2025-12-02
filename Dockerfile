FROM node:18-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Prune stage for http-backend
FROM base AS prune-http
COPY . .
RUN npm install -g turbo
RUN turbo prune --scope=http-backend --docker

# Prune stage for ws-backend
FROM base AS prune-ws
COPY . .
RUN npm install -g turbo
RUN turbo prune --scope=ws-backend --docker

# Prune stage for frontend
FROM base AS prune-docs
COPY . .
RUN npm install -g turbo
RUN turbo prune --scope=docs --docker

# Builder for http-backend
FROM base AS builder-http
COPY --from=prune-http /app/out/json/ .
COPY --from=prune-http /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
COPY --from=prune-http /app/out/full/ .
RUN pnpm turbo build --filter=http-backend...

# Builder for ws-backend
FROM base AS builder-ws
COPY --from=prune-ws /app/out/json/ .
COPY --from=prune-ws /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
COPY --from=prune-ws /app/out/full/ .
RUN pnpm turbo build --filter=ws-backend...

# Builder for frontend
FROM base AS builder-docs
COPY --from=prune-docs /app/out/json/ .
COPY --from=prune-docs /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
COPY --from=prune-docs /app/out/full/ .
RUN pnpm turbo build --filter=docs...

# Runner for http-backend
FROM base AS http-backend
WORKDIR /app
COPY --from=builder-http /app .
EXPOSE 3000
CMD ["node", "apps/http-backend/dist/index.js"]

# Runner for ws-backend
FROM base AS ws-backend
WORKDIR /app
COPY --from=builder-ws /app .
EXPOSE 8080
CMD ["node", "apps/ws-backend/dist/index.js"]

# Runner for frontend
FROM base AS frontend
WORKDIR /app
COPY --from=builder-docs /app/apps/docs/public ./apps/docs/public
COPY --from=builder-docs /app/apps/docs/.next/standalone ./
COPY --from=builder-docs /app/apps/docs/.next/static ./apps/docs/.next/static
EXPOSE 3001
ENV PORT 3001
CMD ["node", "apps/docs/server.js"]
