#!/usr/bin/env bash
set -e

echo "========================================================"
echo "         XT LUDO - 1-CLICK ANDROID APK BUILDER"
echo "========================================================"
echo ""
echo "[1/3] Installing dependencies..."
npm install

echo ""
echo "[2/3] Compiling offline game files (dist)..."
npm run build

echo ""
echo "[3/3] Setting up Android package..."
npx @capacitor/cli add android || true
npx cap sync android

echo ""
echo "========================================================"
echo "[SUCCESS] Android Project Generated!"
echo ""
echo "To generate the final APK file:"
echo "1. Run: cd android && ./gradlew assembleDebug"
echo "2. Your debug APK will be at: android/app/build/outputs/apk/debug/app-debug.apk"
echo "========================================================"
