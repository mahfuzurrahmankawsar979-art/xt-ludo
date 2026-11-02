@echo off
echo ========================================================
echo          XT LUDO - 1-CLICK ANDROID APK BUILDER
echo ========================================================
echo.
echo [1/3] Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error during npm install!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [2/3] Compiling offline game files (dist)...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Error during build!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo [3/3] Setting up Android package...
call npx @capacitor/core
call npx @capacitor/cli add android
call npx cap sync android

echo.
echo ========================================================
echo [SUCCESS] Android Project Generated!
echo.
echo To compile the final .apk file:
echo 1. Open the generated 'android' folder in Android Studio
echo 2. Click: Build -> Build Bundle(s) / APK(s) -> Build APK(s)
echo 3. Transfer the .apk to your phone and install!
echo ========================================================
pause
