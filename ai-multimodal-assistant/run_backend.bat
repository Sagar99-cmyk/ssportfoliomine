@echo off
title OmniVoice AI - FastAPI Backend
cd /d "%~dp0\backend"
echo ============================================================
echo   OmniVoice AI - Free Multimodal Backend
echo   FastAPI + Uvicorn + WebSocket Voice Engine
echo ============================================================
echo.
if exist ".venv\Scripts\python.exe" (
    echo Using virtual environment (.venv) ...
    ".venv\Scripts\python.exe" -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
) else (
    echo Using system Python ...
    python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
)
pause
