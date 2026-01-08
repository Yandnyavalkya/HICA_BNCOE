# HICA Project - Render Deployment Guide

This guide will walk you through deploying the HICA project (Node.js backend + React frontend) to Render.

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Render Account** - Sign up at [render.com](https://render.com)
3. **MongoDB Atlas Account** - For database (already set up)
4. **Cloudinary Account** - For image storage (already set up)

---

## Step 1: Prepare Your Code

### 1.1 Ensure All Files Are Committed

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 1.2 Verify Project Structure

Your project should have:
```
HICA/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── config.js
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
└── README.md
```

---

## Step 2: Deploy Backend to Render

### 2.1 Create Backend Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository

### 2.2 Configure Backend Service

**Basic Settings:**
- **Name**: `hica-backend` (or any name you prefer)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)

**Build & Deploy:**
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Environment Variables:**
Add the following environment variables (click "Add Environment Variable" for each):

```
NODE_ENV = production
PORT = 10000
MONGODB_URI = your_mongodb_atlas_connection_string
JWT_SECRET = your_secure_random_string_here
JWT_EXPIRE_MINUTES = 1440
CLOUDINARY_CLOUD_NAME = dty4b2yj1
CLOUDINARY_API_KEY = 972613838258434
CLOUDINARY_API_SECRET = uBwE1OKV3hT1q6_sLAWXr2Hyr7c
FRONTEND_ORIGINS = https://your-frontend-url.onrender.com
ADMIN_EMAIL = yadnyavalkyakd.a04@gmail.com
ADMIN_PASSWORD = adminYKD@123
```

**Important Notes:**
- Replace `your_mongodb_atlas_connection_string` with your actual MongoDB Atlas URI
- Replace `your_secure_random_string_here` with a long random string (you can generate one at https://randomkeygen.com/)
- Replace `https://your-frontend-url.onrender.com` with your actual frontend URL (you'll update this after deploying frontend)

### 2.3 Deploy Backend

1. Click **"Create Web Service"**
2. Wait for the build to complete (usually 2-5 minutes)
3. Once deployed, copy your backend URL (e.g., `https://hica-backend.onrender.com`)

---

## Step 3: Deploy Frontend to Render

### 3.1 Create Frontend Service

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Select the same GitHub repository

### 3.2 Configure Frontend Service

**Basic Settings:**
- **Name**: `hica-frontend` (or any name you prefer)
- **Environment**: `Node`
- **Region**: Same as backend
- **Branch**: `main`

**Build & Deploy:**
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npx serve -s dist -l 10000`

**Environment Variables:**
Add this environment variable:

```
VITE_API_BASE_URL = https://your-backend-url.onrender.com
```

Replace `https://your-backend-url.onrender.com` with your actual backend URL from Step 2.3.

### 3.3 Deploy Frontend

1. Click **"Create Web Service"**
2. Wait for the build to complete
3. Once deployed, copy your frontend URL (e.g., `https://hica-frontend.onrender.com`)

---

## Step 4: Update Environment Variables

### 4.1 Update Backend FRONTEND_ORIGINS

1. Go back to your backend service in Render
2. Navigate to **"Environment"** tab
3. Update `FRONTEND_ORIGINS` to your actual frontend URL:
   ```
   FRONTEND_ORIGINS = https://hica-frontend.onrender.com
   ```
4. Click **"Save Changes"** - This will trigger a redeploy

### 4.2 Verify Frontend API URL

1. Go to your frontend service in Render
2. Navigate to **"Environment"** tab
3. Verify `VITE_API_BASE_URL` is set to your backend URL
4. If you need to change it, update and save (this will trigger a rebuild)

---

## Step 5: Configure MongoDB Atlas

### 5.1 Whitelist Render IPs

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to **Network Access**
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (or add Render's IP ranges)
5. Click **"Confirm"**

**Note:** For production, it's better to whitelist specific IPs, but for development/testing, allowing all IPs is acceptable.

---

## Step 6: Seed Initial Data (Optional)

After deployment, you may want to seed your database with initial data:

1. Go to your backend service in Render
2. Navigate to **"Shell"** tab
3. Run the seed commands:
   ```bash
   npm run seed:admin
   npm run seed:events
   npm run seed:team
   ```

---

## Step 7: Test Your Deployment

### 7.1 Test Backend

Visit your backend URL:
```
https://your-backend-url.onrender.com/
```

You should see:
```json
{
  "message": "HICA Backend API",
  "status": "running"
}
```

### 7.2 Test Frontend

Visit your frontend URL and verify:
- ✅ Homepage loads
- ✅ Navigation works
- ✅ API calls to backend work
- ✅ Admin login works
- ✅ Images load from Cloudinary

---

## Step 8: Custom Domain (Optional)

### 8.1 Add Custom Domain to Frontend

1. Go to your frontend service in Render
2. Navigate to **"Settings"** → **"Custom Domains"**
3. Add your domain
4. Follow DNS configuration instructions

### 8.2 Update Environment Variables

After adding custom domain, update:
- Backend: `FRONTEND_ORIGINS` to include your custom domain
- Frontend: `VITE_API_BASE_URL` (if needed)

---

## Troubleshooting

### Backend Not Starting

1. Check **"Logs"** tab in Render dashboard
2. Verify all environment variables are set correctly
3. Check MongoDB connection string
4. Verify JWT_SECRET is set

### Frontend Build Failing

1. Check **"Logs"** tab
2. Verify `VITE_API_BASE_URL` is set
3. Check for TypeScript errors
4. Ensure all dependencies are in `package.json`

### CORS Errors

1. Verify `FRONTEND_ORIGINS` in backend includes your frontend URL
2. Check that URLs match exactly (including `https://`)

### Images Not Loading

1. Verify Cloudinary credentials are correct
2. Check Cloudinary dashboard for uploaded images
3. Verify image URLs in database

### Database Connection Issues

1. Check MongoDB Atlas Network Access (IP whitelist)
2. Verify MongoDB URI is correct
3. Check MongoDB Atlas cluster is running (not paused)

---

## Important Notes

1. **Free Tier Limitations:**
   - Services spin down after 15 minutes of inactivity
   - First request after spin-down may take 30-60 seconds
   - Consider upgrading for production use

2. **Environment Variables:**
   - Never commit `.env` files to Git
   - Always set sensitive data in Render dashboard

3. **Auto-Deploy:**
   - Render automatically deploys on every push to your main branch
   - You can disable this in service settings

4. **Monitoring:**
   - Check Render dashboard regularly for errors
   - Set up email notifications for deployment failures

---

## Quick Reference

### Backend Service
- **URL**: `https://your-backend.onrender.com`
- **Health Check**: `https://your-backend.onrender.com/`
- **Admin Login**: `https://your-frontend.onrender.com/admin/login`

### Frontend Service
- **URL**: `https://your-frontend.onrender.com`
- **API Endpoint**: Set via `VITE_API_BASE_URL`

### MongoDB Atlas
- **Dashboard**: https://cloud.mongodb.com/
- **Network Access**: Security → Network Access

### Cloudinary
- **Dashboard**: https://cloudinary.com/console
- **Credentials**: Already configured in backend

---

## Support

If you encounter issues:
1. Check Render logs
2. Verify all environment variables
3. Test endpoints using Postman or curl
4. Check MongoDB Atlas and Cloudinary dashboards

Good luck with your deployment! 🚀
