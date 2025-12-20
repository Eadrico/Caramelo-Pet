# Caramelo - Pet Care App

A premium iOS pet care app built with React Native Expo, following Apple Human Interface Guidelines (HIG) with a Liquid Glass aesthetic.

## Features (Release 1 - MVP)

- **First Pet Onboarding**: A beautiful 5-step wizard to add your first pet
  - Pet basics (name + species)
  - Photo (optional)
  - Key info (birthdate + weight, optional)
  - Initial care schedule setup
  - Review & save

- **Home Screen**: View your pets and upcoming care items
  - Horizontal scrolling pet cards with photos
  - Upcoming care items list (next 14 days)
  - Quick add care items

- **Care Item Management**
  - Add new care items (vaccines, grooming, medication, vet visits)
  - Edit existing care items
  - Delete with confirmation
  - Due date tracking with "Soon" and "Overdue" indicators

## Design System

The app uses a refined Liquid Glass aesthetic with:
- Warm caramel accent color (`#C4A77D`)
- Translucent glass cards with blur effects
- Smooth spring animations
- Haptic feedback on interactions
- Full dark mode support

## Project Structure

```
src/
├── app/
│   ├── _layout.tsx       # Root layout with providers
│   ├── index.tsx         # Main entry - routes between onboarding/home
│   └── +not-found.tsx    # 404 screen
├── components/
│   ├── design-system.tsx # Core UI components (GlassCard, PrimaryButton, etc.)
│   ├── HomeScreen.tsx    # Main home screen
│   ├── OnboardingWizard.tsx # Onboarding container
│   ├── AddCareItemSheet.tsx # Add/edit care item modal
│   ├── home/
│   │   ├── PetCard.tsx   # Pet card component
│   │   └── CareItemRow.tsx # Care item row component
│   └── onboarding/
│       ├── OnboardingBasics.tsx  # Step 1
│       ├── OnboardingPhoto.tsx   # Step 2
│       ├── OnboardingInfo.tsx    # Step 3
│       ├── OnboardingCare.tsx    # Step 4
│       └── OnboardingReview.tsx  # Step 5
└── lib/
    ├── types.ts          # TypeScript types (Pet, CareItem, etc.)
    ├── storage.ts        # AsyncStorage persistence
    ├── store.ts          # Zustand state management
    └── cn.ts             # Classname utility
```

## Data Model

### Pet
- id, name, species (dog/cat/other)
- birthdate (optional), weightKg (optional)
- photoUri (optional), createdAt

### CareItem
- id, petId, type (vaccine/grooming/medication/vet_visit)
- title, dueDate, notes (optional), createdAt

## Local Storage

All data is persisted locally using:
- AsyncStorage for pets and care items
- FileSystem for pet photos
