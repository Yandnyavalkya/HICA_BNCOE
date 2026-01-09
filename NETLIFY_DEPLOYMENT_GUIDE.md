# Netlify Deployment Guide - Frontend Only

This guide will walk you through deploying the HICA frontend to Netlify.

## 🎯 Key Feature: Works Without Backend!

**Your frontend is designed to work independently!** When deployed to Netlify:
- ✅ All pages work perfectly without a backend
- ✅ Uses fallback data automatically when backend is unavailable
- ✅ Same experience as running locally without backend
- ✅ You can add a backend later without changing anything

This means you can deploy immediately and add your backend connection later!

## Prerequisites

- A GitHub account
- Your HICA project pushed to a GitHub repository
- A Netlify account (free tier is sufficient)
- **No backend required!** The frontend works independently with fallback data

---

## Step 1: Prepare Your Repository

### 1.1 Ensure Your Code is Pushed to GitHub

1. Open your terminal in the project root directory
2. Check if you have a Git repository:
   ```bash
   git status
   ```
3. If not initialized, initialize Git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
4. Create a repository on GitHub (if you haven't already)
5. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Create a Netlify Account

1. Go to [https://www.netlify.com](https://www.netlify.com)
2. Click **"Sign up"** in the top right
3. Choose **"Sign up with GitHub"** (recommended for easier integration)
4. Authorize Netlify to access your GitHub account

---

## Step 3: Deploy from GitHub

### 3.1 Add New Site

1. Once logged into Netlify, click **"Add new site"** → **"Import an existing project"**
2. Select **"Deploy with GitHub"**
3. Authorize Netlify to access your GitHub repositories (if prompted)
4. Search for and select your HICA repository

### 3.2 Configure Build Settings

Netlify should auto-detect Vite, but verify these settings:

- **Base directory:** Leave empty (or `frontend` if your repo root contains both frontend and backend)
- **Build command:** `cd frontend && npm install && npm run build`
- **Publish directory:** `frontend/dist`

**Note:** If your repository only contains the frontend folder, use:
- **Base directory:** `frontend`
- **Build command:** `npm install && npm run build`
- **Publish directory:** `dist`

### 3.3 Set Environment Variables (Optional)

**Important:** The frontend is designed to work **without a backend**! It uses fallback data automatically when the backend is unavailable.

**Option 1: Deploy without backend (Recommended for initial deployment)**
- **Don't add any environment variables**
- The site will automatically use fallback data
- All pages will work exactly as they do locally without the backend

**Option 2: Connect to your backend (If you have one deployed)**
1. Click **"Show advanced"** to expand environment variables
2. Click **"New variable"** and add:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://your-backend-url.com` (your actual backend URL)
3. The site will try to fetch data from your backend, and fall back to static data if the backend is unavailable

3. Click **"Deploy site"**

---

## Step 4: Wait for Deployment

1. Netlify will start building your site
2. You'll see build logs in real-time
3. The build typically takes 2-5 minutes
4. Once complete, you'll see **"Site is live"** with a URL like `https://random-name-123.netlify.app`

---

## Step 5: Configure Custom Domain (Optional)

### 5.1 Add Custom Domain

1. Go to **Site settings** → **Domain management**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `hica-bncoe.com`)
4. Follow Netlify's DNS configuration instructions

### 5.2 Configure DNS

- **For root domain:** Add an A record pointing to Netlify's IP
- **For subdomain:** Add a CNAME record pointing to your Netlify site URL

---

## Step 6: Configure Redirects (Important for React Router)

Since you're using React Router, you need to handle client-side routing.

### 6.1 Create `netlify.toml` File

Create a file named `netlify.toml` in your **frontend** directory:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 6.2 Alternative: Create `_redirects` File

If you prefer, create a file named `_redirects` in your `frontend/public` directory:

```
/*    /index.html   200
```

**Note:** If you don't have a `public` directory, create it first.

### 6.3 Commit and Push

```bash
git add frontend/netlify.toml
# OR
git add frontend/public/_redirects
git commit -m "Add Netlify redirects for React Router"
git push
```

Netlify will automatically redeploy with the new configuration.

---

## Step 7: Update Environment Variables After Backend Deployment (Optional)

**Note:** Your site works perfectly without a backend using fallback data. You only need this step if you want to connect to a live backend.

If you deploy your backend later and want to connect it:

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Click **"Add variable"**:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://your-backend-url.com` (your actual backend URL)
4. Click **"Save"**
5. Go to **Deploys** tab → Click **"Trigger deploy"** → **"Clear cache and deploy site"**

**How it works:**
- The frontend will try to fetch data from your backend
- If the backend is available, it uses live data
- If the backend is unavailable, it automatically falls back to static data
- This ensures your site always works, even if the backend is down

---

## Step 8: Verify Deployment

1. Visit your Netlify site URL
2. Test all pages:
   - Home page
   - Events page
   - Gallery page
   - Team page
   - About page
3. Test navigation (all routes should work)
4. Check browser console for any errors

---

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Ensure all dependencies are in `package.json`
- Check that `node_modules` is in `.gitignore`
- Verify build command is correct

**Error: "TypeScript errors"**
- Fix TypeScript errors locally first
- Run `npm run build` locally to test

**Error: "Tailwind CSS not working"**
- Ensure `tailwind.config.js` and `postcss.config.js` exist
- Check that `@tailwind` directives are in `index.css`

### Site Shows 404 on Routes

- Ensure `netlify.toml` or `_redirects` file is configured
- Check that the file is in the correct location
- Redeploy after adding redirects

### API Calls Failing

**This is normal and expected!** The frontend is designed to work without a backend:
- If you haven't set `VITE_API_BASE_URL`, the site uses fallback data automatically
- If your backend is down, the site automatically uses fallback data
- All pages will work perfectly with fallback data

**If you want to connect to a backend:**
- Verify `VITE_API_BASE_URL` environment variable is set correctly
- Check browser console for CORS errors
- Ensure backend allows requests from your Netlify domain (add Netlify URL to CORS whitelist)

### Images Not Loading

- Verify Cloudinary URLs are correct
- Check that image URLs are absolute (start with `https://`)
- Ensure images are publicly accessible

---

## Continuous Deployment

Netlify automatically deploys when you push to your main branch:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```
3. Netlify will automatically detect the push and start a new deployment
4. You'll receive an email when deployment completes

---

## Netlify Features You Can Use

### Preview Deployments
- Every pull request gets a preview URL
- Test changes before merging to main

### Branch Deploys
- Deploy specific branches for testing
- Configure in **Site settings** → **Build & deploy** → **Branch deploys**

### Form Handling
- Netlify can handle form submissions
- Useful if you want to add contact forms

### Analytics
- Enable Netlify Analytics (paid feature)
- Track site visitors and performance

---

## Quick Reference

**Build Settings:**
- Base directory: `frontend` (if repo contains both frontend/backend)
- Build command: `npm install && npm run build`
- Publish directory: `dist`

**Environment Variables:**
- `VITE_API_BASE_URL`: Your backend API URL

**Required Files:**
- `frontend/netlify.toml` or `frontend/public/_redirects` (for React Router)

**Site URL Format:**
- `https://your-site-name.netlify.app`
- Or your custom domain

---

## Next Steps

1. ✅ Deploy frontend to Netlify
2. 🔄 Deploy backend to Render/Vercel (if needed)
3. 🔗 Update `VITE_API_BASE_URL` in Netlify with backend URL
4. 🎨 Test all features on production
5. 📝 Share your site URL!

---

## Support

If you encounter issues:
- Check Netlify build logs for detailed error messages
- Review [Netlify Documentation](https://docs.netlify.com/)
- Check [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#netlify)

---

**Congratulations!** Your HICA frontend is now live on Netlify! 🚀
