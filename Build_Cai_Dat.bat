@echo off
title NoteRenderer - Dong goi ung dung
cd /d "%~dp0"
echo ========================================================
echo   Dang dong goi NoteRenderer bang electron-builder...
echo ========================================================
npx electron-builder --win portable --win nsis
echo.
echo ========================================================
echo   Hoan tat! Ban co the kiem tra thu muc dist-electron.
echo ========================================================
pause
