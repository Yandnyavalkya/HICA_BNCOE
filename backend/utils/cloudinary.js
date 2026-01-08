import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config.js';

export const initCloudinary = () => {
  if (!config.cloudinary.cloudName || 
      !config.cloudinary.apiKey || 
      !config.cloudinary.apiSecret) {
    throw new Error('Cloudinary credentials are not fully configured in .env');
  }

  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true,
  });
};

export const uploadImage = async (fileBuffer, folder = 'hica') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};
