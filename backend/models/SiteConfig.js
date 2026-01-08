import mongoose from 'mongoose';

const siteConfigSchema = new mongoose.Schema({
  site_title: {
    type: String,
    default: 'HICA',
  },
  hero_title: {
    type: String,
    default: 'Welcome to HICA',
  },
  hero_subtitle: {
    type: String,
    default: 'Empowering innovation and collaboration.',
  },
  about_text: {
    type: String,
    default: 'About HICA...',
  },
  contact_email: {
    type: String,
    default: 'info@example.com',
  },
  recruitment_title: {
    type: String,
    default: null,
  },
  recruitment_subtitle: {
    type: String,
    default: null,
  },
  recruitment_form_url: {
    type: String,
    default: null,
  },
  recruitment_deadline: {
    type: String,
    default: null,
  },
  recruitment_message: {
    type: String,
    default: null,
  },
  show_recruitment: {
    type: Boolean,
    default: false,
  },
  team_intro_video_url: {
    type: String,
    default: null,
  },
  social_links: {
    type: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
      github: String,
      youtube: String,
    },
    default: {},
  },
}, {
  collection: 'site_config',
});

export default mongoose.model('SiteConfig', siteConfigSchema);
