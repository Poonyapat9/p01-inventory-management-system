# Deployment Guide - StockMe Inventory Management System

This guide will walk you through deploying both the frontend and backend of the StockMe application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free)
2. [Vercel CLI](https://vercel.com/download) installed (optional but recommended)
3. Git repository with your code pushed to GitHub, GitLab, or Bitbucket
4. MongoDB Atlas database (already configured)

## Option 1: Deploy via Vercel Dashboard (Recommended for Beginners)

### Step 1: Deploy Backend

1. **Go to Vercel Dashboard**

   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"

2. **Import Backend Repository**

   - Select your Git provider (GitHub/GitLab/Bitbucket)
   - Find and import your `p01-inventory-management-system` repository
   - Click "Import"

3. **Configure Backend Project**

   - **Project Name**: `stockme-backend` (or your preferred name)
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - Click "Edit" next to Root Directory and select the `backend` folder

4. **Add Environment Variables**
   Click "Environment Variables" and add the following:

   ```
   NODE_ENV=production
   MONGO_URI=mongodb+srv://Poonyapat9:fYZRcJcxVaRvEyqR@stockme.poqrvhe.mongodb.net/stockme?retryWrites=true&w=majority
   JWT_SECRET=+AB44KcrVw8mTutUuI46CiBH/iCwg/RsvBHjH5jKLU4yVHbq8Q8+8qAIQySudDklPoJprX8ZosRuSbXJ3Tp44o6/H9D2mYJdkk3+8esAOtOH4T2/pslV/4zWVI1SLtrK66haCL1TUsazqUOvZFb6vE6gM2DlxPSbEE4lOQQsIi9ngC0qVuoQ985VmScNBuLnUCJCWYjJFg0MhRwT1yucvVaXeY0BKNNGAqa6Q==
   JWT_EXPIRE=365d
   JWT_COOKIE_EXPIRE=365
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

   **Note**: You'll update `FRONTEND_URL` after deploying the frontend

5. **Deploy Backend**
   - Click "Deploy"
   - Wait for deployment to complete (2-3 minutes)
   - Copy your backend URL (e.g., `https://stockme-backend.vercel.app`)

### Step 2: Deploy Frontend

1. **Add New Project**

   - Go back to Vercel Dashboard
   - Click "Add New..." → "Project"
   - Import the same repository again

2. **Configure Frontend Project**

   - **Project Name**: `stockme-frontend` (or your preferred name)
   - **Framework Preset**: Next.js
   - **Root Directory**: `fronted`
   - Click "Edit" next to Root Directory and select the `fronted` folder

3. **Add Environment Variables**
   Click "Environment Variables" and add:

   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api/v1
   ```

   Replace `your-backend-url.vercel.app` with your actual backend URL from Step 1

4. **Deploy Frontend**
   - Click "Deploy"
   - Wait for deployment to complete (2-3 minutes)
   - Copy your frontend URL (e.g., `https://stockme-frontend.vercel.app`)

### Step 3: Update Backend Environment

1. **Update FRONTEND_URL in Backend**
   - Go to your backend project in Vercel Dashboard
   - Click "Settings" → "Environment Variables"
   - Find `FRONTEND_URL` and update it with your frontend URL
   - Click "Save"
   - Go to "Deployments" tab and click "Redeploy" on the latest deployment

### Step 4: Configure CORS in MongoDB Atlas (if needed)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click "Network Access" in the left sidebar
3. Click "Add IP Address"
4. Select "Allow Access from Anywhere" (0.0.0.0/0)
5. Click "Confirm"

**Note**: For production, you should restrict this to specific IP addresses.

---

## Option 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy Backend

```bash
cd backend
vercel --prod
```

Follow the prompts:

- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- What's your project's name? `stockme-backend`
- In which directory is your code located? `./`

After deployment, add environment variables:

```bash
vercel env add MONGO_URI
vercel env add JWT_SECRET
vercel env add JWT_EXPIRE
vercel env add JWT_COOKIE_EXPIRE
vercel env add FRONTEND_URL
vercel env add NODE_ENV
```

Then redeploy:

```bash
vercel --prod
```

### Step 4: Deploy Frontend

```bash
cd ../fronted
vercel --prod
```

Follow the prompts:

- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- What's your project's name? `stockme-frontend`
- In which directory is your code located? `./`

Add environment variable:

```bash
vercel env add NEXT_PUBLIC_API_URL
```

Enter your backend URL when prompted, then redeploy:

```bash
vercel --prod
```

---

## Post-Deployment Checklist

- [ ] Backend is accessible at your Vercel URL
- [ ] Frontend is accessible at your Vercel URL
- [ ] Test login functionality
- [ ] Test product creation/viewing
- [ ] Test request creation/viewing
- [ ] Test notifications
- [ ] Verify API calls are working (check browser console)
- [ ] Check that images upload correctly

## Testing Your Deployment

### Test Backend Health

Visit: `https://your-backend-url.vercel.app/health`

You should see:

```json
{
  "success": true,
  "message": "StockMe API is running",
  "timestamp": "2025-11-19T...",
  "environment": "production"
}
```

### Test Frontend

1. Visit your frontend URL
2. Try to register a new account
3. Login with your credentials
4. Create a product
5. Create a request

## Troubleshooting

### Backend Issues

**Problem**: 500 Internal Server Error

- **Solution**: Check environment variables are correctly set in Vercel dashboard
- **Solution**: Check MongoDB Atlas allows connections from anywhere (0.0.0.0/0)

**Problem**: CORS errors

- **Solution**: Ensure `FRONTEND_URL` environment variable matches your frontend URL exactly

### Frontend Issues

**Problem**: API calls fail

- **Solution**: Check `NEXT_PUBLIC_API_URL` is set correctly
- **Solution**: Verify backend is deployed and accessible

**Problem**: 404 on routes

- **Solution**: This is normal for Next.js on Vercel, it handles routing automatically

## Updating Your Deployment

### Automatic Deployment (Recommended)

Once set up, Vercel automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### Manual Deployment

```bash
# Backend
cd backend
vercel --prod

# Frontend
cd fronted
vercel --prod
```

## Environment Variables Reference

### Backend (.env)

```
NODE_ENV=production
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
JWT_EXPIRE=365d
JWT_COOKIE_EXPIRE=365
FRONTEND_URL=<your-frontend-vercel-url>
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=<your-backend-vercel-url>/api/v1
```

## Viewing Logs

### Via Vercel Dashboard

1. Go to your project
2. Click "Deployments"
3. Click on a deployment
4. View "Building" and "Runtime Logs"

### Via CLI

```bash
vercel logs <deployment-url>
```

## Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update environment variables with new domain

## Security Notes

⚠️ **Important Security Recommendations:**

1. **Rotate JWT Secret**: Consider generating a new JWT secret for production
2. **Restrict MongoDB Access**: In production, limit MongoDB Atlas IP access to Vercel's IP ranges
3. **Use Environment Variables**: Never commit `.env` files to Git
4. **Enable HTTPS**: Vercel provides SSL by default
5. **Review CORS Settings**: Ensure only your frontend can access the backend

## Support

If you encounter issues:

- Check Vercel deployment logs
- Check MongoDB Atlas connection
- Verify all environment variables are set correctly
- Check the browser console for frontend errors
- Check Vercel function logs for backend errors

## Quick Reference

**Vercel Dashboard**: https://vercel.com/dashboard
**MongoDB Atlas**: https://cloud.mongodb.com/
**Vercel Documentation**: https://vercel.com/docs

---

**Congratulations! Your StockMe application is now deployed and accessible worldwide! 🎉**
