// Migration utilities to update pets with photoAsset field
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet } from './types';
import { getDefaultPetAsset } from './pet-images';

const PETS_KEY = 'caramelo_pets';
const MIGRATION_KEY = 'caramelo_pet_migration_v1';

/**
 * Migrates existing pets to use photoAsset for bundled images.
 * This runs once per app install.
 */
export async function migratePetsToAssets(): Promise<void> {
  try {
    // Check if migration already ran
    const migrated = await AsyncStorage.getItem(MIGRATION_KEY);
    if (migrated === 'true') {
      console.log('[Pet Migration] Already migrated, skipping...');
      return; // Already migrated
    }

    console.log('[Pet Migration] Starting pet asset migration...');

    // Get existing pets
    const petsData = await AsyncStorage.getItem(PETS_KEY);
    if (!petsData) {
      console.log('[Pet Migration] No pets found, marking as migrated');
      await AsyncStorage.setItem(MIGRATION_KEY, 'true');
      return;
    }

    const pets: Pet[] = JSON.parse(petsData);
    let updated = false;

    console.log(`[Pet Migration] Found ${pets.length} pets to migrate`);

    // Update each pet
    for (const pet of pets) {
      // Skip if already has photoAsset
      if (pet.photoAsset) {
        console.log(`[Pet Migration] Pet '${pet.name}' already has photoAsset, skipping`);
        continue;
      }

      // Try to match pet name to default assets
      const assetName = getDefaultPetAsset(pet.name);
      if (assetName) {
        pet.photoAsset = assetName;
        updated = true;
        console.log(`[Pet Migration] ✅ Assigned asset '${assetName}' to pet '${pet.name}'`);
      } else {
        console.log(`[Pet Migration] ⏭️  No matching asset for pet '${pet.name}'`);
      }
    }

    // Save updated pets if any changes were made
    if (updated) {
      await AsyncStorage.setItem(PETS_KEY, JSON.stringify(pets));
      console.log('[Pet Migration] ✅ Updated pets saved successfully');
    }

    // Mark migration as complete
    await AsyncStorage.setItem(MIGRATION_KEY, 'true');
    console.log('[Pet Migration] ✅ Migration completed successfully');
  } catch (error) {
    console.error('[Pet Migration] ❌ Error during migration:', error);
    // Don't throw - allow app to continue even if migration fails
  }
}
