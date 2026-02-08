// Home Screen
import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  useColorScheme,
  RefreshControl,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Plus, Calendar, PawPrint, Crown, Stethoscope } from 'lucide-react-native';
import { useStore } from '@/lib/store';
import { CareItem } from '@/lib/types';
import { calendarService } from '@/lib/calendarService';
import {
  useColors,
  SectionHeader,
  EmptyState,
  IconButton,
} from '@/components/design-system';
import { PetCard } from '@/components/home/PetCard';
import { CareItemRow } from '@/components/home/CareItemRow';
import { ReminderRow } from '@/components/home/ReminderRow';
import { AddCareItemSheet } from '@/components/AddCareItemSheet';
import { AddReminderSheet } from '@/components/AddReminderSheet';
import { AddItemSelector } from '@/components/AddItemSelector';
import { AddPetWizard } from '@/components/AddPetWizard';
import { PetDetailScreen } from '@/components/PetDetailScreen';
import { PremiumUpsellModal, UpsellContext } from '@/components/PremiumUpsellModal';
import { useTranslation } from '@/lib/i18n';
import { usePremiumStore, FREE_PET_LIMIT_COUNT, FREE_CARE_LIMIT_COUNT, FREE_REMINDER_LIMIT_COUNT } from '@/lib/premium-store';
import { Reminder } from '@/lib/types';
import { useFocusEffect } from 'expo-router';

