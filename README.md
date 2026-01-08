# HICA - Full Stack Application

A full-stack application built with Node.js/Express (backend) and React (frontend) for managing team members, events, gallery, and site configuration.

## Tech Stack

### Backend
- **Node.js** with **Express.js** - Web framework
- **MongoDB** with **Mongoose** - Database and ODM
- **JWT** (jsonwebtoken) - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image upload and storage
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** with **TypeScript** - UI framework
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **TanStack React Query** - Data fetching and caching
- **React Hook Form** - Form management
- **Tailwind CSS** - Styling

## Project Structure

```
HICA/
├── backend/                  # Node.js/Express backend
│   ├── server.js            # Express app entry point
│   ├── config.js            # Configuration settings
│   ├── models/              # MongoDB models (Mongoose)
│   │   ├── User.js
│   │   ├── TeamMember.js
│   │   ├── Event.js
│   │   ├── GalleryImage.js
│   │   └── SiteConfig.js
│   ├── routes/              # API routes
│   │   ├── auth.js
│   │   ├── team.js
│   │   ├── events.js
│   │   ├── gallery.js
│   │   └── config.js
│   ├── middleware/          # Express middleware
│   │   └── auth.js
│   ├── utils/               # Utility functions
│   │   ├── security.js
│   │   └── cloudinary.js
│   ├── seed_admin.js        # Admin user seeding script
│   ├── seed_events.js       # Events seeding script
│   ├── seed_team.js         # Team seeding script
│   └── package.json
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Events.tsx
│   │   │   ├── Gallery.tsx
│   │   │   ├── Team.tsx
│   │   │   ├── About.tsx
│   │   │   ├── AdminLogin.tsx
│   │   │   └── admin/       # Admin pages
│   │   │       ├── AdminDashboard.tsx
│   │   │       ├── TeamManager.tsx
│   │   │       ├── EventManager.tsx
│   │   │       ├── GalleryManager.tsx
│   │   │       └── ConfigManager.tsx
│   │   ├── components/      # Reusable components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── AdminLayout.tsx
│   │   ├── services/        # API client
│   │   │   └── api.ts
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   └── package.json
└── README.md

```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secure_random_string
   JWT_EXPIRE_MINUTES=1440
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FRONTEND_ORIGINS=http://localhost:5173
   ADMIN_EMAIL=your_admin_email
   ADMIN_PASSWORD=your_admin_password
   PORT=8000
   ```

4. **Seed admin user:**
   ```bash
   npm run seed:admin
   ```

5. **Run the backend server:**
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```
   Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## API Endpoints

### Public Endpoints
- `GET /` - Health check
- `GET /team` - Get all team members
- `GET /events` - Get all events
- `GET /gallery` - Get all gallery images
- `GET /config` - Get site configuration

### Authentication
- `POST /auth/login` - Admin login (returns JWT token)

### Admin Endpoints (Require JWT Authentication)
- `POST /team` - Create team member
- `PUT /team/:id` - Update team member
- `DELETE /team/:id` - Delete team member

- `POST /events` - Create event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event

- `POST /gallery` - Create gallery image (with file upload or URL)
- `PUT /gallery/:id` - Update gallery image
- `DELETE /gallery/:id` - Delete gallery image

- `GET /config` - Get site config
- `POST /config` - Create site config
- `PUT /config/:id` - Update site config

## Features

### Public Pages
- **Home** - Landing page with hero section and recruitment notices
- **Events** - Display upcoming and past events with gallery links
- **Gallery** - Image gallery with event filtering
- **Team** - Team member profiles with introduction video
- **About** - About page with contact information

### Admin Panel
- **Dashboard** - Overview with statistics
- **Team Manager** - CRUD operations for team members with social links
- **Event Manager** - CRUD operations for events
- **Gallery Manager** - CRUD operations with Cloudinary image upload
- **Site Config** - Manage site configuration, recruitment notices, and social links

## Authentication

- Admin login uses JWT tokens
- Tokens are stored in `localStorage`
- Protected routes require valid JWT token
- Token expiration: 24 hours (configurable via `JWT_EXPIRE_MINUTES`)

## Image Upload

- Gallery images can be uploaded via Cloudinary
- Supports direct URL input or file upload
- Images are stored in Cloudinary CDN
- Event cover images with 4:5 aspect ratio support

## Development

### Backend
- Auto-reload with `npm run dev` (using `node --watch`)
- Health check endpoint at `GET /`
- MongoDB connection with automatic retry

### Frontend
- Hot Module Replacement (HMR) enabled
- React Query for data fetching and caching
- TypeScript for type safety
- Tailwind CSS for styling

## Production Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed step-by-step instructions on deploying to Render.

### Quick Deployment Checklist:
1. Set up MongoDB Atlas and whitelist IPs
2. Configure Cloudinary credentials
3. Set environment variables in deployment platform
4. Deploy backend service
5. Deploy frontend service
6. Update CORS origins
7. Test all endpoints

## License

MIT
