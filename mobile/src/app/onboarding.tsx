// Onboarding Route - Full screen onboarding flow (no tabs)
import React from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import { OnboardingFlow } from '@/components/OnboardingFlow';

export default function OnboardingScreen() {
  const handleComplete = () => {
    // Navigate to main app (tabs)
    router.replace('/(tabs)');
  };

  return (
    <View style={{ flex: 1 }}>
      <OnboardingFlow onComplete={handleComplete} />
    </View>
  );
}
