// Add/Edit Reminder Sheet
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput as RNTextInput,
  Pressable,
  useColorScheme,
  Modal,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { Calendar, Trash2, CalendarPlus } from 'lucide-react-native';
import { Reminder } from '@/lib/types';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import { useColors } from '@/components/design-system';
import { PetChip } from '@/components/PetChip';
import { calendarService } from '@/lib/calendarService';

interface AddReminderSheetProps {
  visible: boolean;
  onClose: () => void;
  editItem?: Reminder;
  preselectedPetId?: string;
}

export function AddReminderSheet({
  visible,
  onClose,
  editItem,
  preselectedPetId,
}: AddReminderSheetProps) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { t } = useTranslation();

  const pets = useStore((s) => s.pets);
  const addReminder = useStore((s) => s.addReminder);
  const updateReminder = useStore((s) => s.updateReminder);
  const deleteReminder = useStore((s) => s.deleteReminder);

  const [selectedPetIds, setSelectedPetIds] = useState<string[]>(
    editItem ? [editItem.petId] : preselectedPetId ? [preselectedPetId] : pets.length > 0 ? [pets[0].id] : []
  );
  const [title, setTitle] = useState(editItem?.title || '');
  const [message, setMessage] = useState(editItem?.message || '');
  const [dateTime, setDateTime] = useState<Date>(
    editItem ? new Date(editItem.dateTime) : new Date()
  );
  const [repeatType, setRepeatType] = useState<Reminder['repeatType']>(
    editItem?.repeatType || 'none'
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [addToCalendar, setAddToCalendar] = useState(false);

  // Reset form when opening
  useEffect(() => {
    if (visible) {
      if (editItem) {
        // Edit mode: only one pet
        setSelectedPetIds([editItem.petId]);
        setTitle(editItem.title);
        setMessage(editItem.message || '');
        setDateTime(new Date(editItem.dateTime));
        setRepeatType(editItem.repeatType);
      } else {
        // Create mode: start with one pet if preselected, otherwise empty
        setSelectedPetIds(preselectedPetId ? [preselectedPetId] : []);
        setTitle('');
        setMessage('');
        setDateTime(new Date());
        setRepeatType('none');
      }
    }
  }, [visible, editItem, preselectedPetId, pets]);

  const handleSave = async () => {
    if (!title.trim() || selectedPetIds.length === 0) return;

    setIsSaving(true);
    try {
      if (editItem) {
        // Edit mode: update single reminder
        let calendarEventId = editItem.calendarEventId;

        // Add to calendar if requested
        if (addToCalendar) {
          const pet = pets.find((p) => p.id === selectedPetIds[0]);
          const result = await calendarService.addReminderToCalendar(
            title.trim(),
            dateTime.toISOString(),
            message.trim() || undefined,
            pet?.name,
            repeatType
          );
          if (result.success && result.eventId) {
            calendarEventId = result.eventId;
          }
        }

        await updateReminder(editItem.id, {
          petId: selectedPetIds[0],
          title: title.trim(),
          message: message.trim() || undefined,
          dateTime: dateTime.toISOString(),
          repeatType,
          isEnabled: editItem.isEnabled,
          calendarEventId,
        });
      } else {
        // Create mode: create one reminder for each selected pet
        const promises = selectedPetIds.map(async (petId) => {
          let calendarEventId: string | undefined;

          // Add to calendar if requested
          if (addToCalendar) {
            const pet = pets.find((p) => p.id === petId);
            const result = await calendarService.addReminderToCalendar(
              title.trim(),
              dateTime.toISOString(),
              message.trim() || undefined,
              pet?.name,
              repeatType
            );
            if (result.success && result.eventId) {
              calendarEventId = result.eventId;
            }
          }

          await addReminder({
            petId,
            title: title.trim(),
            message: message.trim() || undefined,
            dateTime: dateTime.toISOString(),
            repeatType,
            isEnabled: true,
            calendarEventId,
          });
        });
        await Promise.all(promises);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    } catch (error) {
      console.error('Error saving reminder:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!editItem) return;

    Alert.alert(
      t('common_delete_reminder'),
      t('common_delete_reminder_confirm'),
      [
        { text: t('common_cancel'), style: 'cancel' },
        {
          text: t('common_delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete from calendar if it was added
              if (editItem.calendarEventId) {
                await calendarService.deleteEvent(editItem.calendarEventId);
              }
              await deleteReminder(editItem.id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onClose();
            } catch (error) {
              console.error('Error deleting reminder:', error);
            }
          },
        },
      ]
    );
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      Haptics.selectionAsync();
      const newDate = new Date(dateTime);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setDateTime(newDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      Haptics.selectionAsync();
      const newDate = new Date(dateTime);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDateTime(newDate);
    }
  };

  const isValid = title.trim() && selectedPetIds.length > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: c.background }}>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: c.border,
            }}
          >
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
            >
              <Text style={{ fontSize: 17, color: c.textSecondary }}>{t('common_cancel')}</Text>
            </Pressable>
            <Text style={{ fontSize: 17, fontWeight: '600', color: c.text }}>
              {editItem ? t('common_edit_reminder') : t('common_new_reminder')}
            </Text>
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                handleSave();
              }}
              disabled={!isValid || isSaving}
            >
              <Text
                style={{
                  fontSize: 17,
                  color: isValid && !isSaving ? c.accent : c.textTertiary,
                  fontWeight: '600',
                }}
              >
                {isSaving ? t('common_saving') : editItem ? t('settings_save') : t('common_add')}
              </Text>
            </Pressable>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, gap: 24 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Pet Selector - Always first, always shown */}
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
                {editItem ? t('care_pet_label') : t('care_select_pets')}
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingRight: 20 }}
              >
                {pets.map((pet) => (
                  <PetChip
                    key={pet.id}
                    pet={pet}
                    selected={selectedPetIds.includes(pet.id)}
                    onPress={() => {
                      if (editItem) {
                        // Edit mode: single selection
                        setSelectedPetIds([pet.id]);
                      } else {
                        // Create mode: multiple selection
                        setSelectedPetIds((prev) => {
                          if (prev.includes(pet.id)) {
                            return prev.filter((id) => id !== pet.id);
                          } else {
                            return [...prev, pet.id];
                          }
                        });
                      }
                      Haptics.selectionAsync();
                    }}
                    size="medium"
                  />
                ))}
              </ScrollView>
            </View>

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
                {t('common_title')}
              </Text>
              <RNTextInput
                value={title}
                onChangeText={setTitle}
                placeholder={t('care_reminder_title_placeholder')}
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

            {/* Message */}
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
                {t('common_message_optional')}
              </Text>
              <RNTextInput
                value={message}
                onChangeText={setMessage}
                placeholder={t('care_message_placeholder')}
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
                  minHeight: 100,
                  textAlignVertical: 'top',
                }}
              />
            </View>

            {/* Date & Time */}
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
                {t('common_date_time')}
              </Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowDatePicker(true);
                  }}
                  style={{
                    flex: 1,
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
                    {dateTime.toLocaleDateString()}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowTimePicker(true);
                  }}
                  style={{
                    flex: 1,
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
                    {dateTime.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Repeat */}
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
                {t('common_repeat')}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {(['none', 'daily', 'weekly', 'monthly'] as const).map((type) => {
                  const getLabel = () => {
                    switch (type) {
                      case 'none': return t('common_once');
                      case 'daily': return t('common_daily');
                      case 'weekly': return t('common_weekly');
                      case 'monthly': return t('common_monthly');
                    }
                  };

                  return (
                    <Pressable
                      key={type}
                      onPress={() => {
                        setRepeatType(type);
                        Haptics.selectionAsync();
                      }}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 20,
                        backgroundColor:
                          repeatType === type
                            ? c.accent
                            : isDark
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.05)',
                        borderWidth: 1,
                        borderColor: repeatType === type ? c.accent : c.border,
                      }}
                    >
                      <Text
                        style={{
                          color: repeatType === type ? '#FFFFFF' : c.text,
                          fontSize: 14,
                          fontWeight: '500',
                        }}
                      >
                        {getLabel()}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Add to Calendar Toggle */}
            <View>
              <Pressable
                onPress={() => {
                  setAddToCalendar(!addToCalendar);
                  Haptics.selectionAsync();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  borderRadius: 12,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      backgroundColor: addToCalendar ? c.accentLight : isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CalendarPlus size={18} color={addToCalendar ? c.accent : c.textSecondary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 17, color: c.text, fontWeight: '500' }}>
                      Adicionar ao Calendário
                    </Text>
                    <Text style={{ fontSize: 13, color: c.textSecondary, marginTop: 2 }}>
                      Sincronize com seu calendário pessoal
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: 51,
                    height: 31,
                    borderRadius: 15.5,
                    backgroundColor: addToCalendar ? c.accent : isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.1)',
                    justifyContent: 'center',
                    paddingHorizontal: 2,
                  }}
                >
                  <View
                    style={{
                      width: 27,
                      height: 27,
                      borderRadius: 13.5,
                      backgroundColor: '#FFFFFF',
                      alignSelf: addToCalendar ? 'flex-end' : 'flex-start',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 2,
                      elevation: 3,
                    }}
                  />
                </View>
              </Pressable>
            </View>

            {/* Delete Button (Edit Mode) */}
            {editItem && (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  handleDelete();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 14,
                  gap: 8,
                }}
              >
                <Trash2 size={18} color={c.destructive} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '500',
                    color: c.destructive,
                  }}
                >
                  {t('common_delete_reminder')}
                </Text>
              </Pressable>
            )}
          </ScrollView>
        </SafeAreaView>

        {/* Date Picker */}
        {Platform.OS === 'ios' ? (
          <Modal
            visible={showDatePicker}
            transparent
            animationType="slide"
          >
            <Pressable
              style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
              onPress={() => setShowDatePicker(false)}
            />
            <SafeAreaView edges={['bottom']} style={{ backgroundColor: c.surface }}>
            <View
              style={{
                backgroundColor: c.surface,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
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
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={{ fontSize: 17, color: c.textSecondary }}>{t('common_cancel')}</Text>
                </Pressable>
                <Text style={{ fontSize: 17, fontWeight: '600', color: c.text }}>
                  {t('common_date')}
                </Text>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowDatePicker(false);
                  }}
                >
                  <Text style={{ fontSize: 17, color: c.accent, fontWeight: '600' }}>{t('common_done')}</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={dateTime}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                style={{ height: 200, alignSelf: 'center' }}
              />
            </View>
            </SafeAreaView>
          </Modal>
        ) : (
          showDatePicker && (
            <DateTimePicker
              value={dateTime}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )
        )}

        {/* Time Picker */}
        {Platform.OS === 'ios' ? (
          <Modal
            visible={showTimePicker}
            transparent
            animationType="slide"
          >
            <Pressable
              style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
              onPress={() => setShowTimePicker(false)}
            />
            <SafeAreaView edges={['bottom']} style={{ backgroundColor: c.surface }}>
            <View
              style={{
                backgroundColor: c.surface,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
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
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowTimePicker(false);
                  }}
                >
                  <Text style={{ fontSize: 17, color: c.textSecondary }}>{t('common_cancel')}</Text>
                </Pressable>
                <Text style={{ fontSize: 17, fontWeight: '600', color: c.text }}>
                  {t('common_time')}
                </Text>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowTimePicker(false);
                  }}
                >
                  <Text style={{ fontSize: 17, color: c.accent, fontWeight: '600' }}>{t('common_done')}</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={dateTime}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                style={{ height: 200, alignSelf: 'center' }}
              />
            </View>
            </SafeAreaView>
          </Modal>
        ) : (
          showTimePicker && (
            <DateTimePicker
              value={dateTime}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )
        )}
      </View>
    </Modal>
  );
}

