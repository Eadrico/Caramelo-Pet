// Translations for Caramelo app
// Supports: English (en), Portuguese (pt), Spanish (es)

export type SupportedLanguage = 'system' | 'en' | 'pt' | 'es';

export const languageNames: Record<SupportedLanguage, string> = {
  system: 'System Default',
  en: 'English',
  pt: 'Português',
  es: 'Español',
};

export const languageFlags: Record<SupportedLanguage, string> = {
  system: '🌐',
  en: '🇺🇸',
  pt: '🇧🇷',
  es: '🇪🇸',
};

type TranslationKey =
  // Intro Screen
  | 'intro_welcome_title'
  | 'intro_welcome_subtitle'
  | 'intro_feature_pets_title'
  | 'intro_feature_pets_desc'
  | 'intro_feature_schedule_title'
  | 'intro_feature_schedule_desc'
  | 'intro_feature_reminders_title'
  | 'intro_feature_reminders_desc'
  | 'intro_continue'
  // Onboarding
  | 'onboarding_step1_title'
  | 'onboarding_step1_subtitle'
  | 'onboarding_pet_name'
  | 'onboarding_pet_name_placeholder'
  | 'onboarding_pet_name_example'
  | 'onboarding_species'
  | 'onboarding_species_dog'
  | 'onboarding_species_cat'
  | 'onboarding_species_other'
  | 'onboarding_species_question'
  | 'onboarding_add_pet_title'
  | 'onboarding_add_pet_subtitle'
  | 'onboarding_continue'
  | 'onboarding_select_birthdate'
  | 'onboarding_weight_placeholder'
  | 'onboarding_key_info_title'
  | 'onboarding_key_info_subtitle'
  | 'onboarding_skip_for_now'
  | 'onboarding_step2_title'
  | 'onboarding_step2_subtitle'
  | 'onboarding_add_photo'
  | 'onboarding_change_photo'
  | 'onboarding_skip'
  | 'onboarding_step3_title'
  | 'onboarding_step3_subtitle'
  | 'onboarding_birthdate'
  | 'onboarding_weight'
  | 'onboarding_step4_title'
  | 'onboarding_step4_subtitle'
  | 'onboarding_add_care'
  | 'onboarding_step5_title'
  | 'onboarding_step5_subtitle'
  | 'onboarding_finish'
  | 'onboarding_next'
  | 'onboarding_back'
  | 'onboarding_review_title'
  | 'onboarding_review_subtitle'
  | 'onboarding_review_age'
  | 'onboarding_review_weight'
  | 'onboarding_review_ready_message'
  // Tabs
  | 'tab_home'
  | 'tab_settings'
  // Home
  | 'home_title'
  | 'home_my_pets'
  | 'home_your_pets'
  | 'home_upcoming_care'
  | 'home_add_pet'
  | 'home_add_pet_desc'
  | 'home_no_pets'
  | 'home_no_care'
  | 'home_no_care_desc'
  | 'home_add_care_item'
  | 'home_add_care_desc'
  | 'home_add_reminder'
  | 'home_add_reminder_desc'
  | 'home_choose_what_to_add'
  | 'home_pets_count'
  | 'home_upcoming_count'
  | 'home_premium_badge'
  | 'common_add'
  // Settings
  | 'settings_title'
  | 'settings_profile'
  | 'settings_profile_photo'
  | 'settings_change_photo'
  | 'settings_name'
  | 'settings_email'
  | 'settings_phone'
  | 'settings_not_set'
  | 'settings_preferences'
  | 'settings_language'
  | 'settings_theme'
  | 'settings_theme_system'
  | 'settings_theme_light'
  | 'settings_theme_dark'
  | 'settings_upcoming_care_days'
  | 'settings_upcoming_care_days_desc'
  | 'settings_upcoming_care_days_7'
  | 'settings_upcoming_care_days_14'
  | 'settings_upcoming_care_days_30'
  | 'settings_upcoming_care_days_60'
  | 'settings_danger_zone'
  | 'settings_reset_app'
  | 'settings_reset_desc'
  | 'settings_reset_confirm_title'
  | 'settings_reset_confirm_message'
  | 'settings_reset_confirm'
  | 'settings_cancel'
  | 'settings_save'
  | 'settings_edit'
  // Pet Details
  | 'pet_details_title'
  | 'pet_details_information'
  | 'pet_details_breed'
  | 'pet_details_weight'
  | 'pet_details_microchip'
  | 'pet_details_allergies'
  | 'pet_details_veterinarian'
  | 'pet_details_notes'
  | 'pet_details_reminders'
  | 'pet_details_upcoming_care'
  | 'pet_details_delete'
  | 'pet_details_no_reminders'
  | 'pet_details_add_reminder'
  | 'pet_details_no_upcoming'
  | 'pet_details_vet_phone'
  | 'pet_details_enter_breed'
  | 'pet_details_enter_weight'
  | 'pet_details_enter_microchip'
  | 'pet_details_enter_allergies'
  | 'pet_details_enter_vet_name'
  | 'pet_details_enter_phone'
  | 'pet_details_add_notes'
  | 'pet_details_not_found'
  | 'pet_species_dog'
  | 'pet_species_cat'
  | 'pet_species_other'
  // Care Item Management
  | 'care_add_item'
  | 'care_edit_item'
  | 'care_delete_item'
  | 'care_delete_confirm'
  | 'care_pet_label'
  | 'care_type_label'
  | 'care_title_label'
  | 'care_due_date_label'
  | 'care_date_label'
  | 'care_notes_label'
  | 'care_select_pet'
  | 'care_select_pets'
  | 'care_title_placeholder'
  | 'care_notes_placeholder'
  | 'care_reminder_title_placeholder'
  | 'care_message_placeholder'
  // Care types
  | 'care_vaccine'
  | 'care_grooming'
  | 'care_medication'
  | 'care_vet_visit'
  | 'care_type_vaccine'
  | 'care_type_grooming'
  | 'care_type_medication'
  | 'care_type_vet_visit'
  | 'care_type_general'
  // Paywall
  | 'paywall_title'
  | 'paywall_subtitle'
  | 'paywall_limit_reached'
  | 'paywall_feature_unlimited'
  | 'paywall_feature_unlimited_desc'
  | 'paywall_feature_support'
  | 'paywall_feature_support_desc'
  | 'paywall_feature_lifetime'
  | 'paywall_feature_lifetime_desc'
  | 'paywall_buy_button'
  | 'paywall_restore'
  | 'paywall_one_time'
  | 'paywall_close'
  | 'paywall_purchase_success'
  | 'paywall_restore_success'
  | 'paywall_restore_none'
  | 'paywall_error'
  // Settings - Premium
  | 'settings_premium'
  | 'settings_premium_active'
  | 'settings_premium_upgrade'
  | 'settings_premium_desc'
  | 'settings_premium_desc_active'
  | 'settings_premium_badge'
  // Settings - Developer
  | 'settings_developer'
  | 'settings_admin_mode'
  | 'settings_admin_desc'
  // Common
  | 'common_today'
  | 'common_tomorrow'
  | 'common_yesterday'
  | 'common_days_ago'
  | 'common_in_days'
  | 'common_soon'
  | 'common_overdue'
  | 'common_months'
  | 'common_month'
  | 'common_years'
  | 'common_year'
  | 'common_and'
  | 'common_less_than_month'
  | 'common_delete'
  | 'common_edit'
  | 'common_confirm'
  | 'common_cancel'
  | 'common_select_language'
  | 'common_select_theme'
  | 'common_system_default'
  | 'common_enter'
  | 'common_saving'
  | 'common_done'
  | 'common_date'
  | 'common_time'
  | 'common_title'
  | 'common_message'
  | 'common_message_optional'
  | 'common_date_time'
  | 'common_repeat'
  | 'common_once'
  | 'common_daily'
  | 'common_weekly'
  | 'common_monthly'
  | 'common_new_reminder'
  | 'common_edit_reminder'
  | 'common_delete_reminder'
  | 'common_delete_reminder_confirm'
  | 'common_add_reminder'
  | 'common_loading'
  | 'common_due_date'
  | 'onboarding_save_pet'
  | 'home_no_upcoming_items'
  | 'home_no_upcoming_items_desc'
  // Pet Details - Delete Confirmation
  | 'pet_details_delete_confirm'
  // Permissions
  | 'permission_camera_title'
  | 'permission_camera_message'
  | 'permission_photos_title'
  | 'permission_photos_message'
  // Photo actions
  | 'photo_choose_library'
  | 'photo_take_photo'
  // Repeat labels
  | 'repeat_does_not_repeat'
  | 'repeat_every_day'
  | 'repeat_every_week'
  | 'repeat_every_month';

