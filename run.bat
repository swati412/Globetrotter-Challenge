@echo off
REM Globetrotter Application Runner for Windows

echo 🌎 Starting Globetrotter Application...
echo -------------------------------------------------------------------------
echo 🏆 This will start MongoDB, the backend API, and the frontend UI
echo -------------------------------------------------------------------------

REM Stop any existing containers
echo 🧹 Cleaning up existing containers...
docker-compose down

REM Start the services
echo 🚀 Starting services...
docker-compose up -d

REM Display access information
echo.
echo -------------------------------------------------------------------------
echo ✅ Globetrotter is starting! Wait a moment for all services to initialize.
echo.
echo 📊 Access information:
echo    🔸 Frontend UI: http://localhost:5173
echo    🔸 Backend API: http://localhost:5002
echo    🔸 MongoDB: mongodb://localhost:27017
echo.
echo 💻 View logs with: docker-compose logs -f
echo ⏹️  Stop with: docker-compose down
echo -------------------------------------------------------------------------

pause 