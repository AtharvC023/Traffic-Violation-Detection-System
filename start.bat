@echo off
echo.
echo ========================================
echo  Traffic Violation Detection System
echo ========================================
echo.

REM Start Backend Server
echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --access-log"

REM Wait for backend to initialize
timeout /t 3 /nobreak > nul

REM Start Frontend Development Server
echo [2/2] Starting Frontend Development Server...
start "Frontend Dev Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo  Servers Starting!
echo ========================================
echo.
echo  Frontend:    http://localhost:5174
echo  Backend API: http://localhost:8000
echo  API Docs:    http://localhost:8000/docs
echo.
echo  Login Credentials:
echo  - Admin:    admin / admin123
echo  - Operator: operator / operator123
echo.
echo ========================================
echo.
pause
