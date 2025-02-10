
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e0bb5910f97f41ee870a86656e318689',
  appName: 'lovable-store-optimizer',
  webDir: 'dist',
  server: {
    url: 'https://e0bb5910-f97f-41ee-870a-86656e318689.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;
