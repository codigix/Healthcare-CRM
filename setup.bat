@echo off
REM Healthcare CRM Setup Script for Windows
REM This script sets up the complete healthcare management system

echo 🏥 Healthcare CRM Setup Script
echo ==============================
echo.

REM Check if Node.js is installed
echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js (v16 or higher) from https://nodejs.org/
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
    echo [ERROR] MySQL is not installed. Please install MySQL (v8.0 or higher) from https://dev.mysql.com/downloads/
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
echo [SUCCESS] Setup completed successfully! 🎉
echo.
echo Next steps:
echo 1. Edit server\.env with your database credentials and OpenAI API key
echo 2. Create MySQL database: healthcare_crm
echo 3. Run database setup: cd server && node setup-database.js
echo 4. Start the development servers: npm run dev
echo.
echo 5. Access the application:
echo    Frontend: http://localhost:3000
echo    Backend: http://localhost:5000
echo.
echo 6. Default login credentials:
echo    Email: admin@hospital.com
echo    Password: admin123
echo.
echo For more information, see SETUP.md
echo.
pause
