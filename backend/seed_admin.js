import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from './models/User.js';
import { hashPassword } from './utils/security.js';
import { config } from './config.js';

async function seedAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 20000,
    });
    console.log('[SUCCESS] Connected to MongoDB!');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@hica.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`[INFO] Admin user with email ${adminEmail} already exists.`);
      console.log('[INFO] To create a new admin, delete the existing one first.');
      await mongoose.connection.close();
      return;
    }

    // Create admin user
    const hashedPassword = await hashPassword(adminPassword);
    const admin = new User({
      email: adminEmail,
      full_name: 'Admin User',
      hashed_password: hashedPassword,
      is_active: true,
      is_admin: true,
    });

    await admin.save();
    console.log(`[SUCCESS] Admin user created successfully!`);
    console.log(`[INFO] Email: ${adminEmail}`);
    console.log(`[INFO] Password: ${adminPassword}`);
    console.log(`[WARNING] Please change the default password after first login.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Failed to seed admin:', error);
    process.exit(1);
  }
}

seedAdmin();
