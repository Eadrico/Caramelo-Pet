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
  ChevronDown,
  Trash2,
} from 'lucide-react-native';
import { CareItem, CareType, Pet, formatDate, getCareTypeLabel } from '@/lib/types';
import { useStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import { useColors, PrimaryButton, SegmentedControl } from '@/components/design-system';

interface AddCareItemSheetProps {
  visible: boolean;
  onClose: () => void;
  editItem?: CareItem;
  preselectedPetId?: string;
}

const careTypeConfig: {
  type: CareType;
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
  defaultTitle: string;
}[] = [
  { type: 'vaccine', label: 'Vaccine', icon: Syringe, defaultTitle: 'Vaccination' },
  { type: 'grooming', label: 'Grooming', icon: Scissors, defaultTitle: 'Grooming appointment' },
  { type: 'medication', label: 'Medication', icon: Pill, defaultTitle: 'Medication refill' },
  { type: 'vet_visit', label: 'Vet Visit', icon: Stethoscope, defaultTitle: 'Vet checkup' },
];

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

  const pets = useStore((s) => s.pets);
  const addCareItem = useStore((s) => s.addCareItem);
  const updateCareItem = useStore((s) => s.updateCareItem);
  const deleteCareItem = useStore((s) => s.deleteCareItem);

  const [selectedPetId, setSelectedPetId] = useState<string>(
    editItem?.petId || preselectedPetId || pets[0]?.id || ''
  );
  const [selectedType, setSelectedType] = useState<CareType>(editItem?.type || 'vaccine');
  const [title, setTitle] = useState(editItem?.title || '');
  const [dueDate, setDueDate] = useState<Date>(
    editItem ? new Date(editItem.dueDate) : new Date()
  );
  const [notes, setNotes] = useState(editItem?.notes || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPetPicker, setShowPetPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when opening
  useEffect(() => {
    if (visible) {
      if (editItem) {
        setSelectedPetId(editItem.petId);
        setSelectedType(editItem.type);
        setTitle(editItem.title);
        setDueDate(new Date(editItem.dueDate));
        setNotes(editItem.notes || '');
      } else {
        setSelectedPetId(preselectedPetId || pets[0]?.id || '');
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
    if (!title.trim() || !selectedPetId) return;

    setIsSaving(true);
    try {
      if (editItem) {
        await updateCareItem(editItem.id, {
          petId: selectedPetId,
          type: selectedType,
          title: title.trim(),
          dueDate: dueDate.toISOString(),
          notes: notes.trim() || undefined,
        });
      } else {
        await addCareItem({
          petId: selectedPetId,
          type: selectedType,
          title: title.trim(),
          dueDate: dueDate.toISOString(),
          notes: notes.trim() || undefined,
        });
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

  const selectedPet = pets.find((p) => p.id === selectedPetId);
  const isValid = title.trim() && selectedPetId;

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
            <Pressable onPress={onClose}>
              <Text style={{ fontSize: 17, color: c.textSecondary }}>{t('common_cancel')}</Text>
            </Pressable>
            <Text style={{ fontSize: 17, fontWeight: '600', color: c.text }}>
              {editItem ? t('care_edit_item') : t('care_add_item')}
            </Text>
            <Pressable onPress={handleSave} disabled={!isValid || isSaving}>
              <Text
                style={{
                  fontSize: 17,
                  color: isValid && !isSaving ? c.accent : c.textTertiary,
                  fontWeight: '600',
                }}
              >
                {isSaving ? 'Saving...' : t('settings_save')}
              </Text>
            </Pressable>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, gap: 24 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Pet Selector */}
            {pets.length > 1 && (
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
                  {t('care_pet_label')}
                </Text>
                <Pressable
                  onPress={() => setShowPetPicker(true)}
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
                  <Text style={{ fontSize: 17, color: c.text }}>
                    {selectedPet?.name || t('care_select_pet')}
                  </Text>
                  <ChevronDown size={20} color={c.textSecondary} />
                </Pressable>
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
              <SegmentedControl
                options={typeOptions}
                selected={selectedType}
                onSelect={setSelectedType}
              />
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
                onPress={handleDelete}
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

        {/* Pet Picker Modal */}
        <Modal
          visible={showPetPicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPetPicker(false)}
        >
          <Pressable
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 }}
            onPress={() => setShowPetPicker(false)}
          >
            <View
              style={{
                backgroundColor: c.surface,
                borderRadius: 16,
                overflow: 'hidden',
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '600',
                  color: c.text,
                  padding: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: c.border,
                }}
              >
                Select Pet
              </Text>
              {pets.map((pet) => (
                <Pressable
                  key={pet.id}
                  onPress={() => {
                    setSelectedPetId(pet.id);
                    setShowPetPicker(false);
                    Haptics.selectionAsync();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: c.border,
                    backgroundColor:
                      pet.id === selectedPetId ? c.accentLight : 'transparent',
                  }}
                >
                  <Text style={{ fontSize: 17, color: c.text }}>
                    {pet.name}
                  </Text>
                  {pet.id === selectedPetId && (
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
                      <Text style={{ color: '#fff', fontWeight: '600' }}>✓</Text>
                    </View>
                  )}
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>

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
                <Pressable onPress={() => setShowDatePicker(false)}>
                  <Text style={{ fontSize: 17, color: c.textSecondary }}>Cancel</Text>
                </Pressable>
                <Text style={{ fontSize: 17, fontWeight: '600', color: c.text }}>
                  Due Date
                </Text>
                <Pressable onPress={() => setShowDatePicker(false)}>
                  <Text style={{ fontSize: 17, color: c.accent, fontWeight: '600' }}>Done</Text>
                </Pressable>
              </View>
              <DateTimePicker
                value={dueDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                style={{ height: 200 }}
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
    </Modal>
  );
}
