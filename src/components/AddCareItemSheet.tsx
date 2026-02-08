// Add/Edit Care Item Sheet
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
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import {
  Syringe,
  Scissors,
  Pill,
  Stethoscope,
  Calendar,
  Trash2,
  CalendarPlus,
} from 'lucide-react-native';
import { CareItem, CareType, formatDate } from '@/lib/types';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import { useColors } from '@/components/design-system';
import { PetChip } from '@/components/PetChip';
import { calendarService } from '@/lib/calendarService';

interface AddCareItemSheetProps {
  visible: boolean;
  onClose: () => void;
  editItem?: CareItem;
  preselectedPetId?: string;
}

export function AddCareItemSheet({
  visible,
  onClose,
  editItem,
  preselectedPetId,
}: AddCareItemSheetProps) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { t } = useTranslation();

  const careTypeConfig: {
    type: CareType;
    label: string;
    icon: React.ComponentType<{ size: number; color: string }>;
    defaultTitle: string;
  }[] = [
    { type: 'vaccine', label: t('care_vaccine'), icon: Syringe, defaultTitle: t('care_vaccine') },
    { type: 'grooming', label: t('care_grooming'), icon: Scissors, defaultTitle: t('care_grooming') },
    { type: 'medication', label: t('care_medication'), icon: Pill, defaultTitle: t('care_medication') },
    { type: 'vet_visit', label: t('care_vet_visit'), icon: Stethoscope, defaultTitle: t('care_vet_visit') },
  ];

  const pets = useStore((s) => s.pets);
  const addCareItem = useStore((s) => s.addCareItem);
  const updateCareItem = useStore((s) => s.updateCareItem);
  const deleteCareItem = useStore((s) => s.deleteCareItem);

  const [selectedPetIds, setSelectedPetIds] = useState<string[]>(
    editItem ? [editItem.petId] : preselectedPetId ? [preselectedPetId] : pets.length > 0 ? [pets[0].id] : []
  );
  const [selectedType, setSelectedType] = useState<CareType>(editItem?.type || 'vaccine');
  const [title, setTitle] = useState(editItem?.title || '');
  const [dueDate, setDueDate] = useState<Date>(
    editItem ? new Date(editItem.dueDate) : new Date()
  );
  const [notes, setNotes] = useState(editItem?.notes || '');
  const [repeatType, setRepeatType] = useState<'none' | 'daily' | 'weekly' | 'monthly'>(
    editItem?.repeatType || 'none'
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [addToCalendar, setAddToCalendar] = useState(false);

  // Reset form when opening
  useEffect(() => {
    if (visible) {
      // Dismiss keyboard when modal opens
      Keyboard.dismiss();

      if (editItem) {
        // Edit mode: only one pet
        setSelectedPetIds([editItem.petId]);
        setSelectedType(editItem.type);
        setTitle(editItem.title);
        setDueDate(new Date(editItem.dueDate));
        setNotes(editItem.notes || '');
        setRepeatType(editItem.repeatType || 'none');
        setAddToCalendar(false);
      } else {
        // Create mode: start with one pet if preselected, otherwise empty
        setSelectedPetIds(preselectedPetId ? [preselectedPetId] : []);
        setSelectedType('vaccine');
        setTitle('');
        setDueDate(new Date());
        setNotes('');
        setRepeatType('none');
        setAddToCalendar(false);
      }
    }
  }, [visible, editItem, preselectedPetId, pets]);

  // Auto-fill title when type changes (only for new items)
  useEffect(() => {
    if (!editItem && !title) {
      const config = careTypeConfig.find((c) => c.type === selectedType);
      if (config) {
        setTitle(config.defaultTitle);
      }
    }
  }, [selectedType, editItem]);

  const handleSave = async () => {
    if (!title.trim() || selectedPetIds.length === 0) return;

    setIsSaving(true);
    try {
      if (editItem) {
        // Edit mode: update single item
        let calendarEventId = editItem.calendarEventId;

        // Add to calendar if requested
        if (addToCalendar) {
          const pet = pets.find((p) => p.id === selectedPetIds[0]);
          const result = await calendarService.addCareItemToCalendar(
            title.trim(),
            dueDate.toISOString(),
            notes.trim() || undefined,
            pet?.name,
            repeatType
          );
          if (result.success && result.eventId) {
            calendarEventId = result.eventId;
          }
        }

        await updateCareItem(editItem.id, {
          petId: selectedPetIds[0],
          type: selectedType,
          title: title.trim(),
          dueDate: dueDate.toISOString(),
          notes: notes.trim() || undefined,
          repeatType,
          calendarEventId,
        });
      } else {
        // Create mode: create one item for each selected pet
        const promises = selectedPetIds.map(async (petId) => {
          let calendarEventId: string | undefined;

          // Add to calendar if requested
          if (addToCalendar) {
            const pet = pets.find((p) => p.id === petId);
            const result = await calendarService.addCareItemToCalendar(
              title.trim(),
              dueDate.toISOString(),
              notes.trim() || undefined,
              pet?.name,
              repeatType
            );
            if (result.success && result.eventId) {
              calendarEventId = result.eventId;
            }
          }

          await addCareItem({
            petId,
            type: selectedType,
            title: title.trim(),
            dueDate: dueDate.toISOString(),
            notes: notes.trim() || undefined,
            repeatType,
            calendarEventId,
          });
        });
        await Promise.all(promises);
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onClose();
    } catch (error) {
      console.error('Error saving care item:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!editItem) return;

    Alert.alert(
      t('care_delete_item'),
      t('care_delete_confirm', { title: editItem.title }),
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
              await deleteCareItem(editItem.id);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              onClose();
            } catch (error) {
              console.error('Error deleting care item:', error);
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
      // Preserve the time when updating date
      const newDate = new Date(dueDate);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setDueDate(newDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      Haptics.selectionAsync();
      // Preserve the date when updating time
      const newDate = new Date(dueDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDueDate(newDate);
    }
  };

  const isValid = title.trim() && selectedPetIds.length > 0;

  const typeOptions = careTypeConfig.map((c) => ({
    value: c.type,
    label: c.label,
  }));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: c.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
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
                  {editItem ? t('care_edit_item') : t('care_add_item')}
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
                    {isSaving ? t('common_saving') : t('settings_save')}
                  </Text>
                </Pressable>
              </View>

              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
            {/* Pet Selector - Only show if coming from Home (no preselectedPetId) */}
            {!preselectedPetId && (
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: c.textTertiary,
                  marginBottom: 10,
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
            )}

            {/* Care Type */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: c.textTertiary,
                  marginBottom: 10,
                }}
              >
                {t('care_type_label')}
              </Text>
              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  setShowTypeSelector(true);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  borderRadius: 12,
                  minHeight: 52,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                  {(() => {
                    const config = careTypeConfig.find((c) => c.type === selectedType);
                    const Icon = config?.icon || Syringe;
                    return (
                      <>
                        <Icon size={20} color={c.accent} />
                        <Text style={{ fontSize: 17, color: c.text, flex: 1 }}>
                          {config?.label || selectedType}
                        </Text>
                      </>
                    );
                  })()}
                </View>
                <View style={{ transform: [{ rotate: '90deg' }] }}>
                  <Text style={{ fontSize: 18, color: c.textSecondary }}>›</Text>
                </View>
              </Pressable>
            </View>

            {/* Title */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: c.textTertiary,
                  marginBottom: 10,
                }}
              >
                {t('care_title_label')}
              </Text>
              <RNTextInput
                value={title}
                onChangeText={setTitle}
                placeholder={t('care_title_placeholder')}
                placeholderTextColor={c.textTertiary}
                autoFocus={false}
                style={{
                  fontSize: 17,
                  color: c.text,
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  borderRadius: 12,
                  minHeight: 52,
                }}
              />
            </View>

            {/* Date and Time */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: c.textTertiary,
                  marginBottom: 10,
                }}
              >
                {t('common_date_time')}
              </Text>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {/* Date Picker */}
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowDatePicker(true);
                  }}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    borderRadius: 12,
                    minHeight: 52,
                    gap: 12,
                  }}
                >
                  <Calendar size={20} color={c.accent} />
                  <Text style={{ fontSize: 17, color: c.text }}>
                    {formatDate(dueDate.toISOString())}
                  </Text>
                </Pressable>

                {/* Time Picker */}
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setShowTimePicker(true);
                  }}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                    borderRadius: 12,
                    minHeight: 52,
                  }}
                >
                  <Text style={{ fontSize: 17, color: c.text }}>
                    {dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Repeat */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: c.textTertiary,
                  marginBottom: 10,
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

            {/* Notes */}
            <View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: c.textTertiary,
                  marginBottom: 10,
                }}
              >
                {t('care_notes_label')}
              </Text>
              <RNTextInput
                value={notes}
                onChangeText={setNotes}
                placeholder={t('care_notes_placeholder')}
                placeholderTextColor={c.textTertiary}
                multiline
                numberOfLines={3}
                autoFocus={false}
                style={{
                  fontSize: 17,
                  color: c.text,
                  paddingVertical: 16,
                  paddingHorizontal: 16,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  borderRadius: 12,
                  minHeight: 100,
                  textAlignVertical: 'top',
                }}
              />
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
                      {t('calendar_add_to_calendar')}
                    </Text>
                    <Text style={{ fontSize: 13, color: c.textSecondary, marginTop: 2 }}>
                      {t('calendar_sync_description')}
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
                  {t('care_delete_item')}
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
                  {t('common_due_date')}
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
                value={dueDate}
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
              value={dueDate}
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
            animationType="slide"
            transparent
            onRequestClose={() => setShowTimePicker(false)}
          >
            <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <SafeAreaView edges={['bottom']} style={{ backgroundColor: c.surface }}>
              <View style={{ backgroundColor: c.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: c.border }}>
                  <Pressable
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setShowTimePicker(false);
                    }}
                  >
                    <Text style={{ fontSize: 17, color: c.textSecondary }}>{t('common_cancel')}</Text>
                  </Pressable>
                  <Text style={{ fontSize: 17, fontWeight: '600', color: c.text }}>
                    Hora
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
                  value={dueDate}
                  mode="time"
                  display="spinner"
                  onChange={handleTimeChange}
                  style={{ height: 200, alignSelf: 'center' }}
                />
              </View>
              </SafeAreaView>
            </View>
          </Modal>
        ) : (
          showTimePicker && (
            <DateTimePicker
              value={dueDate}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )
        )}

        {/* Type Selector Modal */}
        <Modal
          visible={showTypeSelector}
          animationType="slide"
          transparent
          onRequestClose={() => setShowTypeSelector(false)}
        >
          <Pressable
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}
            onPress={() => setShowTypeSelector(false)}
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
              <View style={{ width: 60 }} />
              <Text style={{ fontSize: 17, fontWeight: '600', color: c.text }}>
                {t('care_type_label')}
              </Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowTypeSelector(false);
                }}
              >
                <Text style={{ fontSize: 17, color: c.accent, fontWeight: '600' }}>
                  {t('common_done')}
                </Text>
              </Pressable>
            </View>
            <ScrollView style={{ maxHeight: 400 }}>
              {careTypeConfig.map((config) => {
                const Icon = config.icon;
                const isSelected = selectedType === config.type;
                return (
                  <Pressable
                    key={config.type}
                    onPress={() => {
                      setSelectedType(config.type);
                      Haptics.selectionAsync();
                      setTimeout(() => setShowTypeSelector(false), 150);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 16,
                      paddingHorizontal: 20,
                      gap: 12,
                      backgroundColor: isSelected
                        ? isDark
                          ? 'rgba(255,255,255,0.08)'
                          : 'rgba(0,0,0,0.05)'
                        : 'transparent',
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: isSelected ? c.accent : c.accentLight,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={20} color={isSelected ? '#FFFFFF' : c.accent} />
                    </View>
                    <Text
                      style={{
                        fontSize: 17,
                        color: c.text,
                        flex: 1,
                        fontWeight: isSelected ? '600' : '400',
                      }}
                    >
                      {config.label}
                    </Text>
                    {isSelected && (
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: c.accent,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>✓</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
          </SafeAreaView>
        </Modal>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}
