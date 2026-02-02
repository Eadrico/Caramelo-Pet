
# Caramelo - Pet Care App

Um aplicativo premium de cuidados com pets para iOS e Android, construído com React Native Expo, seguindo as Apple Human Interface Guidelines (HIG) com estética moderna e intuitiva.

## 📱 Sobre o App

Caramelo é a solução perfeita para tutores que querem organizar a vida dos seus pets. Gerencie perfis completos, agende lembretes de vacinas e consultas, e nunca mais esqueça dos cuidados importantes dos seus amiguinhos!

### ✨ Principais Recursos

- **Perfis Completos**: Adicione fotos, informações e acompanhe o crescimento dos seus pets
- **Lembretes Inteligentes**: Notificações de vacinas, consultas e medicamentos
- **Histórico de Cuidados**: Acompanhe todo o histórico veterinário
- **Multi-idioma**: Português, Inglês, Espanhol, Francês e Chinês
- **Temas**: Suporte a modo claro e escuro
- **Privacidade**: Todos os dados armazenados localmente no dispositivo

## 🚀 Versão Atual

**Versão**: 1.0.0
**Build**: 1
**Status**: Pronto para submissão à App Store e Google Play

## 📞 Contato e Suporte

- **Email de Suporte**: support@caramelo.app
- **Email de Privacidade**: privacy@caramelo.app
- **Website**: https://caramelo.app (a ser criado)
- **Política de Privacidade**: Veja [PRIVACY_POLICY.md](./PRIVACY_POLICY.md)

## 🏪 Informações para Lojas

Para informações completas sobre submissão à App Store e Google Play, incluindo descrições, keywords, screenshots e categorias, consulte [STORE_LISTING.md](./STORE_LISTING.md).

## Features (Release 1 - MVP)

- **Entry Flow**: Smart routing based on onboarding state
  - IntroView: Welcome splash screen with app features
  - OnboardingWizard: Step-by-step pet setup
  - Automatic redirect to main app after completing onboarding

- **Tab Navigation**: Clean bottom navigation with two main sections
  - Home tab (house icon): Pet list and care management
    - Tapping the home icon always resets to the main view (closes modals, scrolls to top)
  - Settings tab (gear icon): User preferences and profile

- **First Pet Onboarding**: A beautiful 4-step wizard to add your first pet
  - Pet basics (name + species)
  - Photo (optional)
  - Key info (birthdate + weight, optional)
  - Review & save

- **Home Screen**: View your pets and upcoming care items
  - Horizontal scrolling pet cards with photos
  - Tap on a pet to view details
  - Upcoming care items list (next 14 days)
  - Quick add care items

- **Pet Detail Screen**: Comprehensive pet management
  - View and edit advanced pet info (breed, microchip, allergies, vet details)
  - Set reminders with notifications
  - View upcoming care items for this pet
  - Delete pet with confirmation

- **Settings Screen**: User preferences and profile management
  - **User Profile Section**
    - Profile photo (tap to change)
    - Name, email, phone (optional fields with edit modals)
  - **Preferences Section**
    - Language picker (System default, English, Portuguese, Spanish, French, Chinese)
    - Theme picker (System, Light, Dark)
  - **Danger Zone**
    - Reset app button with confirmation modal
    - Clears all data and returns to IntroView

- **Internationalization (i18n)**: Full multi-language support
  - 5 languages: English, Portuguese, Spanish, French, Chinese
  - System language auto-detection
  - Instant language switching without app restart
  - All UI strings localized including:
    - IntroView and Onboarding wizard (all 4 steps)
    - Settings, Tabs, and Pet Details
    - Care Item Management
    - Permission dialogs
    - All buttons, labels, and placeholders

- **Reminders & Notifications**
  - Create reminders for pet care tasks
  - Push notifications at scheduled times
  - Toggle reminders on/off
  - Support for one-time and recurring reminders (daily/weekly/monthly)

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
│   ├── _layout.tsx       # Root layout with providers and routing logic
│   ├── onboarding.tsx    # Onboarding entry point (full screen, no tabs)
│   ├── (tabs)/
│   │   ├── _layout.tsx   # Tab navigation layout
│   │   ├── index.tsx     # Home tab - pet list
│   │   └── settings.tsx  # Settings tab
│   └── +not-found.tsx    # 404 screen
├── components/
│   ├── design-system.tsx # Core UI components (GlassCard, PrimaryButton, etc.)
│   ├── IntroView.tsx     # Welcome splash screen
│   ├── OnboardingFlow.tsx # Intro + Wizard wrapper
│   ├── HomeScreen.tsx    # Main home screen
│   ├── PetDetailScreen.tsx # Pet detail screen with reminders
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
    ├── types.ts          # TypeScript types (Pet, CareItem, Reminder, etc.)
    ├── storage.ts        # AsyncStorage persistence + notifications
    ├── store.ts          # Zustand state management
    ├── settings-store.ts # Settings/preferences + onboarding state
    ├── cn.ts             # Classname utility
    └── i18n/
        ├── index.ts          # i18n exports
        ├── translations.ts   # All translations (en, pt, es, fr, zh)
        └── LanguageContext.tsx # Language provider and hooks
```

## Data Model

### Pet
- id, name, species (dog/cat/other)
- birthdate (optional), weightKg (optional)
- photoUri (optional), createdAt
- **Advanced fields**: breed, microchipId, allergies, vetName, vetPhone, notes

### CareItem
- id, petId, type (vaccine/grooming/medication/vet_visit)
- title, dueDate, notes (optional), createdAt

### Reminder
- id, petId, title, message (optional)
- dateTime, repeatType (none/daily/weekly/monthly)
- isEnabled, notificationId (for push notifications)
- createdAt

## Local Storage

All data is persisted locally using:
- AsyncStorage for pets, care items, and reminders
- FileSystem for pet photos
- expo-notifications for scheduled notifications

# Caramelo-Pet

