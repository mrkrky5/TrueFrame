import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.medyadangercege.app',
  appName: 'Medyadan Gerçeğe',
  webDir: 'out',
  server: {
    // Hosted URL Strategy: Target the production domain with surface=app
    // Production entry point defaults to Turkish as primary market
    url: 'https://medyadangercege.com/tr?surface=app',
    
    // Whitelist domains for navigation to prevent external link hijacking within the WebView
    allowNavigation: [
      'medyadangercege.com',
      '*.medyadangercege.com'
    ]
  },
  android: {
    // In production, we strictly use HTTPS. Mixed content (HTTP images on HTTPS page) 
    // should be disabled for security unless specifically required for legacy assets.
    allowMixedContent: false,
    backgroundColor: '#FAF9F6',
  }
};

export default config;
