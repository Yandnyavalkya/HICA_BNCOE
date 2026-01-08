import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config.js';
import { initCloudinary } from './utils/cloudinary.js';

// Import routes
import authRoutes from './routes/auth.js';
import teamRoutes from './routes/team.js';
import eventRoutes from './routes/events.js';
import galleryRoutes from './routes/gallery.js';
import configRoutes from './routes/config.js';

const app = express();

// Middleware
app.use(cors({
  origin: config.server.frontendOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Start server first (even if MongoDB fails, server will run)
const PORT = config.server.port;
const server = app.listen(PORT, () => {
  console.log(`[SUCCESS] Server running on http://localhost:${PORT}`);
  console.log('[INFO] Attempting to connect to MongoDB...');
});

// Connect to MongoDB
mongoose.connect(config.mongodb.uri, {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 20000,
})
  .then(() => {
    console.log('[SUCCESS] Connected to MongoDB!');
    
    // Initialize Cloudinary if credentials are provided
    if (config.cloudinary.cloudName && 
        config.cloudinary.apiKey && 
        config.cloudinary.apiSecret) {
      try {
        initCloudinary();
        console.log('[SUCCESS] Cloudinary initialized!');
      } catch (error) {
        console.log('[WARNING] Cloudinary initialization failed:', error.message);
      }
    } else {
      console.log('[WARNING] Cloudinary not configured. Image uploads will not work.');
    }
  })
  .catch((error) => {
    console.error('[ERROR] MongoDB connection failed:', error.message);
    console.error('\n[INFO] Make sure:');
    console.error('1. MongoDB URI is correct in .env file');
    console.error('2. Your IP is whitelisted in MongoDB Atlas (Network Access)');
    console.error('3. MongoDB cluster is running');
    console.error('\n[INFO] Server is running but database operations will fail.');
    console.error('[INFO] You can still test API endpoints, but they will return errors.');
  });

export default app;
