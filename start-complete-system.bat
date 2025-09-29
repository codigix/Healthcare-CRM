@echo off
echo.
echo ========================================
echo   Healthcare CRM System Startup
echo ========================================
echo.

echo [1/4] Checking system requirements...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)
echo ✅ Node.js is installed

npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)
echo ✅ npm is installed

echo.
echo [2/4] Installing dependencies...
echo Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

echo Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install server dependencies
    pause
    exit /b 1
)

echo Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install client dependencies
    pause
    exit /b 1
)
cd ..

echo ✅ All dependencies installed successfully

echo.
echo [3/4] Setting up database...
cd server
echo Testing database connection...
call node test-complete-system.js
if %errorlevel% neq 0 (
    echo ⚠️  Database setup had issues, but continuing...
)
cd ..

echo.
echo [4/4] Starting Healthcare CRM System...
echo.
echo 🚀 Starting backend server...
start "Healthcare CRM Server" cmd /k "cd server && npm run dev"

echo ⏳ Waiting for server to start...
timeout /t 5 /nobreak >nul

echo 🚀 Starting frontend client...
start "Healthcare CRM Client" cmd /k "cd client && npm start"

echo.
echo ========================================
echo   Healthcare CRM System Started!
echo ========================================
echo.
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend:  http://localhost:5000
echo 📚 API Docs: http://localhost:5000/api/docs
echo.
echo 🔑 Default Login Credentials:
echo    Email: admin@hospital.com
echo    Password: admin123
echo.
echo 📋 Available Features:
echo    • Complete CRUD operations for all entities
echo    • User management with role-based access
echo    • Patient management with medical records
echo    • Doctor profiles with scheduling
echo    • Appointment booking and management
echo    • Department management
echo    • AI-powered reports and analytics
echo    • Real-time notifications
echo    • Data export and import
echo.
echo Press any key to open the application...
pause >nul

echo Opening Healthcare CRM in your browser...
start http://localhost:3000

echo.
echo System is running! Check the opened windows for any errors.
echo To stop the system, close both command windows.
pause
