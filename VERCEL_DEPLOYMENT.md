# Riddima Shop - Vercel Deployment Guide

## Quick Deploy Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/riddima-shop.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the setup
   - Click "Deploy"

3. **Done!** Your site is live at `https://your-project.vercel.app`

## What Changed:

- Created `/api/contact.js` - Handles contact form submissions
- Created `/api/search.js` - Handles product search
- Created `vercel.json` - Tells Vercel how to route requests
- Your `messages.json` will store contact messages

## Testing Locally:

```bash
npm install
npm start
```

Then open `http://localhost:3000` - It works the same as before!

## Important Notes:

- Messages are stored in `messages.json` (will persist on Vercel)
- Search works without the server (frontend filtering + API)
- WhatsApp order buttons work directly (no backend needed)
- All external images load from Unsplash (no storage needed)

