// Local persistence layer for Caramelo app
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Pet, CareItem, generateId } from './types';

const PETS_KEY = 'caramelo_pets';
const CARE_ITEMS_KEY = 'caramelo_care_items';
const PHOTOS_DIR = `${FileSystem.documentDirectory}photos/`;

// Initialize photos directory
async function ensurePhotosDir(): Promise<void> {
  const dirInfo = await FileSystem.getInfoAsync(PHOTOS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(PHOTOS_DIR, { intermediates: true });
  }
}

// Pet operations
export async function getPets(): Promise<Pet[]> {
  try {
    const data = await AsyncStorage.getItem(PETS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting pets:', error);
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
    console.error('Error saving pet:', error);
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
    console.error('Error updating pet:', error);
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
    console.error('Error deleting pet:', error);
    throw error;
  }
}

// Care item operations
export async function getCareItems(): Promise<CareItem[]> {
  try {
    const data = await AsyncStorage.getItem(CARE_ITEMS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting care items:', error);
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
    console.error('Error saving care item:', error);
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
    console.error('Error updating care item:', error);
    throw error;
  }
}

export async function deleteCareItem(itemId: string): Promise<void> {
  try {
    const items = await getCareItems();
    const filteredItems = items.filter(i => i.id !== itemId);
    await AsyncStorage.setItem(CARE_ITEMS_KEY, JSON.stringify(filteredItems));
  } catch (error) {
    console.error('Error deleting care item:', error);
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
    console.error('Error saving photo:', error);
    throw error;
  }
}

export async function deletePhoto(uri: string): Promise<void> {
  try {
    await FileSystem.deleteAsync(uri, { idempotent: true });
  } catch (error) {
    console.error('Error deleting photo:', error);
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
    console.error('Error saving pet with care items:', error);
    throw error;
  }
}

// Check if app has any pets (for routing)
export async function hasPets(): Promise<boolean> {
  const pets = await getPets();
  return pets.length > 0;
}
