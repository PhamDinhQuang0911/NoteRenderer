@echo off
title NoteRenderer WebApp
cd /d "%~dp0"
echo ========================================================
echo   Dang khoi chay NoteRenderer WebApp...
echo ========================================================
start "" http://localhost:3000
node webserver.cjs
