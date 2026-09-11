@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul || (echo [ERROR] Node.js 20+ is required.& pause & exit /b 1)
where ffmpeg >nul 2>nul || (echo [ERROR] FFmpeg must be installed and added to PATH.& pause & exit /b 1)
where ffprobe >nul 2>nul || (echo [ERROR] FFprobe must be installed and added to PATH.& pause & exit /b 1)
start "" powershell -NoProfile -Command "Start-Sleep -Seconds 1; Start-Process 'http://127.0.0.1:4317'"
node src\server.mjs
pause
