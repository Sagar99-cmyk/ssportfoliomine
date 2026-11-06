@echo off
title OmniVoice AI - React Frontend
cd /d "%~dp0\frontend"
echo ============================================================
echo   OmniVoice AI - React + Vite Frontend
echo ============================================================
echo.
echo Starting Vite development server at http://localhost:5173 ...
node ./node_modules/vite/bin/vite.js
pause
