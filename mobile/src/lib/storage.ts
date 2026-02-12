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
const PHOTO_MIGRATION_KEY = 'caramelo_photo_path_migrated_v2';

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

/**
 * Converts a relative photo path (just filename) to a full URI.
 * This is the key to surviving app updates - we store relative paths
 * and reconstruct full URIs using the current documentDirectory.
 */
export function getPhotoFullUri(relativePath: string | undefined): string | undefined {
  if (!relativePath) return undefined;

  // If it's already a full path (legacy), extract just the filename
  if (relativePath.includes('/')) {
    const filename = relativePath.split('/').pop();
    if (filename) {
      return `${PHOTOS_DIR}${filename}`;
    }
    return undefined;
  }

  // It's a relative path (just filename), construct full URI
  return `${PHOTOS_DIR}${relativePath}`;
}

/**
 * Extracts just the filename from a full URI path.
 * We store only the filename to survive app updates where
 * the documentDirectory path changes.
 */
export function getPhotoRelativePath(fullUri: string | undefined): string | undefined {
  if (!fullUri) return undefined;

  // Extract just the filename
  const filename = fullUri.split('/').pop();
  return filename;
}

// Check if a photo file exists at the given URI
export async function photoExists(uri: string | undefined): Promise<boolean> {
  if (!uri) return false;
  try {
    // Convert relative path to full URI if needed
    const fullUri = getPhotoFullUri(uri);
    if (!fullUri) return false;

    const info = await FileSystem.getInfoAsync(fullUri);
    return info.exists;
  } catch (error) {
    console.log('[PhotoValidation] Error checking photo:', uri, error);
    return false;
  }
}

/**
 * Migrates old absolute photo paths to relative paths (just filenames).
 * This ensures photos survive app updates where iOS changes the sandbox path.
 *
 * Before: photoUri = "/var/mobile/.../photos/abc123.jpg" (breaks on update)
 * After:  photoUri = "abc123.jpg" (survives updates)
 */
export async function migratePhotoPathsToRelative(): Promise<{ migrated: number }> {
  try {
    const alreadyMigrated = await AsyncStorage.getItem(PHOTO_MIGRATION_KEY);
    if (alreadyMigrated === 'true') {
      return { migrated: 0 };
    }

    const pets = await getPets();
    let migratedCount = 0;
    let hasChanges = false;

    const migratedPets = pets.map((pet) => {
      if (pet.photoUri && pet.photoUri.includes('/')) {
        const filename = pet.photoUri.split('/').pop();
        if (filename) {
          console.log(`[PhotoMigration] Migrating pet "${pet.name}" photo to relative path: ${filename}`);
          migratedCount++;
          hasChanges = true;
          return { ...pet, photoUri: filename };
        }
      }
      return pet;
    });

    if (hasChanges) {
      await AsyncStorage.setItem(PETS_KEY, JSON.stringify(migratedPets));
      console.log(`[PhotoMigration] Migrated ${migratedCount} pet photo paths to relative format`);
    }

    // Mark migration as complete
    await AsyncStorage.setItem(PHOTO_MIGRATION_KEY, 'true');

    return { migrated: migratedCount };
  } catch (error) {
    console.error('[PhotoMigration] Error migrating photo paths:', error);
    return { migrated: 0 };
  }
}

/**
 * Validates that photo files exist and logs any missing ones.
 * Unlike before, this doesn't remove references - it just reports.
 */
export async function validateAndFixPetPhotos(): Promise<{ fixed: number; pets: Pet[] }> {
  try {
    // First, migrate to relative paths if needed
    await migratePhotoPathsToRelative();

    const pets = await getPets();
    let missingCount = 0;

    // Just check and log, don't remove references
    for (const pet of pets) {
      if (pet.photoUri && !pet.photoAsset) {
        const exists = await photoExists(pet.photoUri);
        if (!exists) {
          const fullUri = getPhotoFullUri(pet.photoUri);
          console.log(`[PhotoValidation] Pet "${pet.name}" photo not found at: ${fullUri}`);
          missingCount++;
        }
      }
    }

    if (missingCount > 0) {
      console.log(`[PhotoValidation] ${missingCount} pet photo(s) not found - they may have been lost during app update`);
    }

    return { fixed: 0, pets };
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

/**
 * Migrates profile photo path to relative format.
 */
export async function migrateProfilePhotoPath(photoUri: string | undefined): Promise<string | undefined> {
  if (!photoUri) return undefined;

  // If it's already relative (no slashes), return as is
  if (!photoUri.includes('/')) {
    return photoUri;
  }

  // Extract filename from full path
  return getPhotoRelativePath(photoUri);
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

    // Delete associated photo (handles both relative and full paths)
    if (pet?.photoUri) {
      await deletePhoto(pet.photoUri);
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
/**
 * Saves a photo to the photos directory and returns the RELATIVE path (filename only).
 * This ensures photos survive app updates where iOS changes the sandbox path.
 *
 * @returns Just the filename (e.g., "abc123.jpg"), NOT the full path
 */
export async function savePhoto(uri: string): Promise<string> {
  try {
    await ensurePhotosDir();
    const filename = `${generateId()}.jpg`;
    const newUri = `${PHOTOS_DIR}${filename}`;
    await FileSystem.copyAsync({ from: uri, to: newUri });
    // Return only the filename, not the full path
    return filename;
  } catch (error) {
    throw error;
  }
}

/**
 * Deletes a photo. Accepts either a relative path (filename) or full URI.
 */
export async function deletePhoto(uri: string): Promise<void> {
  try {
    const fullUri = getPhotoFullUri(uri);
    if (fullUri) {
      await FileSystem.deleteAsync(fullUri, { idempotent: true });
    }
  } catch (error) {
    // Silent fail
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
