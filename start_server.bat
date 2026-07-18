@echo off
cd /d "%~dp0"
if not exist "C:\Program Files\nodejs\node.exe" (
  echo Cannot find Node.js at C:\Program Files\nodejs\node.exe
  pause
  exit /b 1
)
echo Starting ClassPro local server at http://localhost:18765
echo Keep this window open while using the local pages.
"C:\Program Files\nodejs\node.exe" server.js
pause
