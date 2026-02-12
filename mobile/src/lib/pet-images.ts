// Pet image utilities - handles both local assets and URIs
import { ImageSourcePropType } from 'react-native';
import { Pet } from './types';

// Map of asset names to require() statements for instant loading
const PET_ASSETS: Record<string, ImageSourcePropType> = {
  'loki-new': require('../../assets/loki-new.png'),
  'brownie-new': require('../../assets/brownie-new.png'),
  'fuba-new': require('../../assets/fuba-new.png'),
  'baunilha-new': require('../../assets/baunilha-new.png'),
  // Legacy support
  'loki': require('../../assets/loki-new.png'),
  'brownie': require('../../assets/brownie-new.png'),
  'fuba': require('../../assets/fuba-new.png'),
  'baunilha': require('../../assets/baunilha-new.png'),
};

/**
 * Gets the appropriate image source for a pet photo.
 * Prioritizes local bundled assets for instant loading.
 * Falls back to URI-based images (file system or remote).
 *
 * Note: For photoUri, this function returns the source even if the file
 * may not exist (e.g., after an app update). The validateAndFixPetPhotos()
 * function in storage.ts handles cleanup of invalid URIs on app startup.
 */
export function getPetImageSource(pet: Pet): ImageSourcePropType | null {
  // Priority 1: Local bundled asset (instant loading, no network/file I/O)
  if (pet.photoAsset && PET_ASSETS[pet.photoAsset]) {
    return PET_ASSETS[pet.photoAsset];
  }

  // Priority 2: URI-based image (requires async loading)
  if (pet.photoUri) {
    return { uri: pet.photoUri };
  }

  // No image available
  return null;
}

/**
 * Checks if a pet has any photo (asset or URI)
 * Note: This only checks if a reference exists, not if the file is valid.
 * Invalid URIs are cleaned up by validateAndFixPetPhotos() on app startup.
 */
export function hasPetPhoto(pet: Pet): boolean {
  return !!(pet.photoAsset || pet.photoUri);
}

/**
 * Gets asset name from pet name for default pets
 */
export function getDefaultPetAsset(petName: string): string | undefined {
  const normalized = petName.toLowerCase().trim();

  // Map common pet names to their assets
  const nameToAsset: Record<string, string> = {
    'loki': 'loki-new',
    'brownie': 'brownie-new',
    'fubá': 'fuba-new',
    'fuba': 'fuba-new',
    'baunilha': 'baunilha-new',
  };

  return nameToAsset[normalized];
}