type Translations = Record<TranslationKey, string>;

const en: Translations = {
  // Intro Screen
  intro_welcome_title: 'Welcome to Caramelo',
  intro_welcome_subtitle: 'The complete app to care for your pets with love and organization',
  intro_feature_pets_title: 'Register your pets',
  intro_feature_pets_desc: 'Keep all important information in one place',
  intro_feature_schedule_title: 'Schedule care',
  intro_feature_schedule_desc: 'Vaccines, grooming, appointments and more',
  intro_feature_reminders_title: 'Smart reminders',
  intro_feature_reminders_desc: 'Never forget an important appointment again',
  intro_continue: 'Continue',
  // Onboarding
  onboarding_step1_title: "What's your pet's name?",
  onboarding_step1_subtitle: "Let's start with the basics",
  onboarding_pet_name: 'Name',
  onboarding_pet_name_placeholder: 'Enter name',
  onboarding_pet_name_example: 'e.g., Loki, Fubá, Brownie or Baunilha',
  onboarding_species: 'Species',
  onboarding_species_question: 'What type of pet?',
  onboarding_add_pet_title: 'Add Your Pet',
  onboarding_add_pet_subtitle: "Let's start with the basics.",
  onboarding_continue: 'Continue',
  onboarding_select_birthdate: 'Select birthdate',
  onboarding_weight_placeholder: '0.0',
  onboarding_key_info_title: 'Key Info',
  onboarding_key_info_subtitle: 'Help us know {name} better.',
  onboarding_skip_for_now: 'Skip for now',
  onboarding_species_dog: 'Dog',
  onboarding_species_cat: 'Cat',
  onboarding_species_other: 'Other',
  onboarding_step2_title: 'Add a photo',
  onboarding_step2_subtitle: 'A picture is worth a thousand words',
  onboarding_add_photo: 'Add Photo',
  onboarding_change_photo: 'Change Photo',
  onboarding_skip: 'Skip',
  onboarding_step3_title: 'Additional info',
  onboarding_step3_subtitle: 'Optional but helpful',
  onboarding_birthdate: 'Birthdate',
  onboarding_weight: 'Weight (kg)',
  onboarding_step4_title: 'Care schedule',
  onboarding_step4_subtitle: 'Add upcoming care items',
  onboarding_add_care: 'Add care item',
  onboarding_step5_title: 'All set!',
  onboarding_step5_subtitle: 'Review your pet info',
  onboarding_finish: 'Get Started',
  onboarding_next: 'Next',
  onboarding_back: 'Back',
  onboarding_review_title: 'Review',
  onboarding_review_subtitle: 'Everything look good?',
  onboarding_review_age: 'Age',
  onboarding_review_weight: 'Weight',
  onboarding_review_ready_message: '{name} is ready to be added to Caramelo!',
  // Tabs
  tab_home: 'Home',
  tab_settings: 'Settings',
  // Home
  home_title: 'My Pets',
  home_my_pets: 'My Pets',
  home_your_pets: 'Your Pets',
  home_upcoming_care: 'Upcoming Care',
  home_add_pet: 'Add Pet',
  home_add_pet_desc: 'Register a new furry friend',
  home_no_pets: 'No pets yet',
  home_no_care: 'No Upcoming Care',
  home_no_care_desc: 'Add care items to keep track of vaccines, vet visits, grooming, and more.',
  home_add_care_item: 'Add Care Item',
  home_add_care_desc: 'Schedule vaccines, vet visits, and more',
  home_add_reminder: 'Add Reminder',
  home_add_reminder_desc: 'Set a reminder for your pet',
  home_choose_what_to_add: 'Choose what you want to add',
  home_pets_count: '{count} pet(s)',
  home_upcoming_count: '{count} upcoming',
  home_premium_badge: 'Premium',
  common_add: 'Add',
  // Settings
  settings_title: 'Settings',
  settings_profile: 'User Profile',
  settings_profile_photo: 'Profile Photo',
  settings_change_photo: 'Change Photo',
  settings_name: 'Name',
  settings_email: 'Email',
  settings_phone: 'Phone',
  settings_not_set: 'Not set',
  settings_preferences: 'General Preferences',
  settings_language: 'Language',
  settings_theme: 'Theme',
  settings_theme_system: 'System',
  settings_theme_light: 'Light',
  settings_theme_dark: 'Dark',
  settings_upcoming_care_days: 'Upcoming Care Window',
  settings_upcoming_care_days_desc: 'Show care items and reminders for the next',
  settings_upcoming_care_days_7: '7 days',
  settings_upcoming_care_days_14: '14 days',
  settings_upcoming_care_days_30: '30 days',
  settings_upcoming_care_days_60: '60 days',
  settings_danger_zone: 'Danger Zone',
  settings_reset_app: 'Reset App',
  settings_reset_desc: 'Delete all data',
  settings_reset_confirm_title: 'Reset App?',
  settings_reset_confirm_message: 'Are you sure? All data will be permanently deleted, including your pets and settings.',
  settings_reset_confirm: 'Reset',
  settings_cancel: 'Cancel',
  settings_save: 'Save',
  settings_edit: 'Edit',
  // Pet Details
  pet_details_title: 'Pet Details',
  pet_details_information: 'Pet Information',
  pet_details_breed: 'Breed',
  pet_details_weight: 'Weight (kg)',
  pet_details_microchip: 'Microchip ID',
  pet_details_allergies: 'Allergies',
  pet_details_veterinarian: 'Veterinarian',
  pet_details_notes: 'Notes',
  pet_details_reminders: 'Reminders',
  pet_details_upcoming_care: 'Upcoming Care',
  pet_details_delete: 'Delete Pet',
  pet_details_delete_confirm: 'Are you sure you want to delete {name}? This action cannot be undone.',
  pet_details_no_reminders: 'No reminders set',
  pet_details_add_reminder: 'Add Reminder',
  pet_details_no_upcoming: 'No upcoming care items',
  pet_details_vet_phone: 'Vet Phone',
  pet_details_enter_breed: 'Enter breed',
  pet_details_enter_weight: 'Enter weight',
  pet_details_enter_microchip: 'Enter microchip ID',
  pet_details_enter_allergies: 'Enter allergies',
  pet_details_enter_vet_name: 'Enter vet name',
  pet_details_enter_phone: 'Enter phone number',
  pet_details_add_notes: 'Add notes',
  pet_details_not_found: 'Pet not found',
  pet_species_dog: 'Dog',
  pet_species_cat: 'Cat',
  pet_species_other: 'Pet',
  // Care Item Management
  care_add_item: 'Add Care Item',
  care_edit_item: 'Edit Care Item',
  care_delete_item: 'Delete Care Item',
  care_delete_confirm: 'Are you sure you want to delete "{title}"?',
  care_pet_label: 'Pet',
  care_type_label: 'Type',
  care_title_label: 'Title',
  care_due_date_label: 'Due Date',
  care_date_label: 'Date',
  care_notes_label: 'Notes (Optional)',
  care_select_pet: 'Select a pet',
  care_select_pets: 'Select Pet(s)',
  care_title_placeholder: 'e.g., Annual vaccination',
  care_notes_placeholder: 'Add any notes...',
  care_reminder_title_placeholder: 'e.g., Give medication',
  care_message_placeholder: 'Additional details...',
  // Care types
  care_vaccine: 'Vaccine',
  care_grooming: 'Grooming',
  care_medication: 'Medication',
  care_vet_visit: 'Vet Visit',
  care_type_vaccine: 'Vaccine',
  care_type_grooming: 'Grooming',
  care_type_medication: 'Medication',
  care_type_vet_visit: 'Vet Visit',
  care_type_general: 'Care',
  // Paywall
  paywall_title: 'Unlock Premium',
  paywall_subtitle: 'Unlimited care for all your pets',
  paywall_limit_reached: 'You\'ve reached the limit of 2 free pets',
  paywall_feature_unlimited: 'Unlimited Pets',
  paywall_feature_unlimited_desc: 'Register all your furry friends',
  paywall_feature_support: 'Priority Support',
  paywall_feature_support_desc: 'Get help when you need it',
  paywall_feature_lifetime: 'Lifetime Access',
  paywall_feature_lifetime_desc: 'Pay once, use forever',
  paywall_buy_button: 'Get Premium',
  paywall_restore: 'Restore Purchases',
  paywall_one_time: 'One-time payment',
  paywall_close: 'Maybe Later',
  paywall_purchase_success: 'Welcome to Premium!',
  paywall_restore_success: 'Purchases restored successfully!',
  paywall_restore_none: 'No previous purchases found',
  paywall_error: 'Something went wrong. Please try again.',
  // Common
  common_today: 'Today',
  common_tomorrow: 'Tomorrow',
  common_yesterday: 'Yesterday',
  common_days_ago: 'days ago',
  common_in_days: 'In {days} days',
  common_soon: 'Soon',
  common_overdue: 'Overdue',
  common_months: 'months',
  common_month: 'month',
  common_years: 'years',
  common_year: 'year',
  common_and: 'and',
  common_less_than_month: 'Less than 1 month',
  common_delete: 'Delete',
  common_edit: 'Edit',
  common_confirm: 'Confirm',
  common_cancel: 'Cancel',
  common_select_language: 'Select Language',
  common_select_theme: 'Select Theme',
  common_system_default: 'System Default',
  common_enter: 'Enter',
  common_saving: 'Saving...',
  common_done: 'Done',
  common_date: 'Date',
  common_time: 'Time',
  common_title: 'Title',
  common_message: 'Message',
  common_message_optional: 'Message (optional)',
  common_date_time: 'Date & Time',
  common_repeat: 'Repeat',
  common_once: 'Once',
  common_daily: 'Daily',
  common_weekly: 'Weekly',
  common_monthly: 'Monthly',
  common_new_reminder: 'New Reminder',
  common_edit_reminder: 'Edit Reminder',
  common_delete_reminder: 'Delete Reminder',
  common_delete_reminder_confirm: 'Are you sure you want to delete this reminder?',
  common_add_reminder: 'Add Reminder',
  common_loading: 'Loading...',
  common_due_date: 'Due Date',
  onboarding_save_pet: 'Save Pet',
  home_no_upcoming_items: 'No upcoming items',
  home_no_upcoming_items_desc: 'Add care items or reminders to keep track of your pets',
  // Settings - Premium
  settings_premium: 'Premium',
  settings_premium_active: 'Premium Active',
  settings_premium_upgrade: 'Upgrade to Premium',
  settings_premium_desc: 'Free plan: {current}/{limit} pets. Upgrade for unlimited pets.',
  settings_premium_desc_active: 'You have unlimited pets and all premium features.',
  settings_premium_badge: 'Active',
  // Settings - Developer
  settings_developer: 'Developer',
  settings_admin_mode: 'Admin Test Mode',
  settings_admin_desc: 'Simulate premium for testing purchases.',
  // Permissions
  permission_camera_title: 'Permission needed',
  permission_camera_message: 'Please allow camera access to take a pet photo.',
  permission_photos_title: 'Permission needed',
  permission_photos_message: 'Please allow access to your photo library to add a pet photo.',
  // Photo actions
  photo_choose_library: 'Choose from Library',
  photo_take_photo: 'Take a Photo',
  // Repeat labels
  repeat_does_not_repeat: 'Does not repeat',
  repeat_every_day: 'Every day',
  repeat_every_week: 'Every week',
  repeat_every_month: 'Every month',
};

