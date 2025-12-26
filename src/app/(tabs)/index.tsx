// Home Tab - Pet List
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';
import { useStore } from '@/lib/store';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { HomeScreen } from '@/components/HomeScreen';
import { useColors } from '@/components/design-system';

export default function HomeTab() {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const isInitialized = useStore((s) => s.isInitialized);
  const isLoading = useStore((s) => s.isLoading);
  const pets = useStore((s) => s.pets);
  const initialize = useStore((s) => s.initialize);

  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      setShowOnboarding(pets.length === 0);
      SplashScreen.hideAsync();
    }
  }, [isInitialized, pets.length]);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  // Loading state
  if (isLoading || showOnboarding === null) {
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={
            isDark
              ? ['#0C0A09', '#1C1917', '#0C0A09']
              : ['#F5F2EE', '#FFFFFF', '#F5F2EE']
          }
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={c.accent} />
        </View>
      </View>
    );
  }

  // Show onboarding if no pets
  if (showOnboarding) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  // Show home screen
  return <HomeScreen />;
}
