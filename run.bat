@echo off
title Gemlindr - Game Release Calendar (dev)
cd /d "%~dp0"

REM Open the app in the default browser (dev server is ready in ~1s)
start "" "http://localhost:3000"

REM Start the Next.js dev server (close this window to stop it)
npm run dev

pause
