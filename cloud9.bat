@echo off

REM Add the Google Chrome application directory to the PATH
set "PATH=%PATH%;C:\Program Files\Google\Chrome\Application"

@REM REM Change directory to your project folder
@REM cd "./cloud9"

REM Verify the current directory after changing
echo Current directory: %CD%

REM Install dependencies using npm
echo Installing dependencies...
npm install

REM Check if the server script exists
IF NOT EXIST "node_modules\.bin\your-server-script" (
    echo Server script not found. Please check your npm script configuration.
    pause
    exit /b
)

REM Start the server using npm in the background
echo Starting the server...
start "" /B npm run server

REM Wait for 10 seconds before opening Chrome tabs
echo Waiting for 10 seconds...
ping 127.0.0.1 -n 10 > nul

REM Open two tabs in Google Chrome
echo Opening two tabs in Google Chrome...
start "" "chrome.exe" "http://localhost:3000/" --new-window
start "" "chrome.exe" "http://localhost:3000/control" --new-window
