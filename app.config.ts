import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'fieldsong',
  slug: 'fieldsong',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#131313',
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: process.env.BUNDLE_ID ?? 'app.fieldsong',
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    package: process.env.BUNDLE_ID ?? 'app.fieldsong',
    softwareKeyboardLayoutMode: 'pan',
  },
  web: {
    favicon: './assets/favicon.png',
  },
  scheme: 'fieldsong',
  plugins: [
    'expo-font',
    'expo-secure-store',
    ['@sentry/react-native/expo', {}],
  ],
  extra: {
    supabaseUrl: process.env.SUPABASE_URL ?? 'https://rgbzqnbegozpcgdnfxfy.supabase.co',
    supabaseAnonKey:
      process.env.SUPABASE_ANON_KEY ??
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnYnpxbmJlZ296cGNnZG5meGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NDg3NjYsImV4cCI6MjA5MDEyNDc2Nn0.qs6RH_rBXf46jbqFcl3IdJut4Ss9FP9ucregSBayI7c',
    sentryDsn: process.env.SENTRY_DSN ?? '',
    revenueCatApiKey: process.env.REVENUECAT_API_KEY ?? 'test_RJRMRSgomWZDaWHURTuLatUmVtw',
  },
});
