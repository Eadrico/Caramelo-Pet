// Onboarding Step 4: Initial Care Setup
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  Pressable,
  useColorScheme,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import {
  Syringe,
  Scissors,
  Pill,
  Stethoscope,
  Plus,
  X,
  Calendar,
  Trash2,
} from 'lucide-react-native';
import { useStore } from '@/lib/store';
import { CareType, formatDate, getCareTypeLabel } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import {
  GlassCard,
  PrimaryButton,
  SecondaryButton,
  IconButton,
  ProgressIndicator,
  useColors,
} from '@/components/design-system';

interface OnboardingCareProps {
  onNext: () => void;
  onBack: () => void;
}

const careTypeConfig: {
  type: CareType;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  defaultTitle: string;
}[] = [
  { type: 'vaccine', label: '', icon: Syringe, defaultTitle: 'Vaccination' },
  { type: 'grooming', label: '', icon: Scissors, defaultTitle: 'Grooming appointment' },
  { type: 'medication', label: '', icon: Pill, defaultTitle: 'Medication refill' },
  { type: 'vet_visit', label: '', icon: Stethoscope, defaultTitle: 'Vet checkup' },
];

export function OnboardingCare({ onNext, onBack }: OnboardingCareProps) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  // Get translated care type config
  const translatedCareTypeConfig = careTypeConfig.map(config => ({
    ...config,
    label: t(`care_${config.type}` as any),
  }));

  const name = useStore((s) => s.onboardingData.name);
  const careItems = useStore((s) => s.onboardingData.careItems);
  const addCareItem = useStore((s) => s.addOnboardingCareItem);
  const removeCareItem = useStore((s) => s.removeOnboardingCareItem);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState<CareType | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState<Date>(new Date());
  const [editNotes, setEditNotes] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const openAddModal = (type: CareType) => {
    const config = translatedCareTypeConfig.find((c) => c.type === type);
    setSelectedType(type);
    setEditTitle(config?.defaultTitle || '');
    setEditDate(new Date());
    setEditNotes('');
    setShowAddModal(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSaveItem = () => {
    if (!selectedType || !editTitle.trim()) return;

    addCareItem({
      type: selectedType,
      title: editTitle.trim(),
      dueDate: editDate.toISOString(),
      notes: editNotes.trim() || undefined,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowAddModal(false);
    setSelectedType(null);
  };

  const handleRemoveItem = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    removeCareItem(index);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      Haptics.selectionAsync();
      setEditDate(selectedDate);
    }
  };

  const getIconComponent = (type: CareType) => {
    const config = careTypeConfig.find((c) => c.type === type);
    const Icon = config?.icon || Calendar;
    return <Icon size={18} color={c.accent} />;
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
      <View style={{ flex: 1, paddingTop: insets.top }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <ProgressIndicator current={4} total={5} />
            <Pressable
              onPress={onBack}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={{ fontSize: 15, color: c.accent, fontWeight: '500' }}>
                {t('onboarding_back')}
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
              {t('onboarding_step4_title')}
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: c.textSecondary,
                marginTop: 8,
                lineHeight: 24,
              }}
            >
              {t('onboarding_step4_subtitle')}
            </Text>
          </Animated.View>
        </View>

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 32, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Add Care Type Buttons */}
          <Animated.View entering={FadeInDown.duration(400).delay(200)}>
            <GlassCard>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: c.textTertiary,
                  marginBottom: 16,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {t('care_add_item')}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {translatedCareTypeConfig.map(({ type, label, icon: Icon }) => (
                  <Pressable
                    key={type}
                    onPress={() => openAddModal(type)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                      borderRadius: 12,
                      gap: 8,
                    }}
                  >
                    <Icon size={18} color={c.accent} />
                    <Text style={{ fontSize: 15, fontWeight: '500', color: c.text }}>
                      {label}
                    </Text>
                    <Plus size={16} color={c.textSecondary} />
                  </Pressable>
                ))}
              </View>
            </GlassCard>
          </Animated.View>

          {/* Added Items */}
          {careItems.length > 0 && (
            <Animated.View
              entering={FadeInDown.duration(400).delay(300)}
              style={{ marginTop: 24 }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: c.textTertiary,
                  marginBottom: 12,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {t('care_add_item')} ({careItems.length})
              </Text>
              <View style={{ gap: 8 }}>
                {careItems.map((item, index) => (
                  <Animated.View
                    key={`${item.type}-${index}`}
                    entering={FadeIn.duration(200)}
                    exiting={FadeOut.duration(200)}
                    layout={Layout.springify()}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 16,
                        backgroundColor: c.surface,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: c.border,
                        gap: 12,
                      }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          backgroundColor: c.accentLight,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {getIconComponent(item.type)}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '500',
                            color: c.text,
                            marginBottom: 2,
                          }}
                        >
                          {item.title}
                        </Text>
                        <Text style={{ fontSize: 14, color: c.textSecondary }}>
                          {formatDate(item.dueDate)}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => handleRemoveItem(index)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Trash2 size={20} color={c.destructive} />
                      </Pressable>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>
          )}
        </ScrollView>

        {/* Bottom Button */}
        <View style={{ position: 'absolute', bottom: insets.bottom, left: 0, right: 0 }}>
          <View
            style={{
              backgroundColor: isDark ? '#0C0A09' : '#F5F2EE',
              paddingTop: 16,
              paddingHorizontal: 20,
              paddingBottom: 8,
            }}
          >
            <PrimaryButton title={t('onboarding_continue')} onPress={onNext} />
          </View>
        </View>
      </View>

      {/* Add Item Modal */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
          onPress={() => setShowAddModal(false)}
        />
        <View
          style={{
            backgroundColor: c.surface,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: Platform.OS === 'ios' ? 34 : 20,
          }}
        >
          {/* Modal Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: c.border,
            }}
          >
            <Pressable onPress={() => setShowAddModal(false)}>
              <Text style={{ fontSize: 17, color: c.textSecondary }}>{t('common_cancel')}</Text>
            </Pressable>
            <Text style={{ fontSize: 17, fontWeight: '600', color: c.text }}>
              {t('care_add_item')}
            </Text>
            <Pressable onPress={handleSaveItem} disabled={!editTitle.trim()}>
              <Text
                style={{
                  fontSize: 17,
                  color: editTitle.trim() ? c.accent : c.textTertiary,
                  fontWeight: '600',
                }}
              >
                {t('settings_save')}
              </Text>
            </Pressable>
          </View>

          {/* Modal Content */}
          <View style={{ padding: 20, gap: 20 }}>
            {/* Title */}
            <View>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: c.textTertiary,
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {t('care_title_label')}
              </Text>
              <RNTextInput
                value={editTitle}
                onChangeText={setEditTitle}
                placeholder={t('care_title_placeholder')}
                placeholderTextColor={c.textTertiary}
                style={{
                  fontSize: 17,
                  color: c.text,
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  borderRadius: 12,
                }}
              />
            </View>

            {/* Due Date */}
            <View>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: c.textTertiary,
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {t('care_due_date_label')}
              </Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  borderRadius: 12,
                  gap: 12,
                }}
              >
                <Calendar size={20} color={c.accent} />
                <Text style={{ fontSize: 17, color: c.text }}>
                  {formatDate(editDate.toISOString())}
                </Text>
              </Pressable>
            </View>

            {/* Notes */}
            <View>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: c.textTertiary,
                  marginBottom: 8,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {t('care_notes_label')}
              </Text>
              <RNTextInput
                value={editNotes}
                onChangeText={setEditNotes}
                placeholder={t('care_notes_placeholder')}
                placeholderTextColor={c.textTertiary}
                multiline
                numberOfLines={3}
                style={{
                  fontSize: 17,
                  color: c.text,
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  borderRadius: 12,
                  minHeight: 80,
                  textAlignVertical: 'top',
                }}
              />
            </View>
          </View>
        </View>

        {/* Date Picker for Modal */}
        {Platform.OS === 'ios' && showDatePicker && (
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: c.surface,
              borderTopWidth: 1,
              borderTopColor: c.border,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 16,
              }}
            >
              <Pressable onPress={() => setShowDatePicker(false)}>
                <Text style={{ fontSize: 17, color: c.textSecondary }}>{t('common_cancel')}</Text>
              </Pressable>
              <Pressable onPress={() => setShowDatePicker(false)}>
                <Text style={{ fontSize: 17, color: c.accent, fontWeight: '600' }}>{t('common_done')}</Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={editDate}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              minimumDate={new Date()}
              style={{ height: 200, alignSelf: 'center' }}
            />
          </View>
        )}
      </Modal>

      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={editDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
}
