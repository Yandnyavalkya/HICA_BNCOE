# HICA Project - Vercel Deployment Guide

This guide will walk you through deploying the HICA project to Vercel.

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier available)
3. **MongoDB Atlas Account** - For database (already set up)
4. **Cloudinary Account** - For image storage (already set up)

---

## Deployment Strategy

You have two options:

### Option 1: Frontend on Vercel + Backend on Render (Recommended)
- **Frontend**: Deploy to Vercel (perfect for React/Vite)
- **Backend**: Keep on Render (better for Express/MongoDB long-running connections)

### Option 2: Both Frontend and Backend on Vercel
- **Frontend**: Deploy to Vercel
- **Backend**: Convert to Vercel serverless functions (requires code changes)

**We'll cover Option 1 first (recommended), then Option 2.**

---

## Option 1: Frontend on Vercel + Backend on Render

### Step 1: Deploy Backend to Render (If Not Already Done)

Follow the `DEPLOYMENT_GUIDE.md` to deploy your backend to Render first. You'll need:
- Backend URL (e.g., `https://hica-backend.onrender.com`)

### Step 2: Prepare Frontend for Vercel

#### 2.1 Create Vercel Configuration

Create `vercel.json` in the **root** of your project:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "devCommand": "cd frontend && npm run dev",
  "installCommand": "cd frontend && npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### 2.2 Update Frontend Build Configuration

Ensure your `frontend/vite.config.ts` is configured correctly:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
```

### Step 3: Deploy Frontend to Vercel

#### 3.1 Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the repository containing your HICA project

#### 3.2 Configure Project Settings

1. **Framework Preset**: Select **"Vite"** (or "Other")
2. **Root Directory**: Click **"Edit"** and set to `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

#### 3.3 Set Environment Variables

Click **"Environment Variables"** and add:

```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

**Important**: Replace `your-backend-url.onrender.com` with your actual Render backend URL.

#### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Your frontend will be live at `https://your-project.vercel.app`

### Step 4: Update CORS on Backend

Make sure your Render backend allows requests from your Vercel domain:

1. Go to Render backend dashboard
2. Update environment variable `FRONTEND_ORIGINS`:
   ```
   https://your-project.vercel.app,https://your-project-git-main-yourusername.vercel.app
   ```
3. Redeploy backend

---

## Option 2: Both Frontend and Backend on Vercel

### Step 1: Convert Backend to Vercel Serverless Functions

#### 1.1 Create API Directory Structure

Create `api/` directory in the **root** of your project:

```
HICA/
├── api/
│   ├── index.js          (Main serverless function)
│   ├── auth/
│   ├── team/
│   ├── events/
│   ├── gallery/
│   └── config/
├── backend/              (Keep for reference)
├── frontend/
└── vercel.json
```

#### 1.2 Create Main API Handler

Create `api/index.js`:

```javascript
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGINS?.split(',') || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
import authRoutes from '../backend/routes/auth.js';
import teamRoutes from '../backend/routes/team.js';
import eventRoutes from '../backend/routes/events.js';
import galleryRoutes from '../backend/routes/gallery.js';
import configRoutes from '../backend/routes/config.js';

// Routes
app.use('/auth', authRoutes);
app.use('/team', teamRoutes);
app.use('/events', eventRoutes);
app.use('/gallery', galleryRoutes);
app.use('/config', configRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'HICA Backend API', status: 'running' });
});

// Connect to MongoDB (cached connection)
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 20000,
    });
    cachedDb = db;
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Vercel serverless function handler
export default async function handler(req, res) {
  // Connect to database
  await connectToDatabase();
  
  // Handle request with Express app
  return app(req, res);
}
```

#### 1.3 Update vercel.json

Update root `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### 1.4 Set Environment Variables in Vercel

Go to Vercel project settings → Environment Variables and add:

```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-admin-password
FRONTEND_ORIGINS=https://your-project.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
VITE_API_BASE_URL=https://your-project.vercel.app/api
```

#### 1.5 Update Frontend API Base URL

Update `frontend/src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
```

### Step 2: Deploy to Vercel

1. Push all changes to GitHub
2. Go to Vercel dashboard
3. Import your repository (if not already imported)
4. Configure:
   - **Root Directory**: Leave as root (`.`)
   - **Framework Preset**: Other
5. Add all environment variables
6. Click **"Deploy"**

---

## Post-Deployment Steps

### 1. Seed Database

If using Option 1 (Backend on Render):
- Use Render shell to run seed scripts (as in Render guide)

If using Option 2 (Backend on Vercel):
- You'll need to create a separate script or use Vercel CLI:
  ```bash
  vercel env pull .env.local
  node backend/seed_admin.js
  node backend/seed_events.js
  node backend/seed_team.js
  ```

### 2. Test Your Deployment

1. Visit your Vercel frontend URL
2. Test navigation and pages
3. Test admin login
4. Test image uploads
5. Check browser console for errors

### 3. Set Up Custom Domain (Optional)

1. Go to Vercel project settings
2. Click **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

---

## Troubleshooting

### Frontend Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript errors are fixed
- Check `vite.config.ts` is correct

### API Calls Fail (CORS Errors)

- Verify `FRONTEND_ORIGINS` includes your Vercel domain
- Check backend CORS configuration
- Ensure `VITE_API_BASE_URL` is set correctly

### MongoDB Connection Issues

- Verify `MONGODB_URI` is correct in environment variables
- Check MongoDB Atlas IP whitelist includes Vercel IPs (or use `0.0.0.0/0`)
- Ensure MongoDB cluster is running

### Images Not Uploading

- Verify Cloudinary credentials in environment variables
- Check Cloudinary dashboard for upload logs
- Ensure `CLOUDINARY_*` variables are set correctly

---

## Recommended Approach

**We recommend Option 1** (Frontend on Vercel + Backend on Render) because:

1. ✅ Vercel excels at frontend hosting (fast CDN, automatic deployments)
2. ✅ Render is better for Express backends with MongoDB (persistent connections)
3. ✅ Easier to maintain (no code conversion needed)
4. ✅ Better performance for database connections
5. ✅ Simpler debugging and logging

---

## Quick Reference

### Vercel CLI (Optional)

Install Vercel CLI for local testing:

```bash
npm i -g vercel
vercel login
vercel dev
```

### Environment Variables Checklist

**Frontend (Vercel):**
- `VITE_API_BASE_URL`

**Backend (Render or Vercel):**
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `FRONTEND_ORIGINS`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

---

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Discord](https://vercel.com/discord)
- [Render Documentation](https://render.com/docs)
