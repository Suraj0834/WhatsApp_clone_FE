const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Suppress event-target-shim export warnings from react-native-webrtc
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'event-target-shim/index' || moduleName.endsWith('event-target-shim/index')) {
    return context.resolveRequest(
      context,
      'event-target-shim',
      platform
    );
  }
  
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
