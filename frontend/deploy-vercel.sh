#!/bin/bash
echo "🌎 Deploying Globetrotter Frontend to Vercel"
echo "-------------------------------------------------------------------------"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found! Installing..."
    npm install -g vercel
fi

# Prompt user for backend URL
read -p "Enter your backend URL (e.g., https://globetrotter-backend.onrender.com): " BACKEND_URL

# Create or update .env.production with backend URL
echo "VITE_API_URL=$BACKEND_URL" > .env.production
echo "✅ Created .env.production with API URL: $BACKEND_URL"

# Login to Vercel if needed
vercel whoami &> /dev/null || vercel login

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel

# Ask if user wants to deploy to production
read -p "Deploy to production? (y/n): " DEPLOY_PROD
if [[ $DEPLOY_PROD == "y" || $DEPLOY_PROD == "Y" ]]; then
    echo "🚀 Deploying to production..."
    vercel --prod
fi

echo "-------------------------------------------------------------------------"
echo "✅ Deployment completed!"
echo "Don't forget to add the Vercel domain to your backend CORS settings" 