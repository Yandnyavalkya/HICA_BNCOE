# Data Persistence Guide

## ✅ Your Data is Safe!

All your data (team members, events, gallery images, site configuration) is stored in **MongoDB Atlas**, which is a cloud database. This means:

- ✅ **Data persists automatically** - No need to save manually
- ✅ **Data survives restarts** - Closing and reopening the project won't lose data
- ✅ **Data is backed up** - MongoDB Atlas provides automatic backups
- ✅ **Data is accessible from anywhere** - As long as you have the connection string

## How Data Persistence Works

### Team Members
- **Stored in**: MongoDB Atlas database (`hica` database, `team_members` collection)
- **When added**: Via admin panel or seed script
- **Persistence**: Permanent until manually deleted
- **Seed script**: Only adds/updates members, **never deletes** existing ones

### Events
- **Stored in**: MongoDB Atlas (`events` collection)
- **Persistence**: Permanent until manually deleted via admin panel

### Gallery Images
- **Stored in**: MongoDB Atlas (`gallery_images` collection)
- **Image files**: Stored in Cloudinary (if configured) or served from frontend public folder
- **Persistence**: Permanent until manually deleted

### Site Configuration
- **Stored in**: MongoDB Atlas (`site_configs` collection)
- **Persistence**: Permanent, can be updated via admin panel

## Important Notes

1. **MongoDB Connection**: Make sure your `.env` file has the correct `MONGODB_URI` pointing to your MongoDB Atlas cluster
2. **Seed Script**: Running `python -m app.seed_team` is safe - it only adds/updates team members, never deletes
3. **Admin Deletions**: If you delete a team member via the admin panel, it's permanent (but you can re-add them)
4. **Backups**: MongoDB Atlas provides automatic backups, but you can also export your data manually if needed

## Verifying Your Data

To verify your data is persisted:

1. Add a team member via admin panel
2. Close the application completely
3. Restart the backend server
4. Check the team page - your member should still be there!

## Troubleshooting

If data seems to disappear:
- Check your `.env` file has the correct `MONGODB_URI`
- Verify you're connecting to the same MongoDB Atlas cluster
- Check MongoDB Atlas dashboard to see if data is actually stored there
