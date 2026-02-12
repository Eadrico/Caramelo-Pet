// Local persistence layer for Caramelo app
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';
import { Pet, CareItem, Reminder, generateId } from './types';

const PETS_KEY = 'caramelo_pets';
const CARE_ITEMS_KEY = 'caramelo_care_items';
const REMINDERS_KEY = 'caramelo_reminders';
const UPCOMING_CARE_DAYS_KEY = 'caramelo_upcoming_care_days';
const PHOTOS_DIR = `${FileSystem.documentDirectory}photos/`;
const PHOTO_VALIDATION_KEY = 'caramelo_last_photo_validation';

// Settings operations
export async function getUpcomingCareDays(): Promise<number | null> {
  try {
    const data = await AsyncStorage.getItem(UPCOMING_CARE_DAYS_KEY);
    return data ? parseInt(data, 10) : null;
  } catch (error) {
    return null;
  }
}

export async function saveUpcomingCareDays(days: number): Promise<void> {
  try {
    await AsyncStorage.setItem(UPCOMING_CARE_DAYS_KEY, days.toString());
  } catch (error) {
    throw error;
  }
}

// Initialize photos directory
async function ensurePhotosDir(): Promise<void> {
  const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
  }
}

// Check if a photo file exists at the given URI
export async function photoExists(uri: string | undefined): Promise<boolean> {
  if (!uri) return false;
  try {
    const info = await FileSystem.getInfoAsync(uri);
    return info.exists;
  } catch (error) {
    console.log('[PhotoValidation] Error checking photo:', uri, error);
    return false;
  }
}

// Validate and fix pet photos - removes invalid photoUri references
// This fixes the bug where photos disappear after App Store updates
// because iOS may change the app's sandbox path
export async function validateAndFixPetPhotos(): Promise<{ fixed: number; pets: Pet[] }> {
  try {
    const pets = await getPets();
    let fixedCount = 0;
    let hasChanges = false;

    const validatedPets = await Promise.all(
      pets.map(async (pet) => {
        // Skip if pet uses photoAsset (bundled assets always exist)
        if (pet.photoAsset) {
          return pet;
        }

        // Check if photoUri file exists
        if (pet.photoUri) {
          const exists = await photoExists(pet.photoUri);
          if (!exists) {
            console.log(`[PhotoValidation] Pet "${pet.name}" photo not found at: ${pet.photoUri}`);
            fixedCount++;
            hasChanges = true;
            // Remove invalid photoUri reference
            return { ...pet, photoUri: undefined };
          }
        }

        return pet;
      })
    );

    // Save if any changes were made
    if (hasChanges) {
      await AsyncStorage.setItem(PETS_KEY, JSON.stringify(validatedPets));
      console.log(`[PhotoValidation] Fixed ${fixedCount} pet(s) with missing photos`);
    }

    return { fixed: fixedCount, pets: validatedPets };
  } catch (error) {
    console.error('[PhotoValidation] Error validating pet photos:', error);
    return { fixed: 0, pets: [] };
  }
}

// Validate user profile photo
export async function validateProfilePhoto(photoUri: string | undefined): Promise<boolean> {
  if (!photoUri) return true; // No photo is valid
  return photoExists(photoUri);
}

