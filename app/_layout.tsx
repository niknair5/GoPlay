import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import '@/lib/geofence';
import '@/global.css';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useGeofencing } from '@/hooks/useGeofencing';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuthStore } from '@/store/authStore';

function NavigationGate() {
  const router = useRouter();
  const segments = useSegments();
  const { hydrated, session, onboardingComplete } = useAuthStore((state) => ({
    hydrated: state.hydrated,
    session: state.session,
    onboardingComplete: state.onboardingComplete,
  }));

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const group = segments[0];
    const inAuth = group === '(auth)';
    const inOnboarding = group === 'onboarding';
    const inApp = group === '(app)';

    if (!session && !inAuth) {
      router.replace('/(auth)/welcome');
      return;
    }

    if (session && !onboardingComplete && !inOnboarding) {
      router.replace('/onboarding/location-permission');
      return;
    }

    if (session && onboardingComplete && !inApp) {
      router.replace('/(app)');
    }
  }, [hydrated, onboardingComplete, router, segments, session]);

  if (!hydrated) {
    return <LoadingSpinner fullScreen />;
  }

  return null;
}

function RuntimeBootstrap() {
  const session = useAuthStore((state) => state.session);
  useNotifications(Boolean(session));
  useGeofencing(Boolean(session));
  return null;
}

export default function RootLayout() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return (
    <ThemeProvider value={DefaultTheme}>
      <View className="flex-1 bg-white">
        <StatusBar style="dark" />
        <NavigationGate />
        <RuntimeBootstrap />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(app)" />
        </Stack>
      </View>
    </ThemeProvider>
  );
}
