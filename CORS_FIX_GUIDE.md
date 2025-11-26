# CORS Error Fix Guide

## Problem
Your frontend (deployed on Vercel) was unable to make API requests to your backend (deployed on Render) due to CORS policy blocking.

**Error Message:**
```
Access to XMLHttpRequest at 'https://draw-project-7.onrender.com/api/v1/signin' from origin 'https://draw-project-docs-cccaqi22c-anurag07-07s-projects.vercel.app' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## What is CORS?
CORS (Cross-Origin Resource Sharing) is a security feature that prevents websites from making requests to a different domain than the one that served the webpage. Your backend must explicitly allow requests from your frontend domain.

## Solution

### Changes Made

1. **Updated `apps/http-backend/src/index.ts`**
   - Modified CORS configuration to accept your Vercel frontend URL
   - Added dynamic origin validation
   - Made it flexible to accept all `.vercel.app` domains (useful for preview deployments)
   - Added environment variable support for production

2. **Created `.env.example`**
   - Documentation for required environment variables

### How to Deploy the Fix

#### Step 1: Redeploy Your Backend

Since your backend is deployed on Render at `https://draw-project-7.onrender.com`, you need to:

1. **Push the changes to your Git repository:**
   ```bash
   git add .
   git commit -m "fix: Update CORS configuration for Vercel frontend"
   git push
   ```

2. **Render will automatically redeploy** (if you have auto-deploy enabled)
   - Or manually trigger a deploy from the Render dashboard

#### Step 2: (Optional) Set Environment Variables on Render

For better control, you can set the `ALLOWED_ORIGINS` environment variable in your Render dashboard:

1. Go to your Render service dashboard
2. Navigate to "Environment" tab
3. Add a new environment variable:
   - **Key:** `ALLOWED_ORIGINS`
   - **Value:** `http://localhost:3001,https://draw-project-docs-cccaqi22c-anurag07-07s-projects.vercel.app,https://draw-project-docs.vercel.app`

4. Save and redeploy

#### Step 3: Wait for Deployment

- Wait for Render to finish deploying your updated backend
- This usually takes 2-5 minutes

#### Step 4: Test Your Frontend

Once deployed, try accessing your Vercel frontend again and the CORS error should be resolved!

## Important Notes

### For Vercel Preview Deployments
The updated code now accepts ANY origin that includes `vercel.app`, which means:
- ✅ `https://draw-project-docs-cccaqi22c-anurag07-07s-projects.vercel.app` (preview)
- ✅ `https://draw-project-docs.vercel.app` (production)
- ✅ Any other Vercel preview deployment URLs

### For Production
When you're ready for production:
1. Set up a custom domain for your Vercel app (e.g., `https://myapp.com`)
2. Update the `ALLOWED_ORIGINS` environment variable on Render to include your production domain

## Troubleshooting

### If the error persists after deployment:

1. **Clear your browser cache** or try in an incognito window
2. **Check Render logs** to ensure the new code is deployed
3. **Verify the backend URL** in your frontend's environment variables
4. **Check browser console** for the exact error message

### Common Issues:

- **Old code still running:** Make sure Render has finished deploying
- **Environment variables not set:** The code will use default values, but setting them explicitly is better
- **Browser cache:** Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## What Changed in the Code

### Before:
```typescript
app.use(cors({
  origin: ["http://localhost:3001"],
  credentials: true
}))
```

This only allowed requests from `http://localhost:3001`.

### After:
```typescript
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : [
      "http://localhost:3001",
      "https://draw-project-docs-cccaqi22c-anurag07-07s-projects.vercel.app",
      "https://draw-project-docs.vercel.app",
    ];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}))
```

This allows:
- Requests from localhost (development)
- Requests from your specific Vercel URLs
- Requests from any Vercel deployment (*.vercel.app)
- Environment variable configuration for flexibility
