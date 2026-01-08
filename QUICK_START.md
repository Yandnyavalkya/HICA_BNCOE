# Quick Start Guide

## Local Development

### 1. Backend Setup
```bash
cd backend
npm install
# Create .env file with your credentials
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
# Create .env file with VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

## Deployment to Render

### Quick Steps:
1. Push code to GitHub
2. Create backend service on Render
3. Create frontend service on Render
4. Set environment variables
5. Deploy!

**For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)**

## Environment Variables

### Backend (.env)
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_ORIGINS=http://localhost:5173
ADMIN_EMAIL=your_email
ADMIN_PASSWORD=your_password
PORT=8000
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:8000
```
