// Home Screen
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Plus, Calendar, PawPrint } from 'lucide-react-native';
import { useStore } from '@/lib/store';
import { CareItem } from '@/lib/types';
import {
  useColors,
  SectionHeader,
  EmptyState,
  IconButton,
} from '@/components/design-system';
import { PetCard } from '@/components/home/PetCard';
import { CareItemRow } from '@/components/home/CareItemRow';
import { AddCareItemSheet } from '@/components/AddCareItemSheet';
import { PetDetailScreen } from '@/components/PetDetailScreen';

export function HomeScreen() {
  const c = useColors();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const pets = useStore((s) => s.pets);
  const careItems = useStore((s) => s.careItems);
  const refreshData = useStore((s) => s.refreshData);

  const [showAddSheet, setShowAddSheet] = useState(false);
  const [editingItem, setEditingItem] = useState<CareItem | undefined>();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  // Get upcoming care items (next 14 days)
  const upcomingCareItems = useMemo(() => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + 14);

    return careItems
      .filter((item) => {
        const dueDate = new Date(item.dueDate);
        return dueDate >= new Date(now.setHours(0, 0, 0, 0)) && dueDate <= futureDate;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [careItems]);

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
    setEditingItem(undefined);
    setShowAddSheet(true);
  };

  const handleCareItemPress = (item: CareItem) => {
    setEditingItem(item);
    setShowAddSheet(true);
  };

  const handleCloseSheet = () => {
    setShowAddSheet(false);
    setEditingItem(undefined);
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
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 8,
            paddingBottom: 16,
          }}
        >
          <View>
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
            <Text
              style={{
                fontSize: 15,
                color: c.textSecondary,
                marginTop: 2,
              }}
            >
              {pets.length} pet{pets.length !== 1 ? 's' : ''} • {upcomingCareItems.length} upcoming
            </Text>
          </View>
          <IconButton
            icon={<Plus size={22} color={c.text} strokeWidth={2.5} />}
            onPress={handleAddPress}
            variant="filled"
          />
        </Animated.View>

        <ScrollView
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
              <SectionHeader title="Your Pets" />
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
            </ScrollView>
          </Animated.View>

          {/* Upcoming Care Section */}
          <Animated.View
            entering={FadeInDown.duration(400).delay(200)}
            style={{ marginTop: 32, paddingHorizontal: 20 }}
          >
            <SectionHeader
              title="Upcoming Care"
              action={
                upcomingCareItems.length > 0
                  ? { label: 'Add', onPress: handleAddPress }
                  : undefined
              }
            />

            {upcomingCareItems.length > 0 ? (
              <View style={{ gap: 10 }}>
                {upcomingCareItems.map((item, index) => {
                  const pet = pets.find((p) => p.id === item.petId);
                  if (!pet) return null;
                  return (
                    <Animated.View
                      key={item.id}
                      entering={FadeIn.duration(200).delay(index * 30)}
                    >
                      <CareItemRow
                        item={item}
                        pet={pet}
                        onPress={() => handleCareItemPress(item)}
                      />
                    </Animated.View>
                  );
                })}
              </View>
            ) : (
              <EmptyState
                icon={<Calendar size={32} color={c.accent} />}
                title="No Upcoming Care"
                description="Add care items to keep track of vaccines, vet visits, grooming, and more."
                action={{ label: 'Add Care Item', onPress: handleAddPress }}
              />
            )}
          </Animated.View>
        </ScrollView>
      </SafeAreaView>

      {/* Add/Edit Sheet */}
      <AddCareItemSheet
        visible={showAddSheet}
        onClose={handleCloseSheet}
        editItem={editingItem}
      />
    </View>
  );
}
