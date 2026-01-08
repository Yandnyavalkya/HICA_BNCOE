# Quick Setup Guide

## Issues Fixed

### 1. Running Uvicorn
Since `uvicorn` is not in your PATH, use:
```powershell
python -m uvicorn app.main:app --reload
```

### 2. MongoDB Connection

You have two options:

#### Option A: Use MongoDB Atlas (Cloud - Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/hica`)
4. Update your `.env` file:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hica
   ```

#### Option B: Install MongoDB Locally
1. Download MongoDB Community Server: https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Default connection: `mongodb://localhost:27017/hica`

## Step-by-Step Setup

### 1. Create `.env` file in project root:
```env
MONGODB_URI=mongodb://localhost:27017/hica
MONGODB_DB_NAME=hica

JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

ADMIN_EMAIL=admin@hica.com
ADMIN_PASSWORD=admin123

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

FRONTEND_ORIGINS=http://localhost:5173
```

### 2. Make sure MongoDB is running (or use Atlas)

### 3. Seed admin user:
```powershell
python -m app.seed_admin
```

### 4. Start backend:
```powershell
python -m uvicorn app.main:app --reload
```

### 5. In another terminal, start frontend:
```powershell
cd frontend
npm install
npm run dev
```

## Troubleshooting

- **MongoDB connection error**: Make sure MongoDB is running or use MongoDB Atlas
- **uvicorn not found**: Always use `python -m uvicorn` instead of just `uvicorn`
- **Module not found**: Run `pip install -r requirements.txt` again

