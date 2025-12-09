#!/bin/bash

echo "🧹 Cleaning WhatsApp Clone App..."

# Navigate to expo-app directory
cd "$(dirname "$0")"

# Stop any running Metro bundler
echo "Stopping Metro bundler..."
pkill -f "react-native" || true
pkill -f "metro" || true

# Clear Metro bundler cache
echo "Clearing Metro cache..."
rm -rf node_modules/.cache
rm -rf .expo
rm -rf $TMPDIR/react-*
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

# Clear watchman
if command -v watchman &> /dev/null; then
    echo "Clearing watchman..."
    watchman watch-del-all
fi

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Reinstall dependencies
echo "Reinstalling dependencies..."
rm -rf node_modules
npm install

# Clear iOS build (if exists)
if [ -d "ios" ]; then
    echo "Clearing iOS build..."
    cd ios
    rm -rf build
    rm -rf Pods
    rm -rf ~/Library/Developer/Xcode/DerivedData/*
    pod deintegrate || true
    pod install || true
    cd ..
fi

# Clear Android build (if exists)
if [ -d "android" ]; then
    echo "Clearing Android build..."
    cd android
    ./gradlew clean || true
    rm -rf .gradle
    rm -rf build
    rm -rf app/build
    cd ..
fi

echo "✅ Cleanup complete!"
echo ""
echo "Now run:"
echo "  npx expo start -c"
echo ""
echo "Then:"
echo "  1. Uninstall the app from your device/emulator"
echo "  2. Reinstall by scanning QR code or running on emulator"
