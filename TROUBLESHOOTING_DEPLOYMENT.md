# Deployment Troubleshooting Guide

## Current Issues

### 1. CORS Error (Failed to Fetch Rooms)
**Error:** 
```
Access to XMLHttpRequest at 'https://draw-project-7.onrender.com/api/v1/signup' from origin 'https://draw-project-docs-63gsa0mio-anurag07-07s-projects.vercel.app' has been blocked by CORS policy
```

**Root Cause:** Backend CORS configuration doesn't allow your deployed frontend URL.

**Status:** ✅ **FIXED** - Need to redeploy backend

---

## Solution Steps

### Step 1: Verify Git Changes Pushed ✅
The CORS fix has been committed. Now push to your repository:

```bash
git push
```

### Step 2: Wait for Render Deployment
1. Go to your Render dashboard: https://dashboard.render.com/
2. Find your `draw-project-7` service
3. Watch the "Events" tab for deployment status
4. Wait for "Deploy live" message (usually 2-5 minutes)

### Step 3: Verify CORS Configuration

After deployment, you can verify the CORS headers by making a test request:

```bash
curl -I -X OPTIONS https://draw-project-7.onrender.com/api/v1/rooms \
  -H "Origin: https://draw-project-docs-63gsa0mio-anurag07-07s-projects.vercel.app" \
  -H "Access-Control-Request-Method: GET"
```

Look for these headers in the response:
- `Access-Control-Allow-Origin: https://draw-project-docs-63gsa0mio-anurag07-07s-projects.vercel.app`
- `Access-Control-Allow-Credentials: true`

### Step 4: Test Your Application

1. Open your Vercel frontend: https://draw-project-docs-63gsa0mio-anurag07-07s-projects.vercel.app
2. Open browser DevTools (F12)
3. Go to the Network tab
4. Try to sign in or fetch rooms
5. Check if the API requests succeed

---

## Additional Checks

### Check 1: Backend Environment Variables on Render

Optionally, you can set explicit CORS origins in Render:

1. Go to Render Dashboard → Your Service → Environment
2. Add environment variable:
   - **Key:** `ALLOWED_ORIGINS`
   - **Value:** `http://localhost:3001,https://draw-project-docs-63gsa0mio-anurag07-07s-projects.vercel.app,https://draw-project-docs.vercel.app`
3. **This is optional** - the code already has these defaults

### Check 2: Frontend Environment Variables on Vercel

Verify your frontend is using the correct backend URL:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Ensure these are set:
   - `NEXT_PUBLIC_HTTP_BACKEND=https://draw-project-7.onrender.com`
   - `NEXT_PUBLIC_WS_BACKEND=wss://YOUR_WEBSOCKET_URL`
3. **Important:** After changing env vars, you must **redeploy** on Vercel

### Check 3: Authentication

The `/rooms` endpoint requires authentication. Make sure:
- User is signed in
- Cookies are being sent with requests (`withCredentials: true`) ✅ Already set in code
- JWT token is valid and not expired

---

## Common Issues & Fixes

### Issue: "Still getting CORS error after deployment"

**Possible Causes:**
1. **Browser cache** - Clear cache or test in incognito
2. **Old code still running** - Check Render deployment logs
3. **Wrong environment** - Verify you're testing the right URLs

**Fix:**
```bash
# Hard refresh browser
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)

# Or test in incognito/private window
```

### Issue: "Rooms array is empty"

**Possible Causes:**
1. No rooms created yet
2. Database not connected
3. Authentication issue

**Fix:**
- Create a room first from dashboard
- Check Render logs for database connection errors
- Verify JWT token is being sent

### Issue: "401 Unauthorized"

**Possible Causes:**
1. User not signed in
2. JWT token expired
3. Cookie not being sent

**Fix:**
- Sign in again
- Check that `withCredentials: true` is set on axios requests ✅ Already set
- Verify cookies are allowed in browser

---

## Monitoring Deployment

### Watch Render Logs Live

1. Go to Render Dashboard → Your Service → Logs
2. Watch for deployment messages:
   ```
   ==> Starting service with 'npm start'
   ==> Server Run at Port 3000
   ```

### Check for Errors

Common deployment errors:
- **Build failed** - Missing dependencies
- **Port binding failed** - Check PORT environment variable
- **Database connection failed** - Verify DATABASE_URL

---

## Testing Checklist

After deployment, test these features:

- [ ] Sign up with new user
- [ ] Sign in with existing user
- [ ] Create a new room
- [ ] Fetch rooms list
- [ ] Join a room
- [ ] Draw on canvas
- [ ] Real-time collaboration

---

## URLs Reference

| Service | URL |
|---------|-----|
| **Backend (HTTP)** | https://draw-project-7.onrender.com |
| **Frontend (Vercel)** | https://draw-project-docs-63gsa0mio-anurag07-07s-projects.vercel.app |
| **Frontend (Production)** | https://draw-project-docs.vercel.app *(if configured)* |

---

## Quick Commands

```bash
# Check git status
git status

# View recent commits
git log --oneline -5

# Test backend health
curl https://draw-project-7.onrender.com/api/v1/token

# View Render logs (if render CLI installed)
render logs -s draw-project-7 --tail
```

---

## Next Steps After Fix

Once CORS is working:

1. ✅ Test all API endpoints
2. Test WebSocket connection
3. Verify database operations
4. Test real-time drawing
5. Set up production domain (optional)
6. Configure SSL certificates (if needed)
7. Set up monitoring/alerts

---

## Need Help?

If issues persist:
1. Check browser console for exact error messages
2. Check Render logs for backend errors
3. Verify environment variables on both Vercel and Render
4. Test with curl to isolate frontend vs backend issues
