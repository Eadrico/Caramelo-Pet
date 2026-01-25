// Add Item Selector - Choose between Care Item or Reminder
import React from 'react';
import { View, Text, Pressable, Modal, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Stethoscope, Bell } from 'lucide-react-native';
import { useColors } from '@/components/design-system';
import { useTranslation } from '@/lib/i18n';

interface AddItemSelectorProps {
  visible: boolean;
  onClose: () => void;
  onSelectCare: () => void;
  onSelectReminder: () => void;
}

export function AddItemSelector({
  visible,
  onClose,
  onSelectCare,
  onSelectReminder,
}: AddItemSelectorProps) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { t } = useTranslation();

  const handleSelectCare = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelectCare();
    onClose();
  };

  const handleSelectReminder = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelectReminder();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          justifyContent: 'flex-end',
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            backgroundColor: c.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: 40,
          }}
        >
          {/* Handle */}
          <View
            style={{
              alignItems: 'center',
              paddingTop: 12,
              paddingBottom: 16,
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: c.border,
              }}
            />
          </View>

          {/* Title */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '700',
                color: c.text,
                marginBottom: 4,
              }}
            >
              {t('common_add')}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: c.textSecondary,
              }}
            >
              {t('home_choose_what_to_add')}
            </Text>
          </View>

          {/* Options */}
          <View style={{ paddingHorizontal: 20, gap: 12 }}>
            {/* Add Care Item Option */}
            <Pressable
              onPress={handleSelectCare}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                borderRadius: 16,
                gap: 14,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: c.accentLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Stethoscope size={22} color={c.accent} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '600',
                    color: c.text,
                    marginBottom: 2,
                  }}
                >
                  {t('home_add_care_item')}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: c.textSecondary,
                  }}
                >
                  {t('home_add_care_desc')}
                </Text>
              </View>
            </Pressable>

            {/* Add Reminder Option */}
            <Pressable
              onPress={handleSelectReminder}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 16,
                backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                borderRadius: 16,
                gap: 14,
              }}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: c.accentLight,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bell size={22} color={c.accent} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 17,
                    fontWeight: '600',
                    color: c.text,
                    marginBottom: 2,
                  }}
                >
                  {t('home_add_reminder')}
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: c.textSecondary,
                  }}
                >
                  {t('home_add_reminder_desc')}
                </Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

