import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Event from './models/Event.js';
import TeamMember from './models/TeamMember.js';
import GalleryImage from './models/GalleryImage.js';
import SiteConfig from './models/SiteConfig.js';
import { config } from './config.js';

async function exportFallbackData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 20000,
    });
    console.log('[SUCCESS] Connected to MongoDB!');

    // Fetch all data
    const events = await Event.find().sort({ date: 1 });
    const teamMembers = await TeamMember.find().sort({ order: 1 });
    const galleryImages = await GalleryImage.find().sort({ created_at: -1 });
    const siteConfig = await SiteConfig.findOne();

    // Helper function to safely convert date to ISO string
    const toISOString = (value) => {
      if (!value) return null;
      if (value instanceof Date) return value.toISOString();
      if (typeof value === 'string') return value;
      return String(value);
    };

    // Format for fallback data
    const formattedEvents = events.map((event, index) => ({
      _id: `fallback-${index + 1}`,
      title: event.title,
      description: event.description || '',
      date: toISOString(event.date),
      location: event.location || '',
      image_url: event.image_url || '',
      event_category: event.event_category || '',
    }));

    const formattedTeam = teamMembers.map((member, index) => ({
      _id: `fallback-${index + 1}`,
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      image_url: member.image_url || '',
      order: member.order || index,
      social_links: member.social_links || {},
    }));

    const formattedGallery = galleryImages.map((image, index) => ({
      _id: `fallback-${index + 1}`,
      title: image.title || '',
      description: image.description || '',
      image_url: image.image_url || '',
      category: image.category || '',
      event_category: image.event_category || '',
    }));

    const formattedConfig = siteConfig ? {
      hero_title: siteConfig.hero_title || "HICA's First Event",
      hero_subtitle: siteConfig.hero_subtitle || '',
      show_recruitment: siteConfig.show_recruitment || false,
      recruitment_title: siteConfig.recruitment_title || '',
      recruitment_subtitle: siteConfig.recruitment_subtitle || '',
      recruitment_form_url: siteConfig.recruitment_form_url || '',
      recruitment_deadline: toISOString(siteConfig.recruitment_deadline),
      recruitment_message: siteConfig.recruitment_message || '',
      team_intro_video_url: siteConfig.team_intro_video_url || '',
      site_name: siteConfig.site_name || siteConfig.site_title || 'HICA',
      site_description: siteConfig.site_description || siteConfig.about_text || '',
      contact_email: siteConfig.contact_email || 'hicabncoe@gmail.com',
      social_links: siteConfig.social_links || {},
    } : {};

    // Save to file
    const output = `// Fallback data exported from database on ${new Date().toISOString()}
// This file is auto-generated. Run: node backend/export_fallback_data.js

export const fallbackEvents = ${JSON.stringify(formattedEvents, null, 2)};

export const fallbackTeamMembers = ${JSON.stringify(formattedTeam, null, 2)};

export const fallbackGalleryImages = ${JSON.stringify(formattedGallery, null, 2)};

export const fallbackConfig = ${JSON.stringify(formattedConfig, null, 2)};
`;
    
    // Get the correct path - go up one level from backend to root, then into frontend
    const outputPath = path.join(process.cwd(), '..', 'frontend', 'src', 'data', 'fallbackData.ts');
    fs.writeFileSync(outputPath, output);
    console.log('\n✅ Data exported to frontend/src/data/fallbackData.ts');
    console.log(`   - ${formattedEvents.length} events`);
    console.log(`   - ${formattedTeam.length} team members`);
    console.log(`   - ${formattedGallery.length} gallery images`);
    console.log('   - Site configuration');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Failed to export data:', error);
    process.exit(1);
  }
}

exportFallbackData();
