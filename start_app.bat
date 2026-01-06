@echo off
echo ==========================================
echo     Starting StudyFlow (Instant Mode)
echo ==========================================
echo.
echo Using pre-built files - INSTANT LOAD!
echo.
echo For Mobile Access, connect to the same WiFi and use:
echo http://[YOUR_IP_ADDRESS]:3000
echo.
echo Your IP Address(es):
ipconfig | findstr "IPv4"
echo.
echo ------------------------------------------

cd /d "%~dp0"
start "" "http://localhost:3000"
call npx serve out -l 3000
pause