const pt: Translations = {
  // Intro Screen
  intro_welcome_title: 'Oi! Bem-vindo ao Caramelo 👋',
  intro_welcome_subtitle: 'Cuide dos seus pets com carinho e organização',
  intro_feature_pets_title: 'Cadastre seus pets',
  intro_feature_pets_desc: 'Todas as informações em um só lugar',
  intro_feature_schedule_title: 'Agende cuidados',
  intro_feature_schedule_desc: 'Vacinas, banhos, consultas e muito mais',
  intro_feature_reminders_title: 'Lembretes inteligentes',
  intro_feature_reminders_desc: 'Nunca esqueça nada importante',
  intro_continue: 'Vamos começar!',
  // Onboarding
  onboarding_step1_title: 'Como se chama seu pet?',
  onboarding_step1_subtitle: 'Vamos começar',
  onboarding_pet_name: 'Nome',
  onboarding_pet_name_placeholder: 'Digite o nome',
  onboarding_pet_name_example: 'Ex: Loki, Fubá, Brownie, Baunilha...',
  onboarding_species: 'Espécie',
  onboarding_species_question: 'Que tipo de pet é?',
  onboarding_add_pet_title: 'Adicione seu pet',
  onboarding_add_pet_subtitle: 'Vamos começar pelo básico',
  onboarding_continue: 'Continuar',
  onboarding_select_birthdate: 'Selecione a data de nascimento',
  onboarding_weight_placeholder: '0,0',
  onboarding_key_info_title: 'Informações principais',
  onboarding_key_info_subtitle: 'Ajude a gente a conhecer {name} melhor',
  onboarding_skip_for_now: 'Pular por enquanto',
  onboarding_species_dog: 'Cachorro',
  onboarding_species_cat: 'Gato',
  onboarding_species_other: 'Outro',
  onboarding_step2_title: 'Adicione uma foto',
  onboarding_step2_subtitle: 'Fica bem mais legal com uma foto',
  onboarding_add_photo: 'Adicionar foto',
  onboarding_change_photo: 'Trocar foto',
  onboarding_skip: 'Pular',
  onboarding_step3_title: 'Informações adicionais',
  onboarding_step3_subtitle: 'Não precisa, mas ajuda',
  onboarding_birthdate: 'Data de nascimento',
  onboarding_weight: 'Peso (kg)',
  onboarding_step4_title: 'Agenda de cuidados',
  onboarding_step4_subtitle: 'Quando são os próximos cuidados?',
  onboarding_add_care: 'Adicionar cuidado',
  onboarding_step5_title: 'Prontinho! 🎉',
  onboarding_step5_subtitle: 'Dá uma conferida nas informações',
  onboarding_finish: 'Bora lá!',
  onboarding_next: 'Próximo',
  onboarding_back: 'Voltar',
  onboarding_review_title: 'Revisar',
  onboarding_review_subtitle: 'Tudo certo?',
  onboarding_review_age: 'Idade',
  onboarding_review_weight: 'Peso',
  onboarding_review_ready_message: '{name} já pode entrar no Caramelo! 🐾',
  // Tabs
  tab_home: 'Início',
  tab_settings: 'Configurações',
  // Home
  home_title: 'Meus pets',
  home_my_pets: 'Meus pets',
  home_your_pets: 'Seus pets',
  home_upcoming_care: 'Próximos cuidados',
  home_add_pet: 'Adicionar pet',
  home_add_pet_desc: 'Cadastre um novo amiguinho',
  home_no_pets: 'Ainda não tem nenhum pet',
  home_no_care: 'Nenhum cuidado agendado',
  home_no_care_desc: 'Acompanhe vacinas, consultas, banhos e muito mais',
  home_add_care_item: 'Adicionar cuidado',
  home_add_care_desc: 'Agende vacinas, consultas e mais',
  home_add_reminder: 'Adicionar lembrete',
  home_add_reminder_desc: 'Configure um lembrete para seu pet',
  home_choose_what_to_add: 'O que você quer adicionar?',
  home_pets_count: '{count} pet(s)',
  home_upcoming_count: '{count} agendados',
  home_premium_badge: 'Premium',
  common_add: 'Adicionar',
  // Settings
  settings_title: 'Configurações',
  settings_profile: 'Perfil do usuário',
  settings_profile_photo: 'Foto de perfil',
  settings_change_photo: 'Alterar foto',
  settings_name: 'Nome',
  settings_email: 'E-mail',
  settings_phone: 'Telefone',
  settings_not_set: 'Não informado',
  settings_preferences: 'Preferências gerais',
  settings_language: 'Idioma',
  settings_theme: 'Tema',
  settings_theme_system: 'Sistema',
  settings_theme_light: 'Claro',
  settings_theme_dark: 'Escuro',
  settings_upcoming_care_days: 'Exibir cuidados dos próximos',
  settings_upcoming_care_days_desc: 'Quantos dias à frente mostrar',
  settings_upcoming_care_days_7: '7 dias',
  settings_upcoming_care_days_14: '14 dias',
  settings_upcoming_care_days_30: '30 dias',
  settings_upcoming_care_days_60: '60 dias',
  settings_danger_zone: 'Zona de perigo',
  settings_reset_app: 'Resetar app',
  settings_reset_desc: 'Apaga tudo',
  settings_reset_confirm_title: 'Resetar app?',
  settings_reset_confirm_message: 'Tem certeza? Isso vai apagar tudo: seus pets, cuidados e configurações. Não dá pra desfazer!',
  settings_reset_confirm: 'Resetar',
  settings_cancel: 'Cancelar',
  settings_save: 'Salvar',
  settings_edit: 'Editar',
  // Pet Details
  pet_details_title: 'Detalhes do pet',
  pet_details_information: 'Informações do pet',
  pet_details_breed: 'Raça',
  pet_details_weight: 'Peso (kg)',
  pet_details_microchip: 'ID do Microchip',
  pet_details_allergies: 'Alergias',
  pet_details_veterinarian: 'Veterinário',
  pet_details_notes: 'Notas',
  pet_details_reminders: 'Lembretes',
  pet_details_upcoming_care: 'Próximos cuidados',
  pet_details_delete: 'Deletar pet',
  pet_details_delete_confirm: 'Quer mesmo deletar {name}? Não dá pra desfazer depois!',
  pet_details_no_reminders: 'Nenhum lembrete configurado',
  pet_details_add_reminder: 'Adicionar lembrete',
  pet_details_no_upcoming: 'Nenhum cuidado agendado',
  pet_details_vet_phone: 'Telefone do Veterinário',
  pet_details_enter_breed: 'Digite a raça',
  pet_details_enter_weight: 'Digite o peso',
  pet_details_enter_microchip: 'Digite o ID do microchip',
  pet_details_enter_allergies: 'Digite as alergias',
  pet_details_enter_vet_name: 'Digite o nome do veterinário',
  pet_details_enter_phone: 'Digite o número de telefone',
  pet_details_add_notes: 'Adicionar notas',
  pet_details_not_found: 'Pet não encontrado',
  pet_species_dog: 'Cachorro',
  pet_species_cat: 'Gato',
  pet_species_other: 'Pet',
  // Care Item Management
  care_add_item: 'Adicionar cuidado',
  care_edit_item: 'Editar cuidado',
  care_delete_item: 'Deletar cuidado',
  care_delete_confirm: 'Tem certeza que deseja deletar "{title}"?',
  care_pet_label: 'Pet',
  care_type_label: 'Tipo',
  care_title_label: 'Título',
  care_due_date_label: 'Data de Vencimento',
  care_date_label: 'Data',
  care_notes_label: 'Notas (Opcional)',
  care_select_pet: 'Selecione um pet',
  care_select_pets: 'Selecione o(s) pet(s)',
  care_title_placeholder: 'Ex: Vacinação anual',
  care_notes_placeholder: 'Adicione notas...',
  care_reminder_title_placeholder: 'Ex: Dar medicação',
  care_message_placeholder: 'Detalhes adicionais...',
  // Care types
  care_vaccine: 'Vacina',
  care_grooming: 'Banho/Tosa',
  care_medication: 'Medicação',
  care_vet_visit: 'Consulta Veterinária',
  care_type_vaccine: 'Vacina',
  care_type_grooming: 'Banho/Tosa',
  care_type_medication: 'Medicação',
  care_type_vet_visit: 'Consulta Veterinária',
  care_type_general: 'Cuidado',
  // Paywall
  paywall_title: 'Desbloqueie o Premium',
  paywall_subtitle: 'Cuidado ilimitado para todos os seus pets',
  paywall_limit_reached: 'Você atingiu o limite de 2 pets gratuitos',
  paywall_feature_unlimited: 'Pets Ilimitados',
  paywall_feature_unlimited_desc: 'Cadastre todos os seus bichinhos',
  paywall_feature_support: 'Suporte Prioritário',
  paywall_feature_support_desc: 'Ajuda quando você precisar',
  paywall_feature_lifetime: 'Acesso Vitalício',
  paywall_feature_lifetime_desc: 'Pague uma vez, use para sempre',
  paywall_buy_button: 'Obter Premium',
  paywall_restore: 'Restaurar Compras',
  paywall_one_time: 'Pagamento único',
  paywall_close: 'Talvez Depois',
  paywall_purchase_success: 'Bem-vindo ao Premium!',
  paywall_restore_success: 'Compras restauradas com sucesso!',
  paywall_restore_none: 'Nenhuma compra anterior encontrada',
  paywall_error: 'Algo deu errado. Tente novamente.',
  // Common
  common_today: 'Hoje',
  common_tomorrow: 'Amanhã',
  common_yesterday: 'Ontem',
  common_days_ago: 'dias atrás',
  common_in_days: 'Em {days} dias',
  common_soon: 'Em breve',
  common_overdue: 'Atrasado',
  common_months: 'meses',
  common_month: 'mês',
  common_years: 'anos',
  common_year: 'ano',
  common_and: 'e',
  common_less_than_month: 'Menos de 1 mês',
  common_delete: 'Excluir',
  common_edit: 'Editar',
  common_confirm: 'Confirmar',
  common_cancel: 'Cancelar',
  common_select_language: 'Selecionar Idioma',
  common_select_theme: 'Selecionar Tema',
  common_system_default: 'Padrão do Sistema',
  common_enter: 'Digite',
  common_saving: 'Salvando...',
  common_done: 'Concluído',
  common_date: 'Data',
  common_time: 'Hora',
  common_title: 'Título',
  common_message: 'Mensagem',
  common_message_optional: 'Mensagem (opcional)',
  common_date_time: 'Data e Hora',
  common_repeat: 'Repetir',
  common_once: 'Uma vez',
  common_daily: 'Diariamente',
  common_weekly: 'Semanalmente',
  common_monthly: 'Mensalmente',
  common_new_reminder: 'Novo lembrete',
  common_edit_reminder: 'Editar lembrete',
  common_delete_reminder: 'Deletar lembrete',
  common_delete_reminder_confirm: 'Tem certeza que deseja deletar este lembrete?',
  common_add_reminder: 'Adicionar lembrete',
  common_loading: 'Carregando...',
  common_due_date: 'Data de Vencimento',
  onboarding_save_pet: 'Salvar pet',
  home_no_upcoming_items: 'Nenhum item agendado',
  home_no_upcoming_items_desc: 'Adicione cuidados ou lembretes para acompanhar seus pets',
  // Settings - Premium
  settings_premium: 'Premium',
  settings_premium_active: 'Premium Ativo',
  settings_premium_upgrade: 'Assinar Premium',
  settings_premium_desc: 'Plano gratuito: {current}/{limit} pets. Assine para pets ilimitados.',
  settings_premium_desc_active: 'Você tem pets ilimitados e todos os recursos premium.',
  settings_premium_badge: 'Ativo',
  // Settings - Developer
  settings_developer: 'Desenvolvedor',
  settings_admin_mode: 'Modo de Teste Admin',
  settings_admin_desc: 'Simular premium para testar compras.',
  // Permissions
  permission_camera_title: 'Permissão necessária',
  permission_camera_message: 'Por favor, permita o acesso à câmera para tirar uma foto do pet.',
  permission_photos_title: 'Permissão necessária',
  permission_photos_message: 'Por favor, permita o acesso à sua biblioteca de fotos para adicionar uma foto do pet.',
  // Photo actions
  photo_choose_library: 'Escolher da biblioteca',
  photo_take_photo: 'Tirar foto',
  // Repeat labels
  repeat_does_not_repeat: 'Não se repete',
  repeat_every_day: 'Todo dia',
  repeat_every_week: 'Toda semana',
  repeat_every_month: 'Todo mês',
};

