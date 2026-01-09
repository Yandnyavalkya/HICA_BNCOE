# Netlify Deployment - Quick Start

## 🚀 Fast Track (5 Minutes)

### 1. Push to GitHub
```bash
git add .
git commit -m "Prepare for Netlify deployment"
git push
```

### 2. Deploy on Netlify
1. Go to [netlify.com](https://www.netlify.com) → Sign up with GitHub
2. Click **"Add new site"** → **"Import an existing project"**
3. Select your GitHub repository
4. Configure build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm install && npm run build`
   - **Publish directory:** `dist`
5. **Skip environment variables** (the site works without a backend!)
   - The frontend automatically uses fallback data
   - You can add `VITE_API_BASE_URL` later if you deploy a backend
6. Click **"Deploy site"**

### 3. Done! 🎉
Your site will be live at `https://your-site-name.netlify.app`

---

## ⚙️ Build Settings Summary

| Setting | Value |
|---------|-------|
| Base directory | `frontend` |
| Build command | `npm install && npm run build` |
| Publish directory | `dist` |
| Environment variable | `VITE_API_BASE_URL` (optional) |

---

## 📝 Important Notes

- ✅ `netlify.toml` is already created in the frontend folder
- ✅ React Router redirects are configured automatically
- ✅ The site will auto-deploy on every push to main branch
- ✅ **Works without backend** - Uses fallback data automatically
- ✅ All pages work exactly as they do locally without backend

---

## 🔗 Full Guide

See `NETLIFY_DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.
