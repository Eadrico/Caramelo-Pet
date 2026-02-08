import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router, useRootNavigationState } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/lib/useColorScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/lib/settings-store';
import { useStore } from '@/lib/store';
import { LanguageProvider } from '@/lib/i18n';
import { Image } from 'react-native';
import { Asset } from 'expo-asset';

import '../../global.css';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

// Custom theme with Caramelo colors
const CarameloLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F5F2EE',
    card: '#FFFFFF',
    text: '#1C1917',
    border: 'rgba(0, 0, 0, 0.06)',
    primary: '#C4A77D',
  },
};

const CarameloDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0C0A09',
    card: '#1C1917',
    text: '#FAFAF9',
    border: 'rgba(255, 255, 255, 0.08)',
    primary: '#D4B896',
  },
};

function RootLayoutNav({ colorScheme }: { colorScheme: 'light' | 'dark' | null | undefined }) {
  // Initialize stores
  const settingsInitialized = useSettingsStore((s) => s.isInitialized);
  const hasCompletedOnboarding = useSettingsStore((s) => s.hasCompletedOnboarding);
  const initializeSettings = useSettingsStore((s) => s.initialize);

  const appInitialized = useStore((s) => s.isInitialized);
  const initializeApp = useStore((s) => s.initialize);

  // Track if we've already navigated
  const [hasNavigated, setHasNavigated] = useState(false);

  // Check if navigation is ready
  const rootNavigationState = useRootNavigationState();
  const isNavigationReady = rootNavigationState?.key != null;

  // Initialize on mount and preload images
  useEffect(() => {
    initializeSettings();
    initializeApp();

    // Preload paywall icon for instant display
    Image.prefetch(Asset.fromModule(require('../../../assets/icon-small.png')).uri);
  }, []);

  // Handle navigation based on onboarding state - only after navigation is ready
  useEffect(() => {
    if (settingsInitialized && appInitialized && isNavigationReady && !hasNavigated) {
      // Keep splash screen visible for 3.5 seconds
      setTimeout(() => {
        SplashScreen.hideAsync();
        setHasNavigated(true);

        if (hasCompletedOnboarding) {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      }, 3500); // 3.5 seconds delay
    }
  }, [settingsInitialized, appInitialized, hasCompletedOnboarding, isNavigationReady, hasNavigated]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? CarameloDarkTheme : CarameloLightTheme}>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardProvider>
          <LanguageProvider>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <RootLayoutNav colorScheme={colorScheme} />
          </LanguageProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}