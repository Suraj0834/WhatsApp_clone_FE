export default {
    expo: {
        name: "WhatsApp Clone",
        slug: "whatsapp-clone",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "automatic",
        splash: {
            image: "./assets/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        updates: {
            fallbackToCacheTimeout: 0
        },
        assetBundlePatterns: [
            "**/*"
        ],
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.yourcompany.whatsappclone"
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#FFFFFF"
            },
            package: "com.yourcompany.whatsappclone",
            permissions: [
                "CAMERA",
                "RECORD_AUDIO",
                "READ_EXTERNAL_STORAGE",
                "WRITE_EXTERNAL_STORAGE",
                "READ_CONTACTS"
            ]
        },
        web: {
            favicon: "./assets/favicon.png"
        },
        extra: {
            apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000",
            socketUrl: process.env.EXPO_PUBLIC_SOCKET_URL || "http://localhost:3000",
        },
        plugins: [
            "expo-secure-store",
            "expo-sqlite",
            [
                "expo-camera",
                {
                    "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
                    "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
                    "recordAudioAndroid": true
                }
            ],
            [
                "expo-media-library",
                {
                    "photosPermission": "Allow $(PRODUCT_NAME) to access your photos.",
                    "savePhotosPermission": "Allow $(PRODUCT_NAME) to save photos.",
                    "isAccessMediaLocationEnabled": true
                }
            ]
        ]
    }
};
