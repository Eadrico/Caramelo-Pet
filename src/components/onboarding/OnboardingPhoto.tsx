// Onboarding Step 2: Pet Photo (Optional)
import React, { useState } from 'react';
import { View, Text, Image, Pressable, useColorScheme, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { Camera, ImagePlus, X } from 'lucide-react-native';
import { useStore } from '@/lib/store';
import {
  GlassCard,
  PrimaryButton,
  SecondaryButton,
  IconButton,
  ProgressIndicator,
  useColors,
} from '@/components/design-system';

interface OnboardingPhotoProps {
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingPhoto({ onNext, onBack }: OnboardingPhotoProps) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { t } = useTranslation();

  const name = useStore((s) => s.onboardingData.name);
  const photoUri = useStore((s) => s.onboardingData.photoUri);
  const setPhoto = useStore((s) => s.setOnboardingPhoto);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Please allow access to your photo library to add a pet photo.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setPhoto(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission needed',
        'Please allow camera access to take a pet photo.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setPhoto(result.assets[0].uri);
    }
  };

  const removePhoto = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPhoto(undefined);
  };

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
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <ProgressIndicator current={2} total={5} />
            <Pressable
              onPress={onBack}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={{ fontSize: 15, color: c.accent, fontWeight: '500' }}>
                Back
              </Text>
            </Pressable>
          </View>
          <Animated.View entering={FadeInDown.duration(400).delay(100)}>
            <Text
              style={{
                fontSize: 34,
                fontWeight: '700',
                color: c.text,
                marginTop: 24,
                letterSpacing: -0.8,
              }}
            >
              Add a Photo
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: c.textSecondary,
                marginTop: 8,
                lineHeight: 24,
              }}
            >
              Give {name} a face. This is optional.
            </Text>
          </Animated.View>
        </View>

        {/* Content */}
        <View style={{ flex: 1, paddingHorizontal: 20, marginTop: 32 }}>
          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            <GlassCard>
              <View style={{ alignItems: 'center', paddingVertical: 24 }}>
                {/* Photo Preview */}
                <View style={{ position: 'relative', marginBottom: 24 }}>
                  <View
                    style={{
                      width: 160,
                      height: 160,
                      borderRadius: 80,
                      backgroundColor: c.accentLight,
                      overflow: 'hidden',
                      borderWidth: 3,
                      borderColor: c.accent,
                    }}
                  >
                    {photoUri ? (
                      <Image
                        source={{ uri: photoUri }}
                        style={{ width: '100%', height: '100%' }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 64 }}>
                          {name.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                  </View>
                  {photoUri && (
                    <Animated.View
                      entering={FadeIn.duration(200)}
                      style={{ position: 'absolute', top: -4, right: -4 }}
                    >
                      <IconButton
                        icon={<X size={18} color={c.text} />}
                        onPress={removePhoto}
                        size="small"
                        variant="default"
                      />
                    </Animated.View>
                  )}
                </View>

                {/* Action Buttons */}
                <View style={{ gap: 12, width: '100%' }}>
                  <SecondaryButton
                    title="Choose from Library"
                    onPress={pickImage}
                    icon={<ImagePlus size={20} color={c.text} />}
                  />
                  <SecondaryButton
                    title="Take a Photo"
                    onPress={takePhoto}
                    icon={<Camera size={20} color={c.text} />}
                  />
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        </View>

        {/* Bottom Buttons */}
        <SafeAreaView edges={['bottom']}>
          <Animated.View
            entering={FadeInDown.duration(400).delay(300)}
            style={{ paddingHorizontal: 20, paddingBottom: 8, gap: 12 }}
          >
            <PrimaryButton title={t('onboarding_continue')} onPress={onNext} />
            {!photoUri && (
              <Pressable
                onPress={onNext}
                style={{ paddingVertical: 12, alignItems: 'center' }}
              >
                <Text style={{ fontSize: 15, color: c.textSecondary, fontWeight: '500' }}>
                  Skip for now
                </Text>
              </Pressable>
            )}
          </Animated.View>
        </SafeAreaView>
      </SafeAreaView>
    </View>
  );
}
