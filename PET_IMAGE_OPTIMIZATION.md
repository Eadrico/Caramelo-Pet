# Pet Image Loading Optimization

## Problem
Pet images were loading slowly because they were being loaded from file URIs (requiring async file I/O) or remote URLs (requiring network requests). This caused noticeable delay when displaying pet cards, especially for the default pets (Loki, Brownie, Fubá, Baunilha).

## Solution
Implemented a dual-source image system that prioritizes bundled local assets for instant loading, while maintaining support for user-uploaded images via URIs.

## Changes Made

### 1. Updated Pet Type (`src/lib/types.ts`)
Added `photoAsset` field to support local bundled assets:
```typescript
export interface Pet {
  // ... existing fields
  photoUri?: string;      // File URI or remote URL
  photoAsset?: string;    // Local bundled asset name (e.g., 'loki-new')
}
```

### 2. Created Pet Image Utilities (`src/lib/pet-images.ts`)
- **`getPetImageSource(pet)`**: Returns the appropriate image source, prioritizing bundled assets
- **`hasPetPhoto(pet)`**: Checks if pet has any photo (asset or URI)
- **`getDefaultPetAsset(petName)`**: Maps pet names to bundled assets

Supported bundled assets:
- `loki-new` → `/assets/loki-new.png`
- `brownie-new` → `/assets/brownie-new.png`
- `fuba-new` → `/assets/fuba-new.png`
- `baunilha-new` → `/assets/baunilha-new.png`

### 3. Created Migration System (`src/lib/pet-migration.ts`)
- Automatically runs once per app install
- Updates existing pets with matching names to use bundled assets
- Logs migration progress for debugging
- Gracefully handles errors without breaking the app

### 4. Updated Components
Updated all components to use the new image system:
- `PetCard.tsx` - Home screen pet cards
- `PetChip.tsx` - Pet selection chips
- `PetDetailScreen.tsx` - Pet detail view

### 5. Preload Assets (`src/app/_layout.tsx`)
Added Asset.loadAsync() to preload all pet images during app initialization for instant display.

## Benefits

### Performance
- **Instant Loading**: Bundled assets load synchronously from the app bundle (no I/O delay)
- **No Network Requests**: Default pet images don't require network access
- **Preloaded**: Assets are loaded during splash screen, ensuring zero delay on first view

### User Experience
- Pet images appear instantly with no loading flicker
- Smoother scrolling in pet lists
- Better perceived performance

### Flexibility
- Maintains full support for user-uploaded photos via photoUri
- Backward compatible with existing pets
- Automatic migration for existing users

## Technical Details

### Image Loading Priority
1. **photoAsset** (if present) → Bundled local asset (instant loading)
2. **photoUri** (if present) → File URI or remote URL (async loading)
3. **None** → Display placeholder icon

### Migration Behavior
- Runs once per app install (tracked via AsyncStorage key)
- Maps pet names to assets:
  - "Loki" → loki-new
  - "Brownie" → brownie-new
  - "Fubá" or "Fuba" → fuba-new
  - "Baunilha" → baunilha-new
- Case-insensitive matching
- Only updates pets that don't already have photoAsset

### Storage Format
Pets are stored in AsyncStorage with the new structure:
```json
{
  "id": "...",
  "name": "Loki",
  "photoAsset": "loki-new",  // ← New field for bundled assets
  "photoUri": "file://...",   // ← Still supported for user uploads
  // ... other fields
}
```

## Testing
- Migration logs show successful asset assignment
- App loads without errors
- Images display instantly on pet cards
- User-uploaded photos still work correctly

## Future Enhancements
- Add more bundled pet images for common pet names
- Compress bundled assets for smaller app size
- Consider lazy loading for user-uploaded images with proper placeholders
