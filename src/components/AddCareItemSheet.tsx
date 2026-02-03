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
} from 'lucide-react-native';
import { CareItem, CareType, Pet, formatDate, getCareTypeLabel } from '@/lib/types';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import { useColors, PrimaryButton, SegmentedControl } from '@/components/design-system';
import { PetChip } from '@/components/PetChip';

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
      } else {
        // Create mode: start with one pet if preselected, otherwise empty
        setSelectedPetIds(preselectedPetId ? [preselectedPetId] : []);
        setSelectedType('vaccine');
        setTitle('');
        setDueDate(new Date());
        setNotes('');
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
        await updateCareItem(editItem.id, {
          petId: selectedPetIds[0],
          type: selectedType,
          title: title.trim(),
          dueDate: dueDate.toISOString(),
          notes: notes.trim() || undefined,
        });
      } else {
        // Create mode: create one item for each selected pet
        const promises = selectedPetIds.map((petId) =>
          addCareItem({
            petId,
            type: selectedType,
            title: title.trim(),
            dueDate: dueDate.toISOString(),
            notes: notes.trim() || undefined,
          })
        );
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
      setDueDate(selectedDate);
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
                contentContainerStyle={{ padding: 20, gap: 24, paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
            {/* Pet Selector - Only show if no preselected pet or in edit mode */}
            {(!preselectedPetId || editItem) && (
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
            )}

            {/* Care Type */}
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
                {t('care_type_label')}
              </Text>
              <Pressable
                onPress={() => {
                  Keyboard.dismiss();
                  // Cycle through care types
                  const currentIndex = careTypeConfig.findIndex((c) => c.type === selectedType);
                  const nextIndex = (currentIndex + 1) % careTypeConfig.length;
                  setSelectedType(careTypeConfig[nextIndex].type);
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
                  {(() => {
                    const config = careTypeConfig.find((c) => c.type === selectedType);
                    const Icon = config?.icon || Syringe;
                    return (
                      <>
                        <View
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            backgroundColor: c.accentLight,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Icon size={18} color={c.accent} />
                        </View>
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
                value={title}
                onChangeText={setTitle}
                placeholder={t('care_title_placeholder')}
                placeholderTextColor={c.textTertiary}
                autoFocus={false}
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
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowDatePicker(true);
                }}
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
                  {formatDate(dueDate.toISOString())}
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
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  borderRadius: 12,
                  minHeight: 100,
                  textAlignVertical: 'top',
                }}
              />
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
            <View
              style={{
                backgroundColor: c.surface,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingBottom: 34,
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
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}
