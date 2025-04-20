# Deploying the Globetrotter Challenge to Vercel

This guide provides step-by-step instructions for deploying the Globetrotter Challenge application to Vercel and other cloud platforms.

## Quick Start

For a quick deployment:

1. **Frontend Deployment**:
   ```bash
   cd frontend
   ./deploy-vercel.sh  # For Linux/Mac
   # OR
   deploy-vercel.bat   # For Windows
   ```

2. **Backend Deployment**:
   - Deploy on Railway, Render, or Heroku (see detailed steps below)

## Prerequisites
1. Create accounts on:
   - [Vercel](https://vercel.com/) for frontend hosting
   - [Railway](https://railway.app/) or [Render](https://render.com/) for backend hosting
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database

## Step 1: Deploy MongoDB Database

1. Create a MongoDB Atlas account
2. Create a new cluster (free tier is sufficient)
3. Set up database access (create a user with password)
4. Set up network access (allow access from anywhere for deployment)
5. Get your MongoDB connection string: `mongodb+srv://<username>:<password>@<cluster-url>/<database-name>`

## Step 2: Deploy Backend on Railway or Render

### Option 1: Railway
1. Sign up for Railway and connect your GitHub account
2. Create a new project from your GitHub repo
3. Select the `/backend` directory
4. Add environment variables:
   - `MONGO_URL=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>`
   - `DATABASE_NAME=globetrotter`
   - `ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app,http://localhost:5173`
5. Deploy and note the generated URL (e.g., `https://globetrotter-backend-production.up.railway.app`)

### Option 2: Render
1. Sign up for Render and connect your GitHub account
2. Create a new Web Service
3. Select your repository
4. Configure:
   - Name: `globetrotter-backend`
   - Root Directory: `backend`
   - Environment: `Python`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `MONGO_URL=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>`
   - `DATABASE_NAME=globetrotter`
   - `ALLOWED_ORIGINS=https://your-vercel-domain.vercel.app,http://localhost:5173`
6. Deploy and note the URL (e.g., `https://globetrotter-backend.onrender.com`)

## Step 3: Update Frontend Configuration

1. Update the environment variable in your frontend project:
   - Create `.env.production` file in the frontend directory:
   ```
   VITE_API_URL=https://your-backend-url
   ```

## Step 4: Deploy Frontend to Vercel (Manual Steps)

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Navigate to your frontend directory:
   ```
   cd frontend
   ```

3. Login to Vercel:
   ```
   vercel login
   ```

4. Deploy:
   ```
   vercel
   ```

5. For production deployment:
   ```
   vercel --prod
   ```

6. Configure environment variables in Vercel dashboard:
   - Go to your project settings
   - Add environment variable: `VITE_API_URL=https://your-backend-url`

## Step 5: Verify the Deployment

1. Open your frontend Vercel URL in a browser
2. Test all features:
   - User registration
   - Playing the game
   - Challenge a friend feature

## Troubleshooting

### CORS Issues
If you encounter CORS errors:
1. Make sure your backend `ALLOWED_ORIGINS` environment variable includes your Vercel domain
2. Check the backend logs to verify the allowed origins are correctly loaded

### API Connection Issues
1. Verify your frontend environment variable `VITE_API_URL` points to the correct backend URL
2. Make sure the backend is running and accessible
3. Check the network tab in browser developer tools for any API errors

### Database Connection Issues
1. Verify your MongoDB Atlas connection string
2. Ensure network access is set up correctly
3. Check backend logs for database connection errors

## Additional Deployment Options

### Using GitHub Integration
1. Push your code to GitHub
2. Connect Vercel to your GitHub repository
3. Configure the settings:
   - Framework Preset: Vite
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist
4. Set up environment variables in the Vercel project settings

## Additional Configuration

### CORS Configuration

Update your backend's CORS settings to allow requests from your Vercel domain:

```python
# In backend/app/main.py
origins = [
    "http://localhost:5173",
    "https://your-vercel-domain.vercel.app",  # Add your Vercel domain
]
```

### Database Migration

If needed, initialize your MongoDB Atlas database with the necessary collections. 