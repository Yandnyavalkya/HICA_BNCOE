import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Event from './models/Event.js';
import { config } from './config.js';

async function seedEvents() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 20000,
    });
    console.log('[SUCCESS] Connected to MongoDB!');

    const events = [
      {
        title: 'TECH MUN 2025',
        description: 'Join us for an exciting Model United Nations conference focused on technology and innovation. This prestigious event brings together students from various institutions to discuss, debate, and collaborate on critical tech issues shaping our future. Participants will engage in thought-provoking discussions about artificial intelligence, cybersecurity, digital transformation, and sustainable technology solutions. The conference features keynote speeches from industry leaders, interactive workshops, networking sessions, and competitive debates. Whether you are a tech enthusiast, aspiring engineer, or future leader, TECH MUN 2025 offers a unique platform to enhance your knowledge, develop critical thinking skills, and connect with like-minded individuals. Don\'t miss this opportunity to be part of a transformative experience that combines diplomacy, technology, and innovation.',
        date: new Date('2025-01-15T10:00:00'),
        location: 'BNCOE Campus',
        image_url: 'https://res.cloudinary.com/dty4b2yj1/image/upload/v1767880198/tech-mun-2025.jpg',
        registration_link: null,
        event_category: 'tech-mun-2025',
      },
      {
        title: 'HICA Inauguration Ceremony',
        description: 'The official inauguration ceremony of HICA BNCOE marks a significant milestone in our journey. Join us as we celebrate the launch of our vibrant community and welcome new members into the HICA family. This grand event features inspiring speeches from faculty advisors, student leaders, and distinguished guests. The ceremony includes the official announcement of our mission, vision, and goals for the academic year. We will introduce our core team members, showcase upcoming events and initiatives, and provide opportunities for networking and collaboration. The inauguration sets the tone for a year filled with innovation, learning, and community building. Whether you are a new member or a returning participant, this ceremony is your gateway to becoming an active part of HICA\'s exciting journey. Come be part of history as we embark on this transformative adventure together.',
        date: new Date('2025-01-10T14:00:00'),
        location: 'BNCOE Campus',
        image_url: 'https://res.cloudinary.com/dty4b2yj1/image/upload/v1767880198/hica-inauguration.jpg',
        registration_link: null,
        event_category: 'hica-inauguration-2025',
      },
    ];

    let created = 0;
    let updated = 0;

    for (const eventData of events) {
      const existingEvent = await Event.findOne({ 
        event_category: eventData.event_category 
      });

      if (existingEvent) {
        // Update existing event
        Object.assign(existingEvent, eventData);
        await existingEvent.save();
        updated++;
        console.log(`[INFO] Updated event: ${eventData.title}`);
      } else {
        // Create new event
        const event = new Event(eventData);
        await event.save();
        created++;
        console.log(`[INFO] Created event: ${eventData.title}`);
      }
    }

    console.log(`\n[SUCCESS] Events seeding completed!`);
    console.log(`[INFO] Created: ${created} events`);
    console.log(`[INFO] Updated: ${updated} events`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Failed to seed events:', error);
    process.exit(1);
  }
}

seedEvents();
