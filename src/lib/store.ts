// Zustand store for Caramelo app state
import { create } from 'zustand';
import { Pet, CareItem, OnboardingPetData, Species, CareType } from './types';
import * as storage from './storage';

interface AppState {
  // Data
  pets: Pet[];
  careItems: CareItem[];
  isLoading: boolean;
  isInitialized: boolean;

  // Onboarding state
  onboardingData: OnboardingPetData;

  // Actions
  initialize: () => Promise<void>;
  refreshData: () => Promise<void>;

  // Pet actions
  addPet: (pet: Omit<Pet, 'id' | 'createdAt'>) => Promise<Pet>;
  updatePet: (petId: string, updates: Partial<Pet>) => Promise<void>;
  deletePet: (petId: string) => Promise<void>;

  // Care item actions
  addCareItem: (item: Omit<CareItem, 'id' | 'createdAt'>) => Promise<CareItem>;
  updateCareItem: (itemId: string, updates: Partial<CareItem>) => Promise<void>;
  deleteCareItem: (itemId: string) => Promise<void>;

  // Onboarding actions
  setOnboardingName: (name: string) => void;
  setOnboardingSpecies: (species: Species) => void;
  setOnboardingPhoto: (photoUri: string | undefined) => void;
  setOnboardingBirthdate: (birthdate: string | undefined) => void;
  setOnboardingWeight: (weightKg: number | undefined) => void;
  addOnboardingCareItem: (item: Omit<CareItem, 'id' | 'petId' | 'createdAt'>) => void;
  removeOnboardingCareItem: (index: number) => void;
  resetOnboarding: () => void;
  completeOnboarding: () => Promise<Pet>;
}

const initialOnboardingData: OnboardingPetData = {
  name: '',
  species: 'dog',
  birthdate: undefined,
  weightKg: undefined,
  photoUri: undefined,
  careItems: [],
};

export const useStore = create<AppState>((set, get) => ({
  pets: [],
  careItems: [],
  isLoading: true,
  isInitialized: false,
  onboardingData: { ...initialOnboardingData },

  initialize: async () => {
    try {
      const [pets, careItems] = await Promise.all([
        storage.getPets(),
        storage.getCareItems(),
      ]);
      set({ pets, careItems, isLoading: false, isInitialized: true });
    } catch (error) {
      console.error('Error initializing app:', error);
      set({ isLoading: false, isInitialized: true });
    }
  },

  refreshData: async () => {
    try {
      const [pets, careItems] = await Promise.all([
        storage.getPets(),
        storage.getCareItems(),
      ]);
      set({ pets, careItems });
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  },

  addPet: async (petData) => {
    const pet = await storage.savePet(petData);
    set((state) => ({ pets: [...state.pets, pet] }));
    return pet;
  },

  updatePet: async (petId, updates) => {
    await storage.updatePet(petId, updates);
    set((state) => ({
      pets: state.pets.map((p) => (p.id === petId ? { ...p, ...updates } : p)),
    }));
  },

  deletePet: async (petId) => {
    await storage.deletePet(petId);
    set((state) => ({
      pets: state.pets.filter((p) => p.id !== petId),
      careItems: state.careItems.filter((c) => c.petId !== petId),
    }));
  },

  addCareItem: async (itemData) => {
    const item = await storage.saveCareItem(itemData);
    set((state) => ({ careItems: [...state.careItems, item] }));
    return item;
  },

  updateCareItem: async (itemId, updates) => {
    await storage.updateCareItem(itemId, updates);
    set((state) => ({
      careItems: state.careItems.map((c) =>
        c.id === itemId ? { ...c, ...updates } : c
      ),
    }));
  },

  deleteCareItem: async (itemId) => {
    await storage.deleteCareItem(itemId);
    set((state) => ({
      careItems: state.careItems.filter((c) => c.id !== itemId),
    }));
  },

  // Onboarding actions
  setOnboardingName: (name) =>
    set((state) => ({
      onboardingData: { ...state.onboardingData, name },
    })),

  setOnboardingSpecies: (species) =>
    set((state) => ({
      onboardingData: { ...state.onboardingData, species },
    })),

  setOnboardingPhoto: (photoUri) =>
    set((state) => ({
      onboardingData: { ...state.onboardingData, photoUri },
    })),

  setOnboardingBirthdate: (birthdate) =>
    set((state) => ({
      onboardingData: { ...state.onboardingData, birthdate },
    })),

  setOnboardingWeight: (weightKg) =>
    set((state) => ({
      onboardingData: { ...state.onboardingData, weightKg },
    })),

  addOnboardingCareItem: (item) =>
    set((state) => ({
      onboardingData: {
        ...state.onboardingData,
        careItems: [...state.onboardingData.careItems, item],
      },
    })),

  removeOnboardingCareItem: (index) =>
    set((state) => ({
      onboardingData: {
        ...state.onboardingData,
        careItems: state.onboardingData.careItems.filter((_, i) => i !== index),
      },
    })),

  resetOnboarding: () =>
    set({ onboardingData: { ...initialOnboardingData } }),

  completeOnboarding: async () => {
    const { onboardingData } = get();

    // Save photo if exists
    let photoUri = onboardingData.photoUri;
    if (photoUri) {
      photoUri = await storage.savePhoto(photoUri);
    }

    // Save pet with care items
    const { pet } = await storage.savePetWithCareItems(
      {
        name: onboardingData.name,
        species: onboardingData.species,
        birthdate: onboardingData.birthdate,
        weightKg: onboardingData.weightKg,
        photoUri,
      },
      onboardingData.careItems
    );

    // Refresh data and reset onboarding
    await get().refreshData();
    get().resetOnboarding();

    return pet;
  },
}));
