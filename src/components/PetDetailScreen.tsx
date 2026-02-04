// Pet Detail Screen - View and edit pet details, set reminders
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  useColorScheme,
  TextInput as RNTextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  ChevronLeft,
  PawPrint,
  Calendar,
  Weight,
  Stethoscope,
  Phone,
  FileText,
  Bell,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  AlertCircle,
  Pill,
  Tag,
} from 'lucide-react-native';
import { useStore } from '@/lib/store';
import {
  Pet,
  CareItem,
  Reminder,
  formatDate,
  formatRelativeDate,
  formatAge,
  getRepeatLabel,
  getCareTypeLabel,
} from '@/lib/types';
import {
  useColors,
  GlassCard,
  PrimaryButton,
  SecondaryButton,
  SectionHeader,
} from '@/components/design-system';
import { useTranslation } from '@/lib/i18n';
import { AddCareItemSheet } from '@/components/AddCareItemSheet';

interface PetDetailScreenProps {
  petId: string;
  onBack: () => void;
}

export function PetDetailScreen({ petId, onBack }: PetDetailScreenProps) {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { t } = useTranslation();

  const pets = useStore((s) => s.pets);
  const careItems = useStore((s) => s.careItems);
  const reminders = useStore((s) => s.reminders);
  const updatePet = useStore((s) => s.updatePet);
  const deletePet = useStore((s) => s.deletePet);
  const addReminder = useStore((s) => s.addReminder);
  const deleteReminder = useStore((s) => s.deleteReminder);

  const pet = pets.find((p) => p.id === petId);
  const petCareItems = careItems.filter((c) => c.petId === petId);
  const petReminders = reminders.filter((r) => r.petId === petId);

  const [isEditing, setIsEditing] = useState(false);
  const [editedPet, setEditedPet] = useState<Partial<Pet>>({});
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    message: '',
    dateTime: new Date(),
    repeatType: 'none' as Reminder['repeatType'],
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showAddCareSheet, setShowAddCareSheet] = useState(false);
  const [editingCareItem, setEditingCareItem] = useState<CareItem | undefined>();

  const upcomingCareItems = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return petCareItems
      .filter((item) => {
        const itemDate = new Date(item.dueDate);
        const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate());
        return itemDateOnly.getTime() >= today.getTime();
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [petCareItems]);

  if (!pet) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: c.text }}>{t('pet_details_not_found')}</Text>
      </View>
    );
  }

  const handleSaveEdit = async () => {
    await updatePet(petId, editedPet);
    setIsEditing(false);
    setEditedPet({});
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedPet({});
  };

  const handleStartEdit = () => {
    setEditedPet({
      breed: pet.breed,
      microchipId: pet.microchipId,
      allergies: pet.allergies,
      vetName: pet.vetName,
      vetPhone: pet.vetPhone,
      notes: pet.notes,
      weightKg: pet.weightKg,
    });
    setIsEditing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDeletePet = () => {
    Alert.alert(
      t('pet_details_delete'),
      t('pet_details_delete_confirm', { name: pet.name }),
      [
        { text: t('common_cancel'), style: 'cancel' },
        {
          text: t('pet_details_delete'),
          style: 'destructive',
          onPress: async () => {
            await deletePet(petId);
            onBack();
          },
        },
      ]
    );
  };

  const handleAddReminder = async () => {
    if (!newReminder.title.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    await addReminder({
      petId,
      title: newReminder.title,
      message: newReminder.message || undefined,
      dateTime: newReminder.dateTime.toISOString(),
      repeatType: newReminder.repeatType,
      isEnabled: true,
    });

    setShowReminderModal(false);
    setNewReminder({
      title: '',
      message: '',
      dateTime: new Date(),
      repeatType: 'none',
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDeleteReminder = (reminderId: string) => {
    Alert.alert(t('common_delete_reminder'), t('common_delete_reminder_confirm'), [
      { text: t('common_cancel'), style: 'cancel' },
      {
        text: t('common_delete'),
        style: 'destructive',
        onPress: () => deleteReminder(reminderId),
      },
    ]);
  };

  const handleAddCarePress = () => {
    setEditingCareItem(undefined);
    setShowAddCareSheet(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCareItemPress = (item: CareItem) => {
    setEditingCareItem(item);
    setShowAddCareSheet(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleCloseCareSheet = () => {
    setShowAddCareSheet(false);
    setEditingCareItem(undefined);
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
        <Animated.View
          entering={FadeInDown.duration(300)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <Pressable
            onPress={onBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <ChevronLeft size={24} color={c.accent} />
            <Text style={{ color: c.accent, fontSize: 17 }}>{t('onboarding_back')}</Text>
          </Pressable>

          {isEditing ? (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Pressable onPress={handleCancelEdit}>
                <X size={24} color={c.textSecondary} />
              </Pressable>
              <Pressable onPress={handleSaveEdit}>
                <Check size={24} color={c.accent} />
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={handleStartEdit}>
              <Edit3 size={22} color={c.accent} />
            </Pressable>
          )}
        </Animated.View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Pet Header Card */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(50)}
            style={{ paddingHorizontal: 20, marginBottom: 24 }}
          >
            <View
              style={{
                borderRadius: 24,
                overflow: 'hidden',
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(255,255,255,0.9)',
                borderWidth: 1,
                borderColor: isDark
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(0,0,0,0.04)',
              }}
            >
              {/* Photo */}
              <View
                style={{
                  height: 360,
                  backgroundColor: c.accentLight,
                }}
              >
                {pet.photoUri ? (
                  <Image
                    source={{ uri: pet.photoUri }}
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
                    <PawPrint size={64} color={c.accent} strokeWidth={1.5} />
                  </View>
                )}

                {/* Glass Info Banner - Overlaid on Photo */}
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    overflow: 'hidden',
                  }}
                >
                  <BlurView
                    intensity={isDark ? 50 : 70}
                    tint={isDark ? 'dark' : 'light'}
                    style={{
                      paddingVertical: 20,
                      paddingHorizontal: 20,
                      backgroundColor: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.5)',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 28,
                        fontWeight: '700',
                        color: isDark ? '#FFFFFF' : '#1C1917',
                        marginBottom: 4,
                      }}
                    >
                      {pet.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(28,25,23,0.7)',
                        marginBottom: 16,
                      }}
                    >
                      {pet.species === 'dog'
                        ? t('pet_species_dog')
                        : pet.species === 'cat'
                        ? t('pet_species_cat')
                        : t('pet_species_other')}
                      {pet.breed ? ` • ${isEditing ? '' : pet.breed}` : ''}
                    </Text>

                    {/* Quick Stats */}
                    <View style={{ flexDirection: 'row', gap: 16 }}>
                      {pet.birthdate && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Calendar size={16} color={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(28,25,23,0.6)'} />
                          <Text style={{ fontSize: 14, color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(28,25,23,0.7)' }}>
                            {formatAge(pet.birthdate)}
                          </Text>
                        </View>
                      )}
                      {pet.weightKg && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Weight size={16} color={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(28,25,23,0.6)'} />
                          <Text style={{ fontSize: 14, color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(28,25,23,0.7)' }}>
                            {pet.weightKg} kg
                          </Text>
                        </View>
                      )}
                    </View>
                  </BlurView>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Advanced Info Section */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(100)}
            style={{ paddingHorizontal: 20, marginBottom: 24 }}
          >
            <SectionHeader title={t('pet_details_information')} />
            <View
              style={{
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(255,255,255,0.9)',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: isDark
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(0,0,0,0.04)',
                overflow: 'hidden',
              }}
            >
              {/* Breed */}
              <InfoRow
                icon={<Tag size={18} color={c.accent} />}
                label={t('pet_details_breed')}
                value={isEditing ? editedPet.breed : pet.breed}
                isEditing={isEditing}
                onChangeText={(text) =>
                  setEditedPet((prev) => ({ ...prev, breed: text }))
                }
                placeholder={t('pet_details_enter_breed')}
                colors={c}
                isDark={isDark}
              />

              {/* Weight */}
              <InfoRow
                icon={<Weight size={18} color={c.accent} />}
                label={t('pet_details_weight')}
                value={
                  isEditing
                    ? editedPet.weightKg?.toString()
                    : pet.weightKg?.toString()
                }
                isEditing={isEditing}
                onChangeText={(text) =>
                  setEditedPet((prev) => ({
                    ...prev,
                    weightKg: text ? parseFloat(text) : undefined,
                  }))
                }
                placeholder={t('pet_details_enter_weight')}
                keyboardType="numeric"
                colors={c}
                isDark={isDark}
              />

              {/* Microchip */}
              <InfoRow
                icon={<Tag size={18} color={c.accent} />}
                label={t('pet_details_microchip')}
                value={isEditing ? editedPet.microchipId : pet.microchipId}
                isEditing={isEditing}
                onChangeText={(text) =>
                  setEditedPet((prev) => ({ ...prev, microchipId: text }))
                }
                placeholder={t('pet_details_enter_microchip')}
                colors={c}
                isDark={isDark}
              />

              {/* Allergies */}
              <InfoRow
                icon={<AlertCircle size={18} color={c.accent} />}
                label={t('pet_details_allergies')}
                value={isEditing ? editedPet.allergies : pet.allergies}
                isEditing={isEditing}
                onChangeText={(text) =>
                  setEditedPet((prev) => ({ ...prev, allergies: text }))
                }
                placeholder={t('pet_details_enter_allergies')}
                colors={c}
                isDark={isDark}
              />

              {/* Vet Name */}
              <InfoRow
                icon={<Stethoscope size={18} color={c.accent} />}
                label={t('pet_details_veterinarian')}
                value={isEditing ? editedPet.vetName : pet.vetName}
                isEditing={isEditing}
                onChangeText={(text) =>
                  setEditedPet((prev) => ({ ...prev, vetName: text }))
                }
                placeholder={t('pet_details_enter_vet_name')}
                colors={c}
                isDark={isDark}
              />

              {/* Vet Phone */}
              <InfoRow
                icon={<Phone size={18} color={c.accent} />}
                label={t('pet_details_vet_phone')}
                value={isEditing ? editedPet.vetPhone : pet.vetPhone}
                isEditing={isEditing}
                onChangeText={(text) =>
                  setEditedPet((prev) => ({ ...prev, vetPhone: text }))
                }
                placeholder={t('pet_details_enter_phone')}
                keyboardType="phone-pad"
                colors={c}
                isDark={isDark}
              />

              {/* Notes */}
              <InfoRow
                icon={<FileText size={18} color={c.accent} />}
                label={t('pet_details_notes')}
                value={isEditing ? editedPet.notes : pet.notes}
                isEditing={isEditing}
                onChangeText={(text) =>
                  setEditedPet((prev) => ({ ...prev, notes: text }))
                }
                placeholder={t('pet_details_add_notes')}
                multiline
                colors={c}
                isDark={isDark}
                isLast
              />
            </View>
          </Animated.View>

          {/* Reminders Section */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(150)}
            style={{ paddingHorizontal: 20, marginBottom: 24 }}
          >
            <SectionHeader
              title={t('pet_details_reminders')}
              action={
                petReminders.length > 0
                  ? { label: t('common_add'), onPress: () => setShowReminderModal(true) }
                  : undefined
              }
            />

            {petReminders.length > 0 ? (
              <View style={{ gap: 10 }}>
                {petReminders.map((reminder) => (
                  <ReminderRow
                    key={reminder.id}
                    reminder={reminder}
                    onDelete={() => handleDeleteReminder(reminder.id)}
                    colors={c}
                    isDark={isDark}
                    t={t}
                  />
                ))}
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(255,255,255,0.9)',
                  borderRadius: 16,
                  padding: 24,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.04)',
                }}
              >
                <Bell size={32} color={c.textTertiary} />
                <Text
                  style={{
                    color: c.textSecondary,
                    fontSize: 15,
                    marginTop: 12,
                    textAlign: 'center',
                  }}
                >
                  {t('pet_details_no_reminders')}
                </Text>
                <Pressable
                  onPress={() => setShowReminderModal(true)}
                  style={{ marginTop: 16 }}
                >
                  <Text style={{ color: c.accent, fontSize: 15, fontWeight: '500' }}>
                    {t('pet_details_add_reminder')}
                  </Text>
                </Pressable>
              </View>
            )}
          </Animated.View>

          {/* Upcoming Care Section */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(200)}
            style={{ paddingHorizontal: 20, marginBottom: 24 }}
          >
            <SectionHeader
              title={t('pet_details_upcoming_care')}
              action={
                upcomingCareItems.length > 0
                  ? { label: t('common_add'), onPress: handleAddCarePress }
                  : undefined
              }
            />

            {upcomingCareItems.length > 0 ? (
              <View style={{ gap: 10 }}>
                {upcomingCareItems.map((item) => (
                  <Pressable
                    key={item.id}
                    onPress={() => handleCareItemPress(item)}
                    style={{
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(255,255,255,0.9)',
                      borderRadius: 12,
                      padding: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      borderWidth: 1,
                      borderColor: isDark
                        ? 'rgba(255,255,255,0.08)'
                        : 'rgba(0,0,0,0.04)',
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
                      <Calendar size={20} color={c.accent} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '500',
                          color: c.text,
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: c.textSecondary,
                          marginTop: 2,
                        }}
                      >
                        {getCareTypeLabel(item.type)} • {formatRelativeDate(item.dueDate, t)}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(255,255,255,0.9)',
                  borderRadius: 16,
                  padding: 24,
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.04)',
                }}
              >
                <Calendar size={32} color={c.textTertiary} />
                <Text
                  style={{
                    color: c.textSecondary,
                    fontSize: 15,
                    marginTop: 12,
                    textAlign: 'center',
                  }}
                >
                  {t('pet_details_no_upcoming')}
                </Text>
                <Pressable
                  onPress={handleAddCarePress}
                  style={{ marginTop: 16 }}
                >
                  <Text style={{ color: c.accent, fontSize: 15, fontWeight: '500' }}>
                    {t('home_add_care_item')}
                  </Text>
                </Pressable>
              </View>
            )}
          </Animated.View>

          {/* Delete Pet Button */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(250)}
            style={{ paddingHorizontal: 20, marginTop: 20 }}
          >
            <Pressable
              onPress={handleDeletePet}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                paddingVertical: 14,
              }}
            >
              <Trash2 size={18} color={c.destructive} />
              <Text
                style={{
                  color: c.destructive,
                  fontSize: 16,
                  fontWeight: '500',
                }}
              >
                {t('pet_details_delete')}
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      {/* Add Reminder Modal */}
      <Modal
        visible={showReminderModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowReminderModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: isDark ? '#0C0A09' : '#F5F2EE',
          }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            {/* Modal Header */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: c.border,
              }}
            >
              <Pressable onPress={() => setShowReminderModal(false)}>
                <Text style={{ color: c.textSecondary, fontSize: 17 }}>{t('common_cancel')}</Text>
              </Pressable>
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: '600',
                  color: c.text,
                }}
              >
                {t('common_new_reminder')}
              </Text>
              <Pressable onPress={handleAddReminder}>
                <Text
                  style={{
                    color: newReminder.title.trim() ? c.accent : c.textTertiary,
                    fontSize: 17,
                    fontWeight: '600',
                  }}
                >
                  {t('common_add')}
                </Text>
              </Pressable>
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 20 }}
            >
              {/* Title */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: c.textSecondary,
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {t('common_title')}
                </Text>
                <RNTextInput
                  value={newReminder.title}
                  onChangeText={(text) =>
                    setNewReminder((prev) => ({ ...prev, title: text }))
                  }
                  placeholder={t('care_reminder_title_placeholder')}
                  placeholderTextColor={c.textTertiary}
                  style={{
                    backgroundColor: isDark
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(255,255,255,0.9)',
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 17,
                    color: c.text,
                    borderWidth: 1,
                    borderColor: c.border,
                  }}
                />
              </View>

              {/* Message */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: c.textSecondary,
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {t('common_message_optional')}
                </Text>
                <RNTextInput
                  value={newReminder.message}
                  onChangeText={(text) =>
                    setNewReminder((prev) => ({ ...prev, message: text }))
                  }
                  placeholder={t('care_message_placeholder')}
                  placeholderTextColor={c.textTertiary}
                  multiline
                  numberOfLines={3}
                  style={{
                    backgroundColor: isDark
                      ? 'rgba(255,255,255,0.05)'
                      : 'rgba(255,255,255,0.9)',
                    borderRadius: 12,
                    padding: 16,
                    fontSize: 17,
                    color: c.text,
                    borderWidth: 1,
                    borderColor: c.border,
                    minHeight: 80,
                    textAlignVertical: 'top',
                  }}
                />
              </View>

              {/* Date & Time */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: c.textSecondary,
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {t('common_date_time')}
                </Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Pressable
                    onPress={() => setShowDatePicker(true)}
                    style={{
                      flex: 1,
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(255,255,255,0.9)',
                      borderRadius: 12,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: c.border,
                    }}
                  >
                    <Text style={{ color: c.text, fontSize: 16 }}>
                      {newReminder.dateTime.toLocaleDateString()}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setShowTimePicker(true)}
                    style={{
                      flex: 1,
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.05)'
                        : 'rgba(255,255,255,0.9)',
                      borderRadius: 12,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: c.border,
                    }}
                  >
                    <Text style={{ color: c.text, fontSize: 16 }}>
                      {newReminder.dateTime.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* Repeat */}
              <View style={{ marginBottom: 20 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '500',
                    color: c.textSecondary,
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  {t('common_repeat')}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {(['none', 'daily', 'weekly', 'monthly'] as const).map((type) => (
                    <Pressable
                      key={type}
                      onPress={() => {
                        setNewReminder((prev) => ({ ...prev, repeatType: type }));
                        Haptics.selectionAsync();
                      }}
                      style={{
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 20,
                        backgroundColor:
                          newReminder.repeatType === type
                            ? c.accent
                            : isDark
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(0,0,0,0.05)',
                        borderWidth: 1,
                        borderColor:
                          newReminder.repeatType === type
                            ? c.accent
                            : c.border,
                      }}
                    >
                      <Text
                        style={{
                          color:
                            newReminder.repeatType === type
                              ? '#FFFFFF'
                              : c.text,
                          fontSize: 14,
                          fontWeight: '500',
                        }}
                      >
                        {type === 'none'
                          ? t('common_once')
                          : type.charAt(0).toUpperCase() + type.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </ScrollView>

            {/* Date Picker */}
            {showDatePicker && (
              <DateTimePicker
                value={newReminder.dateTime}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) {
                    setNewReminder((prev) => {
                      const newDate = new Date(prev.dateTime);
                      newDate.setFullYear(date.getFullYear());
                      newDate.setMonth(date.getMonth());
                      newDate.setDate(date.getDate());
                      return { ...prev, dateTime: newDate };
                    });
                  }
                }}
                minimumDate={new Date()}
                style={{ alignSelf: 'center' }}
              />
            )}

            {/* Time Picker */}
            {showTimePicker && (
              <DateTimePicker
                value={newReminder.dateTime}
                mode="time"
                display="spinner"
                onChange={(event, date) => {
                  setShowTimePicker(false);
                  if (date) {
                    setNewReminder((prev) => {
                      const newDate = new Date(prev.dateTime);
                      newDate.setHours(date.getHours());
                      newDate.setMinutes(date.getMinutes());
                      return { ...prev, dateTime: newDate };
                    });
                  }
                }}
                style={{ alignSelf: 'center' }}
              />
            )}
          </SafeAreaView>
        </View>
      </Modal>

      {/* Add/Edit Care Item Sheet */}
      <AddCareItemSheet
        visible={showAddCareSheet}
        onClose={handleCloseCareSheet}
        editItem={editingCareItem}
        preselectedPetId={petId}
      />
    </View>
  );
}

// Helper Components
interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  isEditing: boolean;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  colors: ReturnType<typeof useColors>;
  isDark: boolean;
  isLast?: boolean;
}

function InfoRow({
  icon,
  label,
  value,
  isEditing,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  colors: c,
  isDark,
  isLast = false,
}: InfoRowProps) {
  const { t } = useTranslation();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 14,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: c.border,
        gap: 12,
      }}
    >
      <View style={{ marginTop: 2 }}>{icon}</View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: '500',
            color: c.textTertiary,
            marginBottom: 4,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          {label}
        </Text>
        {isEditing ? (
          <RNTextInput
            value={value || ''}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={c.textTertiary}
            keyboardType={keyboardType}
            multiline={multiline}
            style={{
              fontSize: 16,
              color: c.text,
              padding: 0,
              minHeight: multiline ? 60 : undefined,
            }}
          />
        ) : (
          <Text
            style={{
              fontSize: 16,
              color: value ? c.text : c.textTertiary,
            }}
          >
            {value || t('settings_not_set')}
          </Text>
        )}
      </View>
    </View>
  );
}

interface ReminderRowProps {
  reminder: Reminder;
  onDelete: () => void;
  colors: ReturnType<typeof useColors>;
  isDark: boolean;
  t: (key: any) => string;
}

function ReminderRow({
  reminder,
  onDelete,
  colors: c,
  isDark,
  t,
}: ReminderRowProps) {
  const reminderDate = new Date(reminder.dateTime);

  return (
    <View
      style={{
        backgroundColor: isDark
          ? 'rgba(255,255,255,0.05)'
          : 'rgba(255,255,255,0.9)',
        borderRadius: 12,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
        opacity: reminder.isEnabled ? 1 : 0.6,
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
        <Bell size={20} color={c.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: c.text,
          }}
        >
          {reminder.title}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: c.textSecondary,
            marginTop: 2,
          }}
        >
          {reminderDate.toLocaleDateString()} at{' '}
          {reminderDate.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
          {reminder.repeatType !== 'none' && ` • ${getRepeatLabel(reminder.repeatType, t)}`}
        </Text>
      </View>
      <Pressable
        onPress={onDelete}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Trash2 size={18} color={c.textTertiary} />
      </Pressable>
    </View>
  );
}
