@echo off
REM Launch NoorCast locally so camera/mic/BLE work (getUserMedia needs a secure context)
setlocal
set PORT=8765
set URL=http://localhost:%PORT%/index.html

cd /d "%~dp0"

REM Open browser after a short delay so the server is up
start "" cmd /c "timeout /t 1 /nobreak >nul & start "" "%URL%""

REM Try Python 3 launcher first, then python, then node
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 -m http.server %PORT%
  goto :eof
)
where python >nul 2>nul
if %errorlevel%==0 (
  python -m http.server %PORT%
  goto :eof
)
where npx >nul 2>nul
if %errorlevel%==0 (
  npx --yes http-server -p %PORT% -c-1
  goto :eof
)

echo.
echo [!] No Python or Node found on PATH.
echo     Install Python from https://python.org (check "Add to PATH") and run this again.
pause