// Pet operations
export async function getPets(): Promise<Pet[]> {
  try {
    const data = await AsyncStorage.getItem(PETS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    // Silent fail - return empty array
    return [];
  }
}

export async function savePet(pet: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet> {
  try {
    const pets = await getPets();
    const newPet: Pet = {
      ...pet,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    pets.push(newPet);
    await AsyncStorage.setItem(PETS_KEY, JSON.stringify(pets));
    return newPet;
  } catch (error) {
    throw error;
  }
}

export async function updatePet(petId: string, updates: Partial<Pet>): Promise<Pet | null> {
  try {
    const pets = await getPets();
    const index = pets.findIndex(p => p.id === petId);
    if (index === -1) return null;

    pets[index] = { ...pets[index], ...updates };
    await AsyncStorage.setItem(PETS_KEY, JSON.stringify(pets));
    return pets[index];
  } catch (error) {
    throw error;
  }
}

export async function deletePet(petId: string): Promise<void> {
  try {
    const pets = await getPets();
    const pet = pets.find(p => p.id === petId);

    // Delete associated photo
    if (pet?.photoUri) {
      await FileSystem.deleteAsync(pet.photoUri, { idempotent: true });
    }

    // Delete pet
    const filteredPets = pets.filter(p => p.id !== petId);
    await AsyncStorage.setItem(PETS_KEY, JSON.stringify(filteredPets));

    // Delete associated care items
    const careItems = await getCareItems();
    const filteredCareItems = careItems.filter(c => c.petId !== petId);
    await AsyncStorage.setItem(CARE_ITEMS_KEY, JSON.stringify(filteredCareItems));
  } catch (error) {
    throw error;
  }
}

// Care item operations
export async function getCareItems(): Promise<CareItem[]> {
  try {
    const data = await AsyncStorage.getItem(CARE_ITEMS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    
    return [];
  }
}

export async function getCareItemsByPet(petId: string): Promise<CareItem[]> {
  const items = await getCareItems();
  return items.filter(item => item.petId === petId);
}

export async function getUpcomingCareItems(days: number = 14): Promise<CareItem[]> {
  const items = await getCareItems();
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + days);

  return items
    .filter(item => {
      const dueDate = new Date(item.dueDate);
      return dueDate >= now && dueDate <= futureDate;
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
}

export async function saveCareItem(item: Omit<CareItem, 'id' | 'createdAt'>): Promise<CareItem> {
  try {
    const items = await getCareItems();
    const newItem: CareItem = {
      ...item,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    items.push(newItem);
    await AsyncStorage.setItem(CARE_ITEMS_KEY, JSON.stringify(items));
    return newItem;
  } catch (error) {
    
    throw error;
  }
}

export async function updateCareItem(itemId: string, updates: Partial<CareItem>): Promise<CareItem | null> {
  try {
    const items = await getCareItems();
    const index = items.findIndex(i => i.id === itemId);
    if (index === -1) return null;

    items[index] = { ...items[index], ...updates };
    await AsyncStorage.setItem(CARE_ITEMS_KEY, JSON.stringify(items));
    return items[index];
  } catch (error) {
    
    throw error;
  }
}

export async function deleteCareItem(itemId: string): Promise<void> {
  try {
    const items = await getCareItems();
    const filteredItems = items.filter(i => i.id !== itemId);
    await AsyncStorage.setItem(CARE_ITEMS_KEY, JSON.stringify(filteredItems));
  } catch (error) {
    
    throw error;
  }
}

// Photo operations
export async function savePhoto(uri: string): Promise<string> {
  try {
    await ensurePhotosDir();
    const filename = `${generateId()}.jpg`;
    const newUri = `${PHOTOS_DIR}${filename}`;
    await FileSystem.copyAsync({ from: uri, to: newUri });
    return newUri;
  } catch (error) {
    
    throw error;
  }
}

export async function deletePhoto(uri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch (error) {
    
  }
}

// Batch operations for onboarding
export async function savePetWithCareItems(
  petData: Omit<Pet, 'id' | 'createdAt'>,
  careItems: Omit<CareItem, 'id' | 'petId' | 'createdAt'>[]
): Promise<{ pet: Pet; careItems: CareItem[] }> {
  try {
    // Save pet first
    const pet = await savePet(petData);

    // Save care items
    const savedCareItems: CareItem[] = [];
    for (const item of careItems) {
      const savedItem = await saveCareItem({
        ...item,
        petId: pet.id,
      });
      savedCareItems.push(savedItem);
    }

    return { pet, careItems: savedCareItems };
  } catch (error) {
    
    throw error;
  }
}

// Check if app has any pets (for routing)
export async function hasPets(): Promise<boolean> {
  const pets = await getPets();
  return pets.length > 0;
}

// Reminder operations
export async function getReminders(): Promise<Reminder[]> {
  try {
    const data = await AsyncStorage.getItem(REMINDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    
    return [];
  }
}

export async function getRemindersByPet(petId: string): Promise<Reminder[]> {
  const reminders = await getReminders();
  return reminders.filter((r) => r.petId === petId);
}

async function scheduleNotification(reminder: Reminder): Promise<string | undefined> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        return undefined;
      }
    }

    const triggerDate = new Date(reminder.dateTime);
    if (triggerDate <= new Date()) {
      return undefined; // Don't schedule past notifications
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: reminder.title,
        body: reminder.message || 'Time for pet care!',
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });

    return notificationId;
  } catch (error) {
    
    return undefined;
  }
}

async function cancelNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    
  }
}

export async function saveReminder(
  reminderData: Omit<Reminder, 'id' | 'createdAt' | 'notificationId'>
): Promise<Reminder> {
  try {
    const reminders = await getReminders();
    const newReminder: Reminder = {
      ...reminderData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };

    // Schedule notification if enabled
    if (newReminder.isEnabled) {
      const notificationId = await scheduleNotification(newReminder);
      newReminder.notificationId = notificationId;
    }

    reminders.push(newReminder);
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
    return newReminder;
  } catch (error) {
    
    throw error;
  }
}

export async function updateReminder(
  reminderId: string,
  updates: Partial<Reminder>
): Promise<Reminder | null> {
  try {
    const reminders = await getReminders();
    const index = reminders.findIndex((r) => r.id === reminderId);
    if (index === -1) return null;

    const existingReminder = reminders[index];

    // Cancel existing notification if there is one
    if (existingReminder.notificationId) {
      await cancelNotification(existingReminder.notificationId);
    }

    const updatedReminder = { ...existingReminder, ...updates };

    // Schedule new notification if enabled
    if (updatedReminder.isEnabled) {
      const notificationId = await scheduleNotification(updatedReminder);
      updatedReminder.notificationId = notificationId;
    } else {
      updatedReminder.notificationId = undefined;
    }

    reminders[index] = updatedReminder;
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
    return updatedReminder;
  } catch (error) {
    
    throw error;
  }
}

export async function deleteReminder(reminderId: string): Promise<void> {
  try {
    const reminders = await getReminders();
    const reminder = reminders.find((r) => r.id === reminderId);

    // Cancel notification if exists
    if (reminder?.notificationId) {
      await cancelNotification(reminder.notificationId);
    }

    const filteredReminders = reminders.filter((r) => r.id !== reminderId);
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(filteredReminders));
  } catch (error) {
    
    throw error;
  }
}

export async function toggleReminder(reminderId: string): Promise<Reminder | null> {
  const reminders = await getReminders();
  const reminder = reminders.find((r) => r.id === reminderId);
  if (!reminder) return null;

  return updateReminder(reminderId, { isEnabled: !reminder.isEnabled });
}
