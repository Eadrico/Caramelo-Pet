// Pet image utilities - handles both local assets and URIs
import { ImageSourcePropType } from 'react-native';
import { Pet } from './types';
import { getPhotoFullUri } from './storage';

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
 * Handles both relative paths (just filename) and full URIs for backwards compatibility.
 * Relative paths are converted to full URIs using the current documentDirectory,
 * which ensures photos survive app updates where iOS changes the sandbox path.
 */
export function getPetImageSource(pet: Pet): ImageSourcePropType | null {
  // Priority 1: Local bundled asset (instant loading, no network/file I/O)
  if (pet.photoAsset && PET_ASSETS[pet.photoAsset]) {
    return PET_ASSETS[pet.photoAsset];
  }

  // Priority 2: URI-based image (requires async loading)
  if (pet.photoUri) {
    // Convert relative path to full URI if needed
    const fullUri = getPhotoFullUri(pet.photoUri);
    if (fullUri) {
      return { uri: fullUri };
    }
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
