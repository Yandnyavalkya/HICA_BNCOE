import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
  date: {
    type: Date,
    default: null,
  },
  location: {
    type: String,
    default: null,
  },
  image_url: {
    type: String,
    default: null,
  },
  registration_link: {
    type: String,
    default: null,
  },
  event_category: {
    type: String,
    default: null,
  },
  is_published: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'events',
});

export default mongoose.model('Event', eventSchema);
