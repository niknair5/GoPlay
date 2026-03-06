import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { DMMono_400Regular, DMMono_500Medium } from '@expo-google-fonts/dm-mono';
import { useFonts } from 'expo-font';
import { Redirect, type Href, Stack, usePathname, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import '@/global.css';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useGeofencing } from '../hooks/useGeofencing';

SplashScreen.preventAutoHideAsync();
import { useNotifications } from '@/hooks/useNotifications';
import { useAuthStore } from '@/store/authStore';

function NavigationGate() {
  const pathname = usePathname();
  const segments = useSegments();
  const hydrated = useAuthStore((state) => state.hydrated);
  const session = useAuthStore((state) => state.session);
  const onboardingComplete = useAuthStore((state) => state.onboardingComplete);

  if (!hydrated) {
    return <LoadingSpinner fullScreen />;
  }

  const group = segments[0] as string | undefined;
  if (!group) {
    return null;
  }
  const inAuth = group === '(auth)';
  const inOnboarding = group === 'onboarding';
  const inApp = group === '(app)';

  let targetPath: Href | null = null;

  if (!session && !inAuth) {
    targetPath = '/(auth)/welcome' as Href;
  } else if (session && !onboardingComplete && !inOnboarding) {
    targetPath = '/onboarding/location-permission' as Href;
  } else if (session && onboardingComplete && !inApp) {
    targetPath = '/(app)' as Href;
  }

  if (targetPath && pathname !== targetPath) {
    return <Redirect href={targetPath} />;
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

  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
    DMMono_400Regular,
    DMMono_500Medium,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <View className="flex-1 bg-white" onLayout={onLayoutRootView}>
        <StatusBar style="dark" />
        <NavigationGate />
        <RuntimeBootstrap />
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </ThemeProvider>
  );
}
