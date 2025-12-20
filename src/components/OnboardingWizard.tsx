// Onboarding Wizard Container
import React, { useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import {
  OnboardingBasics,
  OnboardingPhoto,
  OnboardingInfo,
  OnboardingCare,
  OnboardingReview,
} from '@/components/onboarding';

interface OnboardingWizardProps {
  onComplete: () => void;
}

type Step = 'basics' | 'photo' | 'info' | 'care' | 'review';

const steps: Step[] = ['basics', 'photo', 'info', 'care', 'review'];

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('basics');

  const goNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const goBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'basics':
        return <OnboardingBasics onNext={goNext} />;
      case 'photo':
        return <OnboardingPhoto onNext={goNext} onBack={goBack} />;
      case 'info':
        return <OnboardingInfo onNext={goNext} onBack={goBack} />;
      case 'care':
        return <OnboardingCare onNext={goNext} onBack={goBack} />;
      case 'review':
        return <OnboardingReview onComplete={onComplete} onBack={goBack} />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        key={currentStep}
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(100)}
        style={{ flex: 1 }}
      >
        {renderStep()}
      </Animated.View>
    </View>
  );
}
