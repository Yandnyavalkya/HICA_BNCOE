# Cloudinary Setup Guide - Step by Step

This guide will help you configure Cloudinary for image uploads in your HICA application.

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Click **"Sign Up for Free"** (free tier includes 25GB storage and 25GB bandwidth per month)
3. Fill in your details:
   - Email address
   - Password
   - Full name
   - Company/Organization (optional)
4. Verify your email address
5. Complete the signup process

## Step 2: Access Your Cloudinary Dashboard

1. After signing up, you'll be redirected to your **Dashboard**
2. If not, log in at [https://console.cloudinary.com/](https://console.cloudinary.com/)

## Step 3: Get Your Cloudinary Credentials

1. In your Cloudinary Dashboard, you'll see a section called **"Account Details"** or **"Product Environment Credentials"**
2. You'll need three pieces of information:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

   ⚠️ **Important**: Keep your API Secret secure! Never share it publicly or commit it to version control.

## Step 4: Configure Your .env File

1. Open your `.env` file in the project root (same folder as `app/` folder, NOT in the frontend folder)
2. Add or update these three lines with your Cloudinary credentials:

```bash
CLOUDINARY_CLOUD_NAME=your-cloud-name-here
CLOUDINARY_API_KEY=your-api-key-here
CLOUDINARY_API_SECRET=your-api-secret-here
```

**Example:**
```bash
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

⚠️ **IMPORTANT - Common Mistakes to Avoid:**
- ❌ **NO spaces** around the `=` sign: `CLOUDINARY_CLOUD_NAME = value` ❌ (WRONG)
- ✅ **NO spaces**: `CLOUDINARY_CLOUD_NAME=value` ✅ (CORRECT)
- ❌ **NO quotes** needed: `CLOUDINARY_CLOUD_NAME="value"` ❌ (WRONG - quotes will be included)
- ✅ **NO quotes**: `CLOUDINARY_CLOUD_NAME=value` ✅ (CORRECT)
- ❌ **NO trailing spaces** at the end of lines
- ✅ Make sure each value is on a single line (no line breaks)

3. **Save the file**
4. **Verify the file location**: The `.env` file should be in `C:\Users\dell\OneDrive\Desktop\HICA\.env` (same folder as `app/` folder)

## Step 5: Verify Your Configuration

1. Make sure your backend server is running
2. Try uploading an image through the admin panel:
   - Go to Admin Panel → Gallery Manager
   - Upload an image
   - If successful, you'll see the Cloudinary URL in the image preview

## Step 6: Test the Upload

1. Restart your backend server to load the new environment variables:
   ```bash
   # Stop the current server (Ctrl+C)
   # Then restart:
   python -m uvicorn app.main:app --reload
   ```

2. Test image upload:
   - Log in to Admin Panel
   - Go to Gallery Manager
   - Click "Upload Image"
   - Select an image file
   - Fill in the form and submit
   - The image should upload to Cloudinary and display

## Troubleshooting

### Error: "Invalid Signature"
- **Cause**: Wrong API Secret or API Key
- **Solution**: 
  1. Double-check your credentials in Cloudinary Dashboard
  2. Make sure there are no extra spaces in your `.env` file
  3. Restart your backend server after updating `.env`

### Error: "Authorization Required"
- **Cause**: Missing or incorrect Cloudinary credentials
- **Solution**: 
  1. Verify all three credentials are in your `.env` file
  2. Make sure the `.env` file is in the project root (same folder as `app/`)
  3. Restart the backend server

### Images Not Uploading
- **Cause**: Network issues or Cloudinary service problems
- **Solution**:
  1. Check your internet connection
  2. Verify Cloudinary service status
  3. Check browser console for errors
  4. Try uploading a smaller image first

### Where to Find Credentials Again
If you need to find your credentials later:
1. Log in to [Cloudinary Console](https://console.cloudinary.com/)
2. Go to **Dashboard**
3. Look for **"Product Environment Credentials"** section
4. Click **"Reveal"** next to API Secret (if hidden)

## Security Best Practices

1. ✅ **DO**: Keep your `.env` file in `.gitignore` (already done)
2. ✅ **DO**: Use different credentials for development and production
3. ❌ **DON'T**: Commit your `.env` file to Git
4. ❌ **DON'T**: Share your API Secret publicly
5. ✅ **DO**: Rotate your API Secret if it's ever exposed

## What Happens After Setup

Once configured, all images uploaded through:
- **Gallery Manager** → Stored in Cloudinary folder: `hica/gallery`
- **Event Manager** (if you add image upload) → Can be stored in `hica/events`
- **Team Manager** (if you add image upload) → Can be stored in `hica/team`

Images will be:
- Automatically optimized by Cloudinary
- Served via CDN for fast loading
- Accessible via secure URLs
- Stored permanently (until you delete them)

## Free Tier Limits

Cloudinary's free tier includes:
- **25 GB** storage
- **25 GB** bandwidth per month
- **25,000** transformations per month

For most small to medium websites, this is more than enough!

## Need Help?

- Cloudinary Documentation: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- Cloudinary Support: Available in your dashboard

---

**Quick Checklist:**
- [ ] Created Cloudinary account
- [ ] Got Cloud Name, API Key, and API Secret
- [ ] Added credentials to `.env` file
- [ ] Restarted backend server
- [ ] Tested image upload successfully
