# HICA Backend (Node.js)

Backend API for HICA website built with Node.js, Express, and MongoDB.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables:**
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secret key for JWT tokens
   - `CLOUDINARY_*`: Cloudinary credentials for image uploads
   - `PORT`: Server port (default: 8000)

4. **Seed admin user:**
   ```bash
   node seed_admin.js
   ```

5. **Start the server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

## API Endpoints

- `POST /auth/login` - Admin login
- `GET /team` - Get all team members
- `POST /team` - Create team member (admin)
- `PUT /team/:id` - Update team member (admin)
- `DELETE /team/:id` - Delete team member (admin)
- `GET /events` - Get all events
- `POST /events` - Create event (admin)
- `PUT /events/:id` - Update event (admin)
- `DELETE /events/:id` - Delete event (admin)
- `GET /gallery` - Get all gallery images
- `POST /gallery` - Upload gallery image (admin)
- `PUT /gallery/:id` - Update gallery image (admin)
- `DELETE /gallery/:id` - Delete gallery image (admin)
- `GET /config` - Get site configuration
- `PUT /config/:id` - Update site configuration (admin)

## Authentication

All admin endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Notes

- The backend uses the same MongoDB database as the Python backend
- All data models are compatible with the existing frontend
- The API structure matches the Python FastAPI backend for seamless migration
