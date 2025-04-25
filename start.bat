@echo off
REM Double-click this file to start backend and frontend and open the app on Windows

REM Ensure working directory is project root
pushd "%~dp0"

echo Starting backend and frontend via npm run start...
npm run start

echo.
echo Press any key to exit...
pause > nul
popd
