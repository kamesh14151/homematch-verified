import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rentverify.app',
  appName: 'RentVerify',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      showSpinner: false,
      backgroundColor: '#ffffffff',
      androidScaleType: 'CENTER_CROP',
      splashFullScreen: true,
      splashImmersive: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#ffffffff',
      overlaysWebView: false,
    },
  },
};

export default config;
