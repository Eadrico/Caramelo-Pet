// AddPetWizard - Modal wizard for adding a new pet
import React, { useState } from 'react';
import { View, Modal, Pressable, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import {
  OnboardingBasics,
  OnboardingPhoto,
  OnboardingInfo,
  OnboardingReview,
} from '@/components/onboarding';
import { useColors } from '@/components/design-system';

interface AddPetWizardProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

type Step = 'basics' | 'photo' | 'info' | 'review';

const steps: Step[] = ['basics', 'photo', 'info', 'review'];

export function AddPetWizard({ visible, onClose, onComplete }: AddPetWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('basics');
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

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
    } else {
      // If on first step and going back, close the wizard
      onClose();
    }
  };

  const handleComplete = () => {
    // Reset to first step for next time
    setCurrentStep('basics');
    onComplete();
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentStep('basics');
    onClose();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'basics':
        return <OnboardingBasics onNext={goNext} />;
      case 'photo':
        return <OnboardingPhoto onNext={goNext} onBack={goBack} />;
      case 'info':
        return <OnboardingInfo onNext={goNext} onBack={goBack} />;
      case 'review':
        return <OnboardingReview onComplete={handleComplete} onBack={goBack} />;
      default:
        return null;
    }
  };

  // Reset step when modal closes
  React.useEffect(() => {
    if (!visible) {
      setCurrentStep('basics');
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <KeyboardProvider>
        <View style={{ flex: 1, backgroundColor: isDark ? '#0C0A09' : '#F5F2EE' }}>
          {/* Close button overlay */}
          {currentStep === 'basics' && (
            <SafeAreaView
              edges={['top']}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                zIndex: 100
              }}
            >
              <Pressable
                onPress={handleClose}
                style={{
                  margin: 16,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: c.surface,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} color={c.textSecondary} strokeWidth={2} />
              </Pressable>
            </SafeAreaView>
          )}

          <Animated.View
            key={currentStep}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(100)}
            style={{ flex: 1 }}
          >
            {renderStep()}
          </Animated.View>
        </View>
      </KeyboardProvider>
    </Modal>
  );
}
