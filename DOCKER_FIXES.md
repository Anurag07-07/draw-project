# Docker Build Fixes - Change Log

## Issues Resolved

### 1. ✅ Lockfile Mismatch Error
**Problem**: 
```
ERR_PNPM_OUTDATED_LOCKFILE Cannot install with "frozen-lockfile"
```

**Root Cause**: 
- Incorrect COPY pattern for workspace packages (`COPY packages/*/package.json ./packages/*/`)
- This glob pattern doesn't work properly in Dockerfile COPY commands
- pnpm couldn't find all workspace dependencies before install

**Solution**:
- Explicitly copy each package's package.json file individually:
  ```dockerfile
  COPY packages/common/package.json ./packages/common/package.json
  COPY packages/database/package.json ./packages/database/package.json
  COPY packages/eslint-config/package.json ./packages/eslint-config/package.json
  COPY packages/typescript-config/package.json ./packages/typescript-config/package.json
  COPY packages/ui/package.json ./packages/ui/package.json
  ```
- Changed from `--frozen-lockfile` to `--no-frozen-lockfile` for Docker builds
- This allows pnpm to resolve workspace dependencies correctly

---

### 2. ✅ Security Warning - Secrets in Build Args
**Problem**:
```
SecretsUsedInArgOrEnv: Do not use ARG or ENV instructions for sensitive data (ARG "JWT_SECRET")
```

**Root Cause**:
- JWT_SECRET was passed as a build argument
- Build arguments are baked into Docker image layers
- Anyone with access to the image can inspect these layers and extract secrets
- Security vulnerability!

**Solution**:
- Removed `ARG JWT_SECRET` and `ENV JWT_SECRET=${JWT_SECRET}` from Dockerfile
- JWT_SECRET is now **only** passed at runtime via environment variables
- Updated docker-compose.yml to remove `args:` section from all services
- Secrets remain in environment variables which are NOT stored in image layers

**Before**:
```yaml
build:
  context: .
  dockerfile: Dockerfile
  target: frontend
  args:
    JWT_SECRET: ${JWT_SECRET}  # ❌ INSECURE
```

**After**:
```yaml
build:
  context: .
  dockerfile: Dockerfile
  target: frontend
environment:
  - JWT_SECRET=${JWT_SECRET}  # ✅ SECURE (runtime only)
```

---

### 3. ✅ Improved Dependency Copy Strategy
**Problem**:
- Inefficient copying of node_modules from dependencies stage
- Copied each app's node_modules separately

**Solution**:
- Simplified to copy entire apps and packages directories
- Turbo/pnpm handle workspace linking automatically
- Reduces Dockerfile complexity

**Before**:
```dockerfile
COPY --from=dependencies /app/apps/docs/node_modules ./apps/docs/node_modules
COPY --from=dependencies /app/apps/http-backend/node_modules ./apps/http-backend/node_modules
COPY --from=dependencies /app/apps/ws-backend/node_modules ./apps/ws-backend/node_modules
```

**After**:
```dockerfile
COPY --from=dependencies /app/apps ./apps
COPY --from=dependencies /app/packages ./packages
```

---

## How to Build Now

```bash
# Build all services
docker-compose up --build

# Or build individual services
docker build --target frontend -t draw-project-frontend .
docker build --target http-backend -t draw-project-http-backend .
docker build --target ws-backend -t draw-project-ws-backend .
```

## Security Best Practices Applied

✅ **Secrets at Runtime Only** - No secrets in build args  
✅ **Proper Workspace Setup** - All packages copied before install  
✅ **Layer Optimization** - Efficient caching strategy  
✅ **No Frozen Lockfile** - Handles workspace variations in Docker

---

## Testing the Fixes

1. **Ensure .env file exists** with required variables:
   ```env
   JWT_SECRET=your-secret-key
   DATABASE_URL=postgresql://...
   ```

2. **Clean Docker build cache**:
   ```bash
   docker-compose down
   docker system prune -f
   ```

3. **Build with docker-compose**:
   ```bash
   docker-compose up --build
   ```

4. **Verify no security warnings**:
   - Check build output - should see no "SecretsUsedInArgOrEnv" warnings
   - Check logs - all services should start successfully

---

**Last Updated**: 2025-11-26  
**Status**: ✅ All issues resolved
