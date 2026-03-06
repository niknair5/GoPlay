import appJson from './app.json';

const config = appJson.expo;
const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

export default () => ({
  ...config,
  ios: {
    ...config.ios,
    config: {
      ...(config.ios?.config ?? {}),
      googleMapsApiKey,
    },
  },
  android: {
    ...config.android,
    config: {
      ...(config.android?.config ?? {}),
      googleMaps: {
        ...((config.android?.config as { googleMaps?: Record<string, string> } | undefined)?.googleMaps ?? {}),
        apiKey: googleMapsApiKey,
      },
    },
  },
});
