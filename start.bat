@echo off
title Resume AI - Launcher
cd /d "%~dp0"

echo Starting Resume AI...
echo.

REM Start backend in new window
start "Resume AI - Backend" cmd /k "cd /d "%~dp0" && npm run dev"

REM Wait for backend to begin
timeout /t 3 /nobreak >nul

REM Start frontend in new window
start "Resume AI - Frontend" cmd /k "cd /d "%~dp0\client" && npm run dev"

echo.
echo Backend and frontend are starting in separate windows.
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Close this window anytime. Use the other two windows to stop the servers.
pause
