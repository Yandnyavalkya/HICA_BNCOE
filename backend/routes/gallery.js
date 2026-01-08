import express from 'express';
import multer from 'multer';
import GalleryImage from '../models/GalleryImage.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadImage, initCloudinary } from '../utils/cloudinary.js';
import { config } from '../config.js';

const router = express.Router();

// Initialize multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Get all gallery images
router.get('/', async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ created_at: -1 });
    res.json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Create gallery image (admin only)
router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { title, description, category, event_category, image_url } = req.body;

    let finalImageUrl;

    if (req.file) {
      // Upload file to Cloudinary
      try {
        initCloudinary();
        const fileBuffer = req.file.buffer;
        finalImageUrl = await uploadImage(fileBuffer, 'hica/gallery');
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ 
          detail: `Failed to upload image to Cloudinary: ${error.message}` 
        });
      }
    } else if (image_url) {
      // Use provided URL directly
      finalImageUrl = image_url;
    } else {
      return res.status(400).json({ 
        detail: 'Either a file upload or image_url must be provided' 
      });
    }

    const image = new GalleryImage({
      title: title || null,
      description: description || null,
      category: category || null,
      event_category: event_category || null,
      image_url: finalImageUrl,
    });

    await image.save();
    res.json(image);
  } catch (error) {
    console.error('Error creating gallery image:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Update gallery image (admin only)
router.put('/:image_id', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.image_id);
    if (!image) {
      return res.status(404).json({ detail: 'Image not found' });
    }

    const { title, description, category, event_category, image_url } = req.body;

    // Update image_url if file is uploaded or new URL is provided
    if (req.file) {
      try {
        initCloudinary();
        const fileBuffer = req.file.buffer;
        image.image_url = await uploadImage(fileBuffer, 'hica/gallery');
      } catch (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ 
          detail: `Failed to upload image to Cloudinary: ${error.message}` 
        });
      }
    } else if (image_url) {
      image.image_url = image_url;
    }

    // Update other fields
    if (title !== undefined) image.title = title || null;
    if (description !== undefined) image.description = description || null;
    if (category !== undefined) image.category = category || null;
    if (event_category !== undefined) image.event_category = event_category || null;

    await image.save();
    res.json(image);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Delete gallery image (admin only)
router.delete('/:image_id', authenticateToken, async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.image_id);
    if (!image) {
      return res.status(404).json({ detail: 'Image not found' });
    }

    await image.deleteOne();
    res.json({ detail: 'Deleted' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

export default router;
