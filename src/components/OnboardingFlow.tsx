// OnboardingFlow - Full onboarding experience (Intro + Pet Setup)
import React, { useState } from 'react';
import { View, useColorScheme } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { IntroView } from './IntroView';
import { OnboardingWizard } from './OnboardingWizard';
import { useSettingsStore } from '@/lib/settings-store';

type OnboardingStep = 'intro' | 'wizard';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState<OnboardingStep>('intro');
  const completeOnboarding = useSettingsStore((s) => s.completeOnboarding);

  const handleIntroComplete = () => {
    setStep('wizard');
  };

  const handleWizardComplete = async () => {
    await completeOnboarding();
    onComplete();
  };

  return (
    <View style={{ flex: 1 }}>
      {step === 'intro' && (
        <Animated.View
          style={{ flex: 1 }}
          entering={FadeIn.duration(300)}
          exiting={SlideOutLeft.duration(400)}
        >
          <IntroView onContinue={handleIntroComplete} />
        </Animated.View>
      )}

      {step === 'wizard' && (
        <Animated.View
          style={{ flex: 1 }}
          entering={SlideInRight.duration(400)}
          exiting={FadeOut.duration(300)}
        >
          <OnboardingWizard onComplete={handleWizardComplete} />
        </Animated.View>
      )}
    </View>
  );
}