export function HomeScreen() {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const { t } = useTranslation();

  const petsUnsorted = useStore((s) => s.pets);
  const careItems = useStore((s) => s.careItems);
  const reminders = useStore((s) => s.reminders);
  const upcomingCareDays = useStore((s) => s.upcomingCareDays);
  const deleteCareItem = useStore((s) => s.deleteCareItem);
  const deleteReminder = useStore((s) => s.deleteReminder);

  // Sort pets alphabetically by name
  const pets = useMemo(() => {
    return [...petsUnsorted].sort((a, b) => a.name.localeCompare(b.name));
  }, [petsUnsorted]);
  const refreshData = useStore((s) => s.refreshData);

  // Premium state
  const isPremium = usePremiumStore((s) => s.isPremium);
  const canAddPet = usePremiumStore((s) => s.canAddPet);
  const canAddCareItem = usePremiumStore((s) => s.canAddCareItem);
  const canAddReminder = usePremiumStore((s) => s.canAddReminder);
  const initializePremium = usePremiumStore((s) => s.initialize);
  const isInitialized = usePremiumStore((s) => s.isInitialized);

  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showAddReminderSheet, setShowAddReminderSheet] = useState(false);
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [showAddPetWizard, setShowAddPetWizard] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);
  const [upsellContext, setUpsellContext] = useState<UpsellContext>('pets');
  const [editingItem, setEditingItem] = useState<CareItem | undefined>();
  const [editingReminder, setEditingReminder] = useState<Reminder | undefined>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // Scroll ref for scrolling to top
  const scrollViewRef = useRef<ScrollView>(null);

  // Reset all modals and scroll to top when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      // Close all modals
      setSelectedPetId(null);
      setShowAddSheet(false);
      setShowAddReminderSheet(false);
      setShowItemSelector(false);
      setShowAddPetWizard(false);
      setShowAddMenu(false);
      setShowUpsellModal(false);
      setEditingItem(undefined);
      setEditingReminder(undefined);

      // Scroll to top after a small delay to ensure layout is ready
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }, 100);
    }, [])
  );

  // Initialize premium store
  useEffect(() => {
    if (!isInitialized) {
      initializePremium();
    }
  }, [isInitialized, initializePremium]);

  // Get upcoming care items (using configured days window)
  const upcomingCareItems = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + upcomingCareDays);

    return careItems
      .filter((item) => {
        const dueDate = new Date(item.dueDate);
        const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
        return dueDateOnly >= today && dueDateOnly <= futureDate;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [careItems, upcomingCareDays]);

  // Get upcoming reminders (using configured days window)
  const upcomingReminders = useMemo(() => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + upcomingCareDays);

    return reminders
      .filter((reminder) => {
        if (!reminder.isEnabled) return false;
        const reminderDate = new Date(reminder.dateTime);
        return reminderDate >= now && reminderDate <= futureDate;
      })
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
  }, [reminders, upcomingCareDays]);

  // Unified list combining care items and reminders
  type UnifiedItem = 
    | { type: 'care'; item: CareItem }
    | { type: 'reminder'; item: Reminder };

  const unifiedItems = useMemo(() => {
    const items: UnifiedItem[] = [
      ...upcomingCareItems.map((item) => ({ type: 'care' as const, item })),
      ...upcomingReminders.map((item) => ({ type: 'reminder' as const, item })),
    ];

    return items.sort((a, b) => {
      const dateA = a.type === 'care' 
        ? new Date(a.item.dueDate).getTime()
        : new Date(a.item.dateTime).getTime();
      const dateB = b.type === 'care'
        ? new Date(b.item.dueDate).getTime()
        : new Date(b.item.dateTime).getTime();
      return dateA - dateB;
    });
  }, [upcomingCareItems, upcomingReminders]);

  // Get next care item for each pet
  const getNextCareItem = (petId: string) => {
    const petItems = careItems
      .filter((item) => item.petId === petId)
      .filter((item) => new Date(item.dueDate) >= new Date())
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    return petItems[0];
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  const handleAddPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowAddMenu(true);
  };

  const handleAddPressUnified = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowItemSelector(true);
  };

  const handleSelectCare = () => {
    // Check if user can add more care items
    if (!canAddCareItem(careItems.length)) {
      setUpsellContext('care');
      setShowUpsellModal(true);
      return;
    }
    setEditingItem(undefined);
    setShowAddSheet(true);
  };

  const handleSelectReminder = () => {
    // Check if user can add more reminders
    if (!canAddReminder(reminders.length)) {
      setUpsellContext('reminders');
      setShowUpsellModal(true);
      return;
    }
    setEditingReminder(undefined);
    setShowAddReminderSheet(true);
  };

  const handleAddCarePress = () => {
    setShowAddMenu(false);
    // Check if user can add more care items
    if (!canAddCareItem(careItems.length)) {
      setUpsellContext('care');
      setShowUpsellModal(true);
      return;
    }
    setEditingItem(undefined);
    setShowAddSheet(true);
  };

  const handleCareItemPress = (item: CareItem) => {
    setEditingItem(item);
    setShowAddSheet(true);
  };

  const handleDeleteCareItem = async (item: CareItem) => {
    try {
      // Delete from calendar if it was added
      if (item.calendarEventId) {
        await calendarService.deleteEvent(item.calendarEventId);
      }
      await deleteCareItem(item.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error deleting care item:', error);
    }
  };

  const handleDeleteReminder = async (reminder: Reminder) => {
    try {
      // Delete from calendar if it was added
      if (reminder.calendarEventId) {
        await calendarService.deleteEvent(reminder.calendarEventId);
      }
      await deleteReminder(reminder.id);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const handleReminderPress = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setShowAddReminderSheet(true);
  };

  const handleCloseSheet = () => {
    setShowAddSheet(false);
    setEditingItem(undefined);
  };

  const handleCloseReminderSheet = () => {
    setShowAddReminderSheet(false);
    setEditingReminder(undefined);
  };

  // Handle add pet button press - check premium limit
  const handleAddPetPress = () => {
    setShowAddMenu(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Check if user can add more pets
    if (canAddPet(pets.length)) {
      // User can add pet - show wizard
      setShowAddPetWizard(true);
    } else {
      // User has reached free limit - show upsell modal
      setUpsellContext('pets');
      setShowUpsellModal(true);
    }
  };

  const handleAddPetComplete = () => {
    setShowAddPetWizard(false);
    // Refresh data to show new pet
    refreshData();
  };

  // If a pet is selected, show detail screen
  if (selectedPetId) {
    return (
      <PetDetailScreen
        petId={selectedPetId}
        onBack={() => setSelectedPetId(null)}
      />
    );
  }

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
          entering={FadeInDown.duration(400)}
          style={{
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 16,
          }}
        >
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../../assets/Loki_log.png')}
                style={{
                  width: 34,
                  height: 34,
                  marginRight: 8,
                  borderRadius: 8,
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: 34,
                  fontWeight: '700',
                  color: c.text,
                  letterSpacing: -0.8,
                }}
              >
                Caramelo
              </Text>
            </View>
            <Text
              style={{
                fontSize: 15,
                color: c.textSecondary,
                marginTop: 2,
              }}
            >
              {t('home_pets_count', { count: pets.length })} • {t('home_upcoming_count', { count: upcomingCareItems.length })}
            </Text>
          </View>
        </Animated.View>

        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={c.accent}
            />
          }
        >
          {/* Pets Section */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(100)}
            style={{ marginTop: 8 }}
          >
            <View style={{ paddingHorizontal: 20 }}>
              <SectionHeader title={t('home_your_pets')} />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 20,
                gap: 12,
              }}
              style={{ flexGrow: 0 }}
            >
              {pets.map((pet, index) => (
                <Animated.View
                  key={pet.id}
                  entering={FadeIn.duration(300).delay(index * 50)}
                >
                  <PetCard
                    pet={pet}
                    nextCareItem={getNextCareItem(pet.id)}
                    onPress={() => setSelectedPetId(pet.id)}
                  />
                </Animated.View>
              ))}

              {/* Add Pet Card */}
              <Animated.View
                key="add-pet"
                entering={FadeIn.duration(300).delay(pets.length * 50)}
              >
                <Pressable
                  onPress={handleAddPetPress}
                  accessible={true}
                  accessibilityLabel="Adicionar novo pet"
                  accessibilityHint="Toque para adicionar um novo pet ao seu perfil"
                  style={{
                    width: 160,
                    height: 200,
                    borderRadius: 20,
                    overflow: 'hidden',
                  }}
                >
                  <BlurView
                    intensity={isDark ? 40 : 60}
                    tint={isDark ? 'dark' : 'light'}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.4)',
                      borderWidth: 1,
                      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                      borderRadius: 20,
                    }}
                  >
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: c.accentLight,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 12,
                      }}
                    >
                      <Plus size={24} color={c.accent} strokeWidth={2} />
                    </View>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '600',
                        color: c.text,
                        marginBottom: 4,
                      }}
                    >
                      {t('home_add_pet')}
                    </Text>
                    {!isPremium && pets.length >= FREE_PET_LIMIT_COUNT && (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4,
                          marginTop: 4,
                        }}
                      >
                        <Crown size={12} color={c.accent} strokeWidth={2} />
                        <Text
                          style={{
                            fontSize: 11,
                            color: c.accent,
                            fontWeight: '500',
                          }}
                        >
                          {t('home_premium_badge')}
                        </Text>
                      </View>
                    )}
                  </BlurView>
                </Pressable>
              </Animated.View>
            </ScrollView>
          </Animated.View>

          {/* Upcoming Care & Reminders Section */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(200)}
            style={{ marginTop: 32, paddingHorizontal: 20 }}
          >
            <SectionHeader
              title={t('home_upcoming_care')}
              action={
                unifiedItems.length > 0
                  ? { label: t('common_add'), onPress: handleAddPressUnified }
                  : undefined
              }
            />

            {unifiedItems.length > 0 ? (
              <View style={{ gap: 10 }}>
                {unifiedItems.map((unifiedItem, index) => {
                  const pet = pets.find((p) => 
                    p.id === (unifiedItem.type === 'care' 
                      ? unifiedItem.item.petId 
                      : unifiedItem.item.petId)
                  );
                  if (!pet) return null;

                  return (
                    <Animated.View
                      key={`${unifiedItem.type}-${unifiedItem.item.id}`}
                      entering={FadeIn.duration(200).delay(index * 30)}
                    >
                      {unifiedItem.type === 'care' ? (
                        <CareItemRow
                          item={unifiedItem.item}
                          pet={pet}
                          onPress={() => handleCareItemPress(unifiedItem.item)}
                          onDelete={() => handleDeleteCareItem(unifiedItem.item)}
                        />
                      ) : (
                        <ReminderRow
                          reminder={unifiedItem.item}
                          pet={pet}
                          onPress={() => handleReminderPress(unifiedItem.item)}
                          onDelete={() => handleDeleteReminder(unifiedItem.item)}
                        />
                      )}
                    </Animated.View>
                  );
                })}
              </View>
            ) : (
              <EmptyState
                icon={<Calendar size={32} color={c.accent} />}
                title={t('home_no_upcoming_items')}
                description={t('home_no_upcoming_items_desc')}
                action={{ label: t('common_add'), onPress: handleAddPressUnified }}
              />
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      {/* Add Item Selector */}
      <AddItemSelector
        visible={showItemSelector}
        onClose={() => setShowItemSelector(false)}
        onSelectCare={handleSelectCare}
        onSelectReminder={handleSelectReminder}
      />

      {/* Add/Edit Care Sheet */}
      <AddCareItemSheet
        visible={showAddSheet}
        onClose={handleCloseSheet}
        editItem={editingItem}
      />

      {/* Add/Edit Reminder Sheet */}
      <AddReminderSheet
        visible={showAddReminderSheet}
        onClose={handleCloseReminderSheet}
        editItem={editingReminder}
      />

      {/* Add Pet Wizard */}
      <AddPetWizard
        visible={showAddPetWizard}
        onClose={() => setShowAddPetWizard(false)}
        onComplete={handleAddPetComplete}
      />

      {/* Premium Upsell Modal */}
      <PremiumUpsellModal
        visible={showUpsellModal}
        onClose={() => setShowUpsellModal(false)}
        context={upsellContext}
      />

      {/* Add Menu Modal */}
      <Modal
        visible={showAddMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddMenu(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            justifyContent: 'flex-end',
          }}
          onPress={() => setShowAddMenu(false)}
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

            {/* Menu Options */}
            <View style={{ paddingHorizontal: 20, gap: 8 }}>
              {/* Add Pet Option */}
              <Pressable
                onPress={handleAddPetPress}
                accessible={true}
                accessibilityLabel="Adicionar pet"
                accessibilityHint="Adicionar um novo pet"
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
                  <PawPrint size={22} color={c.accent} strokeWidth={2} />
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
                    {t('home_add_pet')}
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: c.textSecondary,
                    }}
                  >
                    {t('home_add_pet_desc')}
                  </Text>
                </View>
                {!isPremium && pets.length >= FREE_PET_LIMIT_COUNT && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 4,
                      backgroundColor: 'rgba(180, 140, 80, 0.15)',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 8,
                    }}
                  >
                    <Crown size={12} color={c.accent} strokeWidth={2} />
                    <Text
                      style={{
                        fontSize: 11,
                        color: c.accent,
                        fontWeight: '600',
                      }}
                    >
                      {t('home_premium_badge')}
                    </Text>
                  </View>
                )}
              </Pressable>

              {/* Add Care Item Option */}
              <Pressable
                onPress={handleAddCarePress}
                accessible={true}
                accessibilityLabel="Adicionar cuidado"
                accessibilityHint="Adicionar vacina, consulta ou medicamento"
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
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
