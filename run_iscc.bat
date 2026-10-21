@echo off
cd /d "%~dp0"
if not exist backend\.venv\Scripts\python.exe (echo Run setup.bat first. & pause & exit /b 1)
start "ISCC API" /D "%~dp0backend" "%~dp0backend\.venv\Scripts\python.exe" -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
timeout /t 2 /nobreak >nul
start "ISCC Frontend" /D "%~dp0frontend" cmd /k npm run dev -- --host 127.0.0.1
timeout /t 3 /nobreak >nul
start "" http://127.0.0.1:5173
