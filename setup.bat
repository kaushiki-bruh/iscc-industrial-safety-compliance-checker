@echo off
setlocal
cd /d "%~dp0"
python -m venv backend\.venv || goto :error
call backend\.venv\Scripts\activate.bat
python -m pip install --upgrade pip || goto :error
pip install -r backend\requirements.txt || goto :error
cd frontend
call npm install || goto :error
cd ..
echo Setup complete. Run run_iscc.bat to start ISCC.
pause
exit /b 0
:error
echo Setup failed. Review the error above, confirm Python/npm and internet access, then retry.
pause
exit /b 1
