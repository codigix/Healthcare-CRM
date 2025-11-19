@echo off
echo ========================================
echo Blood Bank API Test
echo ========================================

echo.
echo === Testing Health Endpoint ===
curl -s http://localhost:5000/api/health

echo.
echo === Testing Login ===
for /f "tokens=*" %%a in ('curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{"email":"admin@hospital.com","password":"admin123"}" ^| findstr /R "token"') do (
  set token=%%a
  echo Login response: %%a
)

echo.
echo === Testing Blood Stock GET (without auth - should fail) ===
curl -s http://localhost:5000/api/blood-bank/blood-stock

echo.
echo All tests completed
pause
