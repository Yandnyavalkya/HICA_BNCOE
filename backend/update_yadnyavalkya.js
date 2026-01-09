import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import TeamMember from './models/TeamMember.js';
import { config } from './config.js';

async function updateYadnyavalkya() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 20000,
    });
    console.log('[SUCCESS] Connected to MongoDB!');

    // Find Yadnyavalkya
    const yadnyavalkya = await TeamMember.findOne({ 
      name: { $regex: /Yadnyavalkya/i } 
    });

    // Find Sagar
    const sagar = await TeamMember.findOne({ 
      name: { $regex: /Sagar/i } 
    });

    if (!yadnyavalkya) {
      console.log('[ERROR] Yadnyavalkya Dakhore not found in database');
      await mongoose.connection.close();
      process.exit(1);
    }

    if (!sagar) {
      console.log('[WARNING] Sagar Wankhade not found. Setting Yadnyavalkya order to 9.5');
      yadnyavalkya.order = 9.5;
    } else {
      // Set Yadnyavalkya's order to be before Sagar (Sagar is 10, so Yadnyavalkya should be 9.5)
      const sagarOrder = sagar.order || 10;
      yadnyavalkya.order = sagarOrder - 0.5;
      console.log(`[INFO] Sagar's order: ${sagarOrder}`);
      console.log(`[INFO] Setting Yadnyavalkya's order to: ${yadnyavalkya.order}`);
    }

    // Update bio/description
    yadnyavalkya.bio = 'President of HICA BNCOE, leading the organization with vision, dedication, and a passion for innovation. Committed to fostering a vibrant tech community and empowering students through technology and collaboration.';

    await yadnyavalkya.save();
    console.log('[SUCCESS] Updated Yadnyavalkya Dakhore!');
    console.log(`[INFO] Name: ${yadnyavalkya.name}`);
    console.log(`[INFO] Role: ${yadnyavalkya.role}`);
    console.log(`[INFO] Order: ${yadnyavalkya.order}`);
    console.log(`[INFO] Bio: ${yadnyavalkya.bio}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Failed to update Yadnyavalkya:', error);
    process.exit(1);
  }
}

updateYadnyavalkya();