const es: Translations = {
  // Intro Screen
  intro_welcome_title: 'Bienvenido a Caramelo',
  intro_welcome_subtitle: 'La app completa para cuidar a tus mascotas con amor y organización',
  intro_feature_pets_title: 'Registra tus mascotas',
  intro_feature_pets_desc: 'Mantén toda la información importante en un solo lugar',
  intro_feature_schedule_title: 'Programa cuidados',
  intro_feature_schedule_desc: 'Vacunas, baños, citas y mucho más',
  intro_feature_reminders_title: 'Recordatorios inteligentes',
  intro_feature_reminders_desc: 'Nunca más olvides una cita importante',
  intro_continue: 'Continuar',
  // Onboarding
  onboarding_step1_title: '¿Cómo se llama tu mascota?',
  onboarding_step1_subtitle: 'Empecemos con lo básico',
  onboarding_pet_name: 'Nombre',
  onboarding_pet_name_placeholder: 'Ingresa el nombre',
  onboarding_pet_name_example: 'Ej: Loki, Fubá, Brownie o Baunilha',
  onboarding_species: 'Especie',
  onboarding_species_question: '¿Qué tipo de mascota?',
  onboarding_add_pet_title: 'Agrega Tu Mascota',
  onboarding_add_pet_subtitle: 'Empecemos con lo básico.',
  onboarding_continue: 'Continuar',
  onboarding_select_birthdate: 'Selecciona la fecha de nacimiento',
  onboarding_weight_placeholder: '0,0',
  onboarding_key_info_title: 'Información Clave',
  onboarding_key_info_subtitle: 'Ayúdanos a conocer mejor a {name}.',
  onboarding_skip_for_now: 'Omitir por ahora',
  onboarding_species_dog: 'Perro',
  onboarding_species_cat: 'Gato',
  onboarding_species_other: 'Otro',
  onboarding_step2_title: 'Agrega una foto',
  onboarding_step2_subtitle: 'Una imagen vale más que mil palabras',
  onboarding_add_photo: 'Agregar Foto',
  onboarding_change_photo: 'Cambiar Foto',
  onboarding_skip: 'Omitir',
  onboarding_step3_title: 'Información adicional',
  onboarding_step3_subtitle: 'Opcional pero útil',
  onboarding_birthdate: 'Fecha de nacimiento',
  onboarding_weight: 'Peso (kg)',
  onboarding_step4_title: 'Agenda de cuidados',
  onboarding_step4_subtitle: 'Agrega los próximos cuidados',
  onboarding_add_care: 'Agregar cuidado',
  onboarding_step5_title: '¡Todo listo!',
  onboarding_step5_subtitle: 'Revisa la información de tu mascota',
  onboarding_finish: 'Comenzar',
  onboarding_next: 'Siguiente',
  onboarding_back: 'Atrás',
  onboarding_review_title: 'Revisar',
  onboarding_review_subtitle: '¿Todo bien?',
  onboarding_review_age: 'Edad',
  onboarding_review_weight: 'Peso',
  onboarding_review_ready_message: '¡{name} está listo para ser agregado a Caramelo!',
  // Tabs
  tab_home: 'Inicio',
  tab_settings: 'Ajustes',
  // Home
  home_title: 'Mis Mascotas',
  home_my_pets: 'Mis Mascotas',
  home_your_pets: 'Tus Mascotas',
  home_upcoming_care: 'Próximos Cuidados',
  home_add_pet: 'Agregar Mascota',
  home_add_pet_desc: 'Registra un nuevo amigo peludo',
  home_no_pets: 'Sin mascotas aún',
  home_no_care: 'Sin Cuidados Programados',
  home_no_care_desc: 'Agrega cuidados para llevar un registro de vacunas, citas, baños y más.',
  home_add_care_item: 'Agregar Cuidado',
  home_add_care_desc: 'Programa vacunas, citas y más',
  home_add_reminder: 'Agregar Recordatorio',
  home_add_reminder_desc: 'Configura un recordatorio para tu mascota',
  home_choose_what_to_add: 'Elige qué quieres agregar',
  home_pets_count: '{count} mascota(s)',
  home_upcoming_count: '{count} programados',
  home_premium_badge: 'Premium',
  common_add: 'Agregar',
  // Settings
  settings_title: 'Ajustes',
  settings_profile: 'Perfil de Usuario',
  settings_profile_photo: 'Foto de Perfil',
  settings_change_photo: 'Cambiar Foto',
  settings_name: 'Nombre',
  settings_email: 'Correo',
  settings_phone: 'Teléfono',
  settings_not_set: 'No configurado',
  settings_preferences: 'Preferencias Generales',
  settings_language: 'Idioma',
  settings_theme: 'Tema',
  settings_theme_system: 'Sistema',
  settings_theme_light: 'Claro',
  settings_theme_dark: 'Oscuro',
  settings_upcoming_care_days: 'Ventana de Cuidados',
  settings_upcoming_care_days_desc: 'Mostrar cuidados y recordatorios de los próximos',
  settings_upcoming_care_days_7: '7 días',
  settings_upcoming_care_days_14: '14 días',
  settings_upcoming_care_days_30: '30 días',
  settings_upcoming_care_days_60: '60 días',
  settings_danger_zone: 'Zona de Peligro',
  settings_reset_app: 'Restablecer App',
  settings_reset_desc: 'Elimina todos los datos',
  settings_reset_confirm_title: '¿Restablecer App?',
  settings_reset_confirm_message: '¿Estás seguro? Todos los datos se eliminarán permanentemente, incluyendo tus mascotas y configuraciones.',
  settings_reset_confirm: 'Restablecer',
  settings_cancel: 'Cancelar',
  settings_save: 'Guardar',
  settings_edit: 'Editar',
  // Pet Details
  pet_details_title: 'Detalles de la Mascota',
  pet_details_information: 'Información de la Mascota',
  pet_details_breed: 'Raza',
  pet_details_weight: 'Peso (kg)',
  pet_details_microchip: 'ID del Microchip',
  pet_details_allergies: 'Alergias',
  pet_details_veterinarian: 'Veterinario',
  pet_details_notes: 'Notas',
  pet_details_reminders: 'Recordatorios',
  pet_details_upcoming_care: 'Próximos Cuidados',
  pet_details_delete: 'Eliminar Mascota',
  pet_details_delete_confirm: '¿Estás seguro de que quieres eliminar {name}? Esta acción no se puede deshacer.',
  pet_details_no_reminders: 'Sin recordatorios configurados',
  pet_details_add_reminder: 'Agregar Recordatorio',
  pet_details_no_upcoming: 'Sin cuidados próximos',
  pet_details_vet_phone: 'Teléfono del Veterinario',
  pet_details_enter_breed: 'Ingresa la raza',
  pet_details_enter_weight: 'Ingresa el peso',
  pet_details_enter_microchip: 'Ingresa el ID del microchip',
  pet_details_enter_allergies: 'Ingresa las alergias',
  pet_details_enter_vet_name: 'Ingresa el nombre del veterinario',
  pet_details_enter_phone: 'Ingresa el número de teléfono',
  pet_details_add_notes: 'Agregar notas',
  pet_details_not_found: 'Mascota no encontrada',
  pet_species_dog: 'Perro',
  pet_species_cat: 'Gato',
  pet_species_other: 'Mascota',
  // Care Item Management
  care_add_item: 'Agregar Cuidado',
  care_edit_item: 'Editar Cuidado',
  care_delete_item: 'Eliminar Cuidado',
  care_delete_confirm: '¿Estás seguro de que quieres eliminar "{title}"?',
  care_pet_label: 'Mascota',
  care_type_label: 'Tipo',
  care_title_label: 'Título',
  care_due_date_label: 'Fecha de Vencimiento',
  care_date_label: 'Fecha',
  care_notes_label: 'Notas (Opcional)',
  care_select_pet: 'Selecciona una mascota',
  care_select_pets: 'Selecciona Mascota(s)',
  care_title_placeholder: 'Ej: Vacunación anual',
  care_notes_placeholder: 'Agrega notas...',
  care_reminder_title_placeholder: 'Ej: Dar medicación',
  care_message_placeholder: 'Detalles adicionales...',
  // Care types
  care_vaccine: 'Vacuna',
  care_grooming: 'Baño/Peluquería',
  care_medication: 'Medicación',
  care_vet_visit: 'Visita al Veterinario',
  care_type_vaccine: 'Vacuna',
  care_type_grooming: 'Baño/Peluquería',
  care_type_medication: 'Medicación',
  care_type_vet_visit: 'Visita al Veterinario',
  care_type_general: 'Cuidado',
  // Paywall
  paywall_title: 'Desbloquea Premium',
  paywall_subtitle: 'Cuidado ilimitado para todas tus mascotas',
  paywall_limit_reached: 'Has alcanzado el límite de 2 mascotas gratis',
  paywall_feature_unlimited: 'Mascotas Ilimitadas',
  paywall_feature_unlimited_desc: 'Registra a todos tus peluditos',
  paywall_feature_support: 'Soporte Prioritario',
  paywall_feature_support_desc: 'Ayuda cuando la necesites',
  paywall_feature_lifetime: 'Acceso de Por Vida',
  paywall_feature_lifetime_desc: 'Paga una vez, úsalo siempre',
  paywall_buy_button: 'Obtener Premium',
  paywall_restore: 'Restaurar Compras',
  paywall_one_time: 'Pago único',
  paywall_close: 'Quizás Después',
  paywall_purchase_success: '¡Bienvenido a Premium!',
  paywall_restore_success: '¡Compras restauradas exitosamente!',
  paywall_restore_none: 'No se encontraron compras anteriores',
  paywall_error: 'Algo salió mal. Intenta de nuevo.',
  // Common
  common_today: 'Hoy',
  common_tomorrow: 'Mañana',
  common_yesterday: 'Ayer',
  common_days_ago: 'días atrás',
  common_in_days: 'En {days} días',
  common_soon: 'Pronto',
  common_overdue: 'Vencido',
  common_months: 'meses',
  common_month: 'mes',
  common_years: 'años',
  common_year: 'año',
  common_and: 'y',
  common_less_than_month: 'Menos de 1 mes',
  common_delete: 'Eliminar',
  common_edit: 'Editar',
  common_confirm: 'Confirmar',
  common_cancel: 'Cancelar',
  common_select_language: 'Seleccionar Idioma',
  common_select_theme: 'Seleccionar Tema',
  common_system_default: 'Predeterminado del Sistema',
  common_enter: 'Ingresa',
  common_saving: 'Guardando...',
  common_done: 'Hecho',
  common_date: 'Fecha',
  common_time: 'Hora',
  common_title: 'Título',
  common_message: 'Mensaje',
  common_message_optional: 'Mensaje (opcional)',
  common_date_time: 'Fecha y Hora',
  common_repeat: 'Repetir',
  common_once: 'Una vez',
  common_daily: 'Diariamente',
  common_weekly: 'Semanalmente',
  common_monthly: 'Mensualmente',
  common_new_reminder: 'Nuevo Recordatorio',
  common_edit_reminder: 'Editar Recordatorio',
  common_delete_reminder: 'Eliminar Recordatorio',
  common_delete_reminder_confirm: '¿Estás seguro de que quieres eliminar este recordatorio?',
  common_add_reminder: 'Agregar Recordatorio',
  common_loading: 'Cargando...',
  common_due_date: 'Fecha de Vencimiento',
  onboarding_save_pet: 'Guardar Mascota',
  home_no_upcoming_items: 'Sin items próximos',
  home_no_upcoming_items_desc: 'Agrega cuidados o recordatorios para llevar un registro de tus mascotas',
  // Settings - Premium
  settings_premium: 'Premium',
  settings_premium_active: 'Premium Activo',
  settings_premium_upgrade: 'Actualizar a Premium',
  settings_premium_desc: 'Plan gratuito: {current}/{limit} mascotas. Actualiza para ilimitadas.',
  settings_premium_desc_active: 'Tienes mascotas ilimitadas y todas las funciones premium.',
  settings_premium_badge: 'Activo',
  // Settings - Developer
  settings_developer: 'Desarrollador',
  settings_admin_mode: 'Modo Admin de Prueba',
  settings_admin_desc: 'Simular premium para probar compras.',
  // Permissions
  permission_camera_title: 'Permiso necesario',
  permission_camera_message: 'Por favor, permite el acceso a la cámara para tomar una foto de la mascota.',
  permission_photos_title: 'Permiso necesario',
  permission_photos_message: 'Por favor, permite el acceso a tu biblioteca de fotos para agregar una foto de la mascota.',
  // Photo actions
  photo_choose_library: 'Elegir de la Biblioteca',
  photo_take_photo: 'Tomar una Foto',
  // Repeat labels
  repeat_does_not_repeat: 'No se repite',
  repeat_every_day: 'Todos los días',
  repeat_every_week: 'Cada semana',
  repeat_every_month: 'Cada mes',
};



export const translations: Record<Exclude<SupportedLanguage, 'system'>, Translations> = {
  en,
  pt,
  es,
};

export type { TranslationKey };
