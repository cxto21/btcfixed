import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // Bundle ID — must match App Store Connect & Google Play Console
  // Format: com.company.appname (reverse domain)
  appId: 'com.btcfixed.app',
  appName: 'BTCFixed',
  webDir: 'dist',

  server: {
    // In production, the native app loads the locally bundled dist/
    // During development you can point to your dev server:
    // url: 'http://192.168.1.X:3000',
    // cleartext: true,
    androidScheme: 'https',
  },

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#000000',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      style: 'dark',           // dark icons on light bg / light icons on dark bg
      backgroundColor: '#000000',
      overlaysWebView: false,
    },
  },

  android: {
    // Allow cleartext for localhost during dev
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false, // set true only for debug builds
  },

  ios: {
    contentInset: 'automatic',
    scrollEnabled: true,
    allowsLinkPreview: false,
  },
};

export default config;
