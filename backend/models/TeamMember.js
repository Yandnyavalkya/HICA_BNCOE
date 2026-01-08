import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: null,
  },
  image_url: {
    type: String,
    default: null,
  },
  social_links: {
    type: {
      linkedin: String,
      github: String,
      twitter: String,
      instagram: String,
    },
    default: {},
  },
  order: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: 'team_members',
});

export default mongoose.model('TeamMember', teamMemberSchema);
