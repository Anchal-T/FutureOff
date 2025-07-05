@echo off
echo Starting FutureOff Yield Optimizer...
echo.

echo Installing dependencies...
call npm run install-deps
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm start"

timeout /t 3 >nul

echo Starting frontend server...
start "Frontend Server" cmd /k "npm start"

echo.
echo Both servers are starting...
echo Frontend will be available at: http://localhost:3000
echo Backend API will be available at: http://localhost:3001
echo.
echo Press any key to close this window...
pause >nul
