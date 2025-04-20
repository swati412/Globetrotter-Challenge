@echo off
echo 🌎 Deploying Globetrotter Frontend to Vercel
echo -------------------------------------------------------------------------

REM Check if Vercel CLI is installed
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Vercel CLI not found! Installing...
    npm install -g vercel
)

REM Prompt user for backend URL
set /p BACKEND_URL=Enter your backend URL (e.g., https://globetrotter-backend.onrender.com): 

REM Create or update .env.production with backend URL
echo VITE_API_URL=%BACKEND_URL%> .env.production
echo ✅ Created .env.production with API URL: %BACKEND_URL%

REM Login to Vercel if needed
vercel whoami >nul 2>&1
if %ERRORLEVEL% NEQ 0 vercel login

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel

REM Ask if user wants to deploy to production
set /p DEPLOY_PROD=Deploy to production? (y/n): 
if /i "%DEPLOY_PROD%"=="y" (
    echo 🚀 Deploying to production...
    vercel --prod
)

echo -------------------------------------------------------------------------
echo ✅ Deployment completed!
echo Don't forget to add the Vercel domain to your backend CORS settings

pause 