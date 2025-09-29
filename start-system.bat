@echo off
REM Healthcare CRM Complete System Startup Script for Windows
echo 🏥 Healthcare CRM - Complete System Startup
echo ===========================================
echo.

REM Check if Node.js is installed
echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js (v16 or higher)
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [SUCCESS] Node.js is installed: %NODE_VERSION%
)

REM Check if MySQL is installed
echo [INFO] Checking MySQL installation...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] MySQL is not installed. Please install MySQL (v8.0 or higher)
    pause
    exit /b 1
) else (
    echo [SUCCESS] MySQL is installed
)

echo.
echo [INFO] Installing project dependencies...

REM Install root dependencies
echo [INFO] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install root dependencies
    pause
    exit /b 1
)

REM Install server dependencies
echo [INFO] Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install server dependencies
    pause
    exit /b 1
)
cd ..

REM Install client dependencies
echo [INFO] Installing client dependencies...
cd client
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install client dependencies
    pause
    exit /b 1
)
cd ..

echo [SUCCESS] All dependencies installed successfully!
echo.

REM Setup environment files
echo [INFO] Setting up environment files...

REM Server environment
if not exist "server\.env" (
    echo [INFO] Creating server environment file...
    copy "server\env.example" "server\.env"
    echo [WARNING] Please edit server\.env with your database credentials and API keys
) else (
    echo [SUCCESS] Server environment file already exists
)

REM Client environment
if not exist "client\.env" (
    echo [INFO] Creating client environment file...
    copy "client\env.example" "client\.env"
    echo [SUCCESS] Client environment file created
) else (
    echo [SUCCESS] Client environment file already exists
)

echo.
echo [INFO] Setting up database...

REM Test database setup
cd server
node test-system.js
if %errorlevel% neq 0 (
    echo [ERROR] Database setup failed
    pause
    exit /b 1
)
cd ..

echo [SUCCESS] Database setup completed!
echo.

echo [INFO] Starting Healthcare CRM System...
echo.
echo [SUCCESS] 🚀 Starting both frontend and backend servers...
echo.
echo 📱 Frontend will be available at: http://localhost:3000
echo 🔧 Backend API will be available at: http://localhost:5000
echo 📊 Health check: http://localhost:5000/api/health
echo.
echo 🔑 Default login credentials:
echo    Email: admin@hospital.com
echo    Password: admin123
echo.
echo Press Ctrl+C to stop the servers
echo.

REM Start both servers
call npm run dev
