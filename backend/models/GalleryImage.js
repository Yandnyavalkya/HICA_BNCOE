import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema({
  title: {
    type: String,
    default: null,
  },
  description: {
    type: String,
    default: null,
  },
  image_url: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: null,
  },
  event_category: {
    type: String,
    default: null,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'gallery_images',
});

export default mongoose.model('GalleryImage', galleryImageSchema);
