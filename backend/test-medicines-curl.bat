@echo off
echo Testing Medicines API...
echo.

echo 1. Testing GET all medicines (no auth required for now)...
curl -s http://localhost:5000/api/medicines
echo.
echo.

echo 2. Testing GET medicine by ID...
curl -s http://localhost:5000/api/medicines/test
echo.
echo.

echo Done!
