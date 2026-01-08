import dotenv from 'dotenv';

dotenv.config();

export const config = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hica',
    dbName: process.env.MONGODB_DB_NAME || 'hica',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'CHANGE_ME_SUPER_SECRET',
    expiresIn: process.env.JWT_EXPIRE_MINUTES 
      ? `${process.env.JWT_EXPIRE_MINUTES}m` 
      : '1440m',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  server: {
    port: process.env.PORT || 8000,
    frontendOrigins: process.env.FRONTEND_ORIGINS 
      ? process.env.FRONTEND_ORIGINS.split(',')
      : ['http://localhost:5173'],
  },
};
