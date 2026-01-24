// Translations for Caramelo app
// Supports: English (en), Portuguese (pt), Spanish (es), French (fr), Chinese Simplified (zh)

export type SupportedLanguage = 'system' | 'en' | 'pt' | 'es' | 'fr' | 'zh';

export const languageNames: Record<SupportedLanguage, string> = {
  system: 'System Default',
  en: 'English',
  pt: 'Português',
  es: 'Español',
  fr: 'Français',
  zh: '中文',
};

export const languageFlags: Record<SupportedLanguage, string> = {
  system: '🌐',
  en: '🇺🇸',
  pt: '🇧🇷',
  es: '🇪🇸',
  fr: '🇫🇷',
  zh: '🇨🇳',
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
  | 'photo_take_photo';

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
  onboarding_pet_name_example: 'e.g., Max, Luna, Buddy',
  onboarding_species: 'Species',
  onboarding_species_question: 'What type of pet?',
  onboarding_add_pet_title: 'Add Your Pet',
  onboarding_add_pet_subtitle: "Let's start with the basics.",
  onboarding_continue: 'Continue',
  onboarding_select_birthdate: 'Select birthdate',
  onboarding_weight_placeholder: '0.0',
  onboarding_key_info_title: 'Key Info',
  onboarding_key_info_subtitle: 'Help us know {name} better. All optional.',
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
};

const pt: Translations = {
  // Intro Screen
  intro_welcome_title: 'Bem-vindo ao Caramelo',
  intro_welcome_subtitle: 'O app completo para cuidar dos seus pets com carinho e organização',
  intro_feature_pets_title: 'Cadastre seus pets',
  intro_feature_pets_desc: 'Mantenha todas as informações importantes em um só lugar',
  intro_feature_schedule_title: 'Agende cuidados',
  intro_feature_schedule_desc: 'Vacinas, banhos, consultas e muito mais',
  intro_feature_reminders_title: 'Lembretes inteligentes',
  intro_feature_reminders_desc: 'Nunca mais esqueça um compromisso importante',
  intro_continue: 'Continuar',
  // Onboarding
  onboarding_step1_title: 'Qual o nome do seu pet?',
  onboarding_step1_subtitle: 'Vamos começar com o básico',
  onboarding_pet_name: 'Nome',
  onboarding_pet_name_placeholder: 'Digite o nome',
  onboarding_pet_name_example: 'Ex: Max, Luna, Buddy',
  onboarding_species: 'Espécie',
  onboarding_species_question: 'Que tipo de pet?',
  onboarding_add_pet_title: 'Adicione Seu Pet',
  onboarding_add_pet_subtitle: 'Vamos começar com o básico.',
  onboarding_continue: 'Continuar',
  onboarding_select_birthdate: 'Selecione a data de nascimento',
  onboarding_weight_placeholder: '0,0',
  onboarding_key_info_title: 'Informações Principais',
  onboarding_key_info_subtitle: 'Ajude-nos a conhecer {name} melhor. Tudo opcional.',
  onboarding_skip_for_now: 'Pular por enquanto',
  onboarding_species_dog: 'Cachorro',
  onboarding_species_cat: 'Gato',
  onboarding_species_other: 'Outro',
  onboarding_step2_title: 'Adicione uma foto',
  onboarding_step2_subtitle: 'Uma imagem vale mais que mil palavras',
  onboarding_add_photo: 'Adicionar Foto',
  onboarding_change_photo: 'Trocar Foto',
  onboarding_skip: 'Pular',
  onboarding_step3_title: 'Informações adicionais',
  onboarding_step3_subtitle: 'Opcional, mas útil',
  onboarding_birthdate: 'Data de nascimento',
  onboarding_weight: 'Peso (kg)',
  onboarding_step4_title: 'Agenda de cuidados',
  onboarding_step4_subtitle: 'Adicione os próximos cuidados',
  onboarding_add_care: 'Adicionar cuidado',
  onboarding_step5_title: 'Tudo pronto!',
  onboarding_step5_subtitle: 'Revise as informações do seu pet',
  onboarding_finish: 'Começar a usar',
  onboarding_next: 'Próximo',
  onboarding_back: 'Voltar',
  // Tabs
  tab_home: 'Início',
  tab_settings: 'Configurações',
  // Home
  home_title: 'Meus Pets',
  home_my_pets: 'Meus Pets',
  home_your_pets: 'Seus Pets',
  home_upcoming_care: 'Próximos Cuidados',
  home_add_pet: 'Adicionar Pet',
  home_add_pet_desc: 'Cadastre um novo amiguinho',
  home_no_pets: 'Nenhum pet ainda',
  home_no_care: 'Nenhum Cuidado Agendado',
  home_no_care_desc: 'Adicione cuidados para acompanhar vacinas, consultas, banhos e mais.',
  home_add_care_item: 'Adicionar Cuidado',
  home_add_care_desc: 'Agende vacinas, consultas e mais',
  home_pets_count: '{count} pet(s)',
  home_upcoming_count: '{count} agendados',
  home_premium_badge: 'Premium',
  common_add: 'Adicionar',
  // Settings
  settings_title: 'Configurações',
  settings_profile: 'Perfil do Usuário',
  settings_profile_photo: 'Foto de Perfil',
  settings_change_photo: 'Alterar Foto',
  settings_name: 'Nome',
  settings_email: 'E-mail',
  settings_phone: 'Telefone',
  settings_not_set: 'Não informado',
  settings_preferences: 'Preferências Gerais',
  settings_language: 'Idioma',
  settings_theme: 'Tema',
  settings_theme_system: 'Sistema',
  settings_theme_light: 'Claro',
  settings_theme_dark: 'Escuro',
  settings_danger_zone: 'Zona de Perigo',
  settings_reset_app: 'Resetar App',
  settings_reset_desc: 'Apaga todos os dados',
  settings_reset_confirm_title: 'Resetar App?',
  settings_reset_confirm_message: 'Tem certeza? Todos os dados serão apagados permanentemente, incluindo seus pets e configurações.',
  settings_reset_confirm: 'Resetar',
  settings_cancel: 'Cancelar',
  settings_save: 'Salvar',
  settings_edit: 'Editar',
  // Pet Details
  pet_details_title: 'Detalhes do Pet',
  pet_details_information: 'Informações do Pet',
  pet_details_breed: 'Raça',
  pet_details_weight: 'Peso (kg)',
  pet_details_microchip: 'ID do Microchip',
  pet_details_allergies: 'Alergias',
  pet_details_veterinarian: 'Veterinário',
  pet_details_notes: 'Notas',
  pet_details_reminders: 'Lembretes',
  pet_details_upcoming_care: 'Próximos Cuidados',
  pet_details_delete: 'Deletar Pet',
  pet_details_delete_confirm: 'Tem certeza que deseja deletar {name}? Esta ação não pode ser desfeita.',
  pet_details_no_reminders: 'Nenhum lembrete configurado',
  pet_details_add_reminder: 'Adicionar Lembrete',
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
  care_add_item: 'Adicionar Cuidado',
  care_edit_item: 'Editar Cuidado',
  care_delete_item: 'Deletar Cuidado',
  care_delete_confirm: 'Tem certeza que deseja deletar "{title}"?',
  care_pet_label: 'Pet',
  care_type_label: 'Tipo',
  care_title_label: 'Título',
  care_due_date_label: 'Data de Vencimento',
  care_notes_label: 'Notas (Opcional)',
  care_select_pet: 'Selecione um pet',
  care_select_pets: 'Selecione Pet(s)',
  care_title_placeholder: 'Ex: Vacinação anual',
  care_notes_placeholder: 'Adicione notas...',
  care_reminder_title_placeholder: 'Ex: Dar medicação',
  care_message_placeholder: 'Detalhes adicionais...',
  // Care types
  care_vaccine: 'Vacina',
  care_grooming: 'Banho/Tosa',
  care_medication: 'Medicação',
  care_vet_visit: 'Consulta Veterinária',
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
  common_new_reminder: 'Novo Lembrete',
  common_edit_reminder: 'Editar Lembrete',
  common_delete_reminder: 'Deletar Lembrete',
  common_delete_reminder_confirm: 'Tem certeza que deseja deletar este lembrete?',
  common_add_reminder: 'Adicionar Lembrete',
  common_loading: 'Carregando...',
  common_due_date: 'Data de Vencimento',
  onboarding_save_pet: 'Salvar Pet',
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
  photo_choose_library: 'Escolher da Biblioteca',
  photo_take_photo: 'Tirar Foto',
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
  onboarding_pet_name_example: 'Ej: Max, Luna, Buddy',
  onboarding_species: 'Especie',
  onboarding_species_question: '¿Qué tipo de mascota?',
  onboarding_add_pet_title: 'Agrega Tu Mascota',
  onboarding_add_pet_subtitle: 'Empecemos con lo básico.',
  onboarding_continue: 'Continuar',
  onboarding_select_birthdate: 'Selecciona la fecha de nacimiento',
  onboarding_weight_placeholder: '0,0',
  onboarding_key_info_title: 'Información Clave',
  onboarding_key_info_subtitle: 'Ayúdanos a conocer mejor a {name}. Todo opcional.',
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
};

const fr: Translations = {
  // Intro Screen
  intro_welcome_title: 'Bienvenue sur Caramelo',
  intro_welcome_subtitle: "L'app complète pour prendre soin de vos animaux avec amour et organisation",
  intro_feature_pets_title: 'Enregistrez vos animaux',
  intro_feature_pets_desc: 'Gardez toutes les informations importantes au même endroit',
  intro_feature_schedule_title: 'Planifiez les soins',
  intro_feature_schedule_desc: 'Vaccins, toilettage, rendez-vous et plus encore',
  intro_feature_reminders_title: 'Rappels intelligents',
  intro_feature_reminders_desc: "N'oubliez plus jamais un rendez-vous important",
  intro_continue: 'Continuer',
  // Onboarding
  onboarding_step1_title: 'Comment s\'appelle votre animal?',
  onboarding_step1_subtitle: 'Commençons par les bases',
  onboarding_pet_name: 'Nom',
  onboarding_pet_name_placeholder: 'Entrez le nom',
  onboarding_pet_name_example: 'Ex: Max, Luna, Buddy',
  onboarding_species: 'Espèce',
  onboarding_species_question: 'Quel type d\'animal?',
  onboarding_add_pet_title: 'Ajoutez Votre Animal',
  onboarding_add_pet_subtitle: 'Commençons par les bases.',
  onboarding_continue: 'Continuer',
  onboarding_select_birthdate: 'Sélectionnez la date de naissance',
  onboarding_weight_placeholder: '0,0',
  onboarding_key_info_title: 'Informations Clés',
  onboarding_key_info_subtitle: 'Aidez-nous à mieux connaître {name}. Tout est optionnel.',
  onboarding_skip_for_now: 'Passer pour l\'instant',
  onboarding_species_dog: 'Chien',
  onboarding_species_cat: 'Chat',
  onboarding_species_other: 'Autre',
  onboarding_step2_title: 'Ajoutez une photo',
  onboarding_step2_subtitle: 'Une image vaut mille mots',
  onboarding_add_photo: 'Ajouter Photo',
  onboarding_change_photo: 'Changer Photo',
  onboarding_skip: 'Passer',
  onboarding_step3_title: 'Informations supplémentaires',
  onboarding_step3_subtitle: 'Optionnel mais utile',
  onboarding_birthdate: 'Date de naissance',
  onboarding_weight: 'Poids (kg)',
  onboarding_step4_title: 'Calendrier des soins',
  onboarding_step4_subtitle: 'Ajoutez les prochains soins',
  onboarding_add_care: 'Ajouter un soin',
  onboarding_step5_title: 'Tout est prêt!',
  onboarding_step5_subtitle: 'Vérifiez les infos de votre animal',
  onboarding_finish: 'Commencer',
  onboarding_next: 'Suivant',
  onboarding_back: 'Retour',
  // Tabs
  tab_home: 'Accueil',
  tab_settings: 'Paramètres',
  // Home
  home_title: 'Mes Animaux',
  home_my_pets: 'Mes Animaux',
  home_your_pets: 'Vos Animaux',
  home_upcoming_care: 'Soins à Venir',
  home_add_pet: 'Ajouter Animal',
  home_add_pet_desc: 'Enregistrer un nouvel ami à poils',
  home_no_pets: 'Pas encore d\'animaux',
  home_no_care: 'Aucun Soin Prévu',
  home_no_care_desc: 'Ajoutez des soins pour suivre les vaccins, visites vétérinaires, toilettage et plus.',
  home_add_care_item: 'Ajouter un Soin',
  home_add_care_desc: 'Planifier vaccins, visites et plus',
  home_pets_count: '{count} animal(aux)',
  home_upcoming_count: '{count} à venir',
  home_premium_badge: 'Premium',
  common_add: 'Ajouter',
  // Settings
  settings_title: 'Paramètres',
  settings_profile: 'Profil Utilisateur',
  settings_profile_photo: 'Photo de Profil',
  settings_change_photo: 'Changer Photo',
  settings_name: 'Nom',
  settings_email: 'E-mail',
  settings_phone: 'Téléphone',
  settings_not_set: 'Non défini',
  settings_preferences: 'Préférences Générales',
  settings_language: 'Langue',
  settings_theme: 'Thème',
  settings_theme_system: 'Système',
  settings_theme_light: 'Clair',
  settings_theme_dark: 'Sombre',
  settings_danger_zone: 'Zone de Danger',
  settings_reset_app: 'Réinitialiser l\'App',
  settings_reset_desc: 'Supprime toutes les données',
  settings_reset_confirm_title: 'Réinitialiser l\'App?',
  settings_reset_confirm_message: 'Êtes-vous sûr? Toutes les données seront supprimées définitivement, y compris vos animaux et paramètres.',
  settings_reset_confirm: 'Réinitialiser',
  settings_cancel: 'Annuler',
  settings_save: 'Enregistrer',
  settings_edit: 'Modifier',
  // Pet Details
  pet_details_title: 'Détails de l\'Animal',
  pet_details_information: 'Informations de l\'Animal',
  pet_details_breed: 'Race',
  pet_details_weight: 'Poids (kg)',
  pet_details_microchip: 'ID Microchip',
  pet_details_allergies: 'Allergies',
  pet_details_veterinarian: 'Vétérinaire',
  pet_details_notes: 'Notes',
  pet_details_reminders: 'Rappels',
  pet_details_upcoming_care: 'Soins à Venir',
  pet_details_delete: 'Supprimer l\'Animal',
  pet_details_delete_confirm: 'Êtes-vous sûr de vouloir supprimer {name}? Cette action ne peut pas être annulée.',
  pet_details_no_reminders: 'Aucun rappel configuré',
  pet_details_add_reminder: 'Ajouter un Rappel',
  pet_details_no_upcoming: 'Aucun soin à venir',
  pet_details_vet_phone: 'Téléphone du Vétérinaire',
  pet_details_enter_breed: 'Entrez la race',
  pet_details_enter_weight: 'Entrez le poids',
  pet_details_enter_microchip: 'Entrez l\'ID de la puce',
  pet_details_enter_allergies: 'Entrez les allergies',
  pet_details_enter_vet_name: 'Entrez le nom du vétérinaire',
  pet_details_enter_phone: 'Entrez le numéro de téléphone',
  pet_details_add_notes: 'Ajouter des notes',
  pet_details_not_found: 'Animal non trouvé',
  pet_species_dog: 'Chien',
  pet_species_cat: 'Chat',
  pet_species_other: 'Animal',
  // Care Item Management
  care_add_item: 'Ajouter un Soin',
  care_edit_item: 'Modifier le Soin',
  care_delete_item: 'Supprimer le Soin',
  care_delete_confirm: 'Êtes-vous sûr de vouloir supprimer "{title}"?',
  care_pet_label: 'Animal',
  care_type_label: 'Type',
  care_title_label: 'Titre',
  care_due_date_label: 'Date d\'Expiration',
  care_notes_label: 'Notes (Optionnel)',
  care_select_pet: 'Sélectionnez un animal',
  care_select_pets: 'Sélectionnez Animal(s)',
  care_title_placeholder: 'Ex: Vaccination annuelle',
  care_notes_placeholder: 'Ajoutez des notes...',
  care_reminder_title_placeholder: 'Ex: Donner un médicament',
  care_message_placeholder: 'Détails supplémentaires...',
  // Care types
  care_vaccine: 'Vaccin',
  care_grooming: 'Toilettage',
  care_medication: 'Médicament',
  care_vet_visit: 'Visite Vétérinaire',
  // Paywall
  paywall_title: 'Débloquez Premium',
  paywall_subtitle: 'Soins illimités pour tous vos animaux',
  paywall_limit_reached: 'Vous avez atteint la limite de 2 animaux gratuits',
  paywall_feature_unlimited: 'Animaux Illimités',
  paywall_feature_unlimited_desc: 'Enregistrez tous vos compagnons',
  paywall_feature_support: 'Support Prioritaire',
  paywall_feature_support_desc: 'De l\'aide quand vous en avez besoin',
  paywall_feature_lifetime: 'Accès à Vie',
  paywall_feature_lifetime_desc: 'Payez une fois, utilisez pour toujours',
  paywall_buy_button: 'Obtenir Premium',
  paywall_restore: 'Restaurer les Achats',
  paywall_one_time: 'Paiement unique',
  paywall_close: 'Peut-être Plus Tard',
  paywall_purchase_success: 'Bienvenue dans Premium!',
  paywall_restore_success: 'Achats restaurés avec succès!',
  paywall_restore_none: 'Aucun achat précédent trouvé',
  paywall_error: 'Quelque chose s\'est mal passé. Réessayez.',
  // Common
  common_today: 'Aujourd\'hui',
  common_tomorrow: 'Demain',
  common_yesterday: 'Hier',
  common_days_ago: 'jours passés',
  common_in_days: 'Dans {days} jours',
  common_delete: 'Supprimer',
  common_edit: 'Modifier',
  common_confirm: 'Confirmer',
  common_cancel: 'Annuler',
  common_select_language: 'Sélectionner la Langue',
  common_select_theme: 'Sélectionner le Thème',
  common_system_default: 'Par Défaut du Système',
  common_enter: 'Entrez',
  common_saving: 'Enregistrement...',
  common_done: 'Terminé',
  common_date: 'Date',
  common_time: 'Heure',
  common_title: 'Titre',
  common_message: 'Message',
  common_message_optional: 'Message (optionnel)',
  common_date_time: 'Date et Heure',
  common_repeat: 'Répéter',
  common_once: 'Une fois',
  common_new_reminder: 'Nouveau Rappel',
  common_edit_reminder: 'Modifier le Rappel',
  common_delete_reminder: 'Supprimer le Rappel',
  common_delete_reminder_confirm: 'Êtes-vous sûr de vouloir supprimer ce rappel?',
  common_add_reminder: 'Ajouter un Rappel',
  common_loading: 'Chargement...',
  common_due_date: 'Date d\'Expiration',
  onboarding_save_pet: 'Enregistrer l\'Animal',
  home_no_upcoming_items: 'Aucun élément à venir',
  home_no_upcoming_items_desc: 'Ajoutez des soins ou des rappels pour suivre vos animaux',
  // Settings - Premium
  settings_premium: 'Premium',
  settings_premium_active: 'Premium Actif',
  settings_premium_upgrade: 'Passer à Premium',
  settings_premium_desc: 'Plan gratuit: {current}/{limit} animaux. Passez pour illimité.',
  settings_premium_desc_active: 'Vous avez des animaux illimités et toutes les fonctionnalités premium.',
  settings_premium_badge: 'Actif',
  // Settings - Developer
  settings_developer: 'Développeur',
  settings_admin_mode: 'Mode Admin Test',
  settings_admin_desc: 'Simuler premium pour tester les achats.',
  // Permissions
  permission_camera_title: 'Permission nécessaire',
  permission_camera_message: 'Veuillez autoriser l\'accès à la caméra pour prendre une photo de l\'animal.',
  permission_photos_title: 'Permission nécessaire',
  permission_photos_message: 'Veuillez autoriser l\'accès à votre bibliothèque de photos pour ajouter une photo de l\'animal.',
  // Photo actions
  photo_choose_library: 'Choisir dans la Bibliothèque',
  photo_take_photo: 'Prendre une Photo',
};

const zh: Translations = {
  // Intro Screen
  intro_welcome_title: '欢迎使用 Caramelo',
  intro_welcome_subtitle: '全方位宠物护理应用，让您用爱与条理照顾您的宠物',
  intro_feature_pets_title: '注册您的宠物',
  intro_feature_pets_desc: '将所有重要信息保存在一个地方',
  intro_feature_schedule_title: '安排护理',
  intro_feature_schedule_desc: '疫苗、美容、预约等等',
  intro_feature_reminders_title: '智能提醒',
  intro_feature_reminders_desc: '再也不会忘记重要的预约',
  intro_continue: '继续',
  // Onboarding
  onboarding_step1_title: '您的宠物叫什么名字？',
  onboarding_step1_subtitle: '让我们从基本信息开始',
  onboarding_pet_name: '名字',
  onboarding_pet_name_placeholder: '输入名字',
  onboarding_pet_name_example: '例如：Max, Luna, Buddy',
  onboarding_species: '种类',
  onboarding_species_question: '什么类型的宠物？',
  onboarding_add_pet_title: '添加您的宠物',
  onboarding_add_pet_subtitle: '让我们从基本信息开始。',
  onboarding_continue: '继续',
  onboarding_select_birthdate: '选择出生日期',
  onboarding_weight_placeholder: '0.0',
  onboarding_key_info_title: '关键信息',
  onboarding_key_info_subtitle: '帮助我们更好地了解{name}。所有信息都是可选的。',
  onboarding_skip_for_now: '暂时跳过',
  onboarding_species_dog: '狗',
  onboarding_species_cat: '猫',
  onboarding_species_other: '其他',
  onboarding_step2_title: '添加照片',
  onboarding_step2_subtitle: '一张照片胜过千言万语',
  onboarding_add_photo: '添加照片',
  onboarding_change_photo: '更换照片',
  onboarding_skip: '跳过',
  onboarding_step3_title: '附加信息',
  onboarding_step3_subtitle: '可选但有帮助',
  onboarding_birthdate: '出生日期',
  onboarding_weight: '体重（公斤）',
  onboarding_step4_title: '护理日程',
  onboarding_step4_subtitle: '添加即将到来的护理项目',
  onboarding_add_care: '添加护理项目',
  onboarding_step5_title: '一切就绪！',
  onboarding_step5_subtitle: '查看您的宠物信息',
  onboarding_finish: '开始使用',
  onboarding_next: '下一步',
  onboarding_back: '返回',
  // Tabs
  tab_home: '首页',
  tab_settings: '设置',
  // Home
  home_title: '我的宠物',
  home_my_pets: '我的宠物',
  home_your_pets: '您的宠物',
  home_upcoming_care: '即将到来的护理',
  home_add_pet: '添加宠物',
  home_add_pet_desc: '注册一个新的毛茸茸的朋友',
  home_no_pets: '还没有宠物',
  home_no_care: '没有安排的护理',
  home_no_care_desc: '添加护理项目来追踪疫苗、兽医就诊、美容等。',
  home_add_care_item: '添加护理项目',
  home_add_care_desc: '安排疫苗、就诊等',
  home_pets_count: '{count}只宠物',
  home_upcoming_count: '{count}项待办',
  home_premium_badge: '高级版',
  common_add: '添加',
  // Settings
  settings_title: '设置',
  settings_profile: '用户资料',
  settings_profile_photo: '头像',
  settings_change_photo: '更换照片',
  settings_name: '姓名',
  settings_email: '邮箱',
  settings_phone: '电话',
  settings_not_set: '未设置',
  settings_preferences: '通用偏好',
  settings_language: '语言',
  settings_theme: '主题',
  settings_theme_system: '跟随系统',
  settings_theme_light: '浅色',
  settings_theme_dark: '深色',
  settings_danger_zone: '危险区域',
  settings_reset_app: '重置应用',
  settings_reset_desc: '删除所有数据',
  settings_reset_confirm_title: '重置应用？',
  settings_reset_confirm_message: '您确定吗？所有数据将被永久删除，包括您的宠物和设置。',
  settings_reset_confirm: '重置',
  settings_cancel: '取消',
  settings_save: '保存',
  settings_edit: '编辑',
  // Pet Details
  pet_details_title: '宠物详情',
  pet_details_information: '宠物信息',
  pet_details_breed: '品种',
  pet_details_weight: '体重 (kg)',
  pet_details_microchip: '芯片ID',
  pet_details_allergies: '过敏症',
  pet_details_veterinarian: '兽医',
  pet_details_notes: '备注',
  pet_details_reminders: '提醒',
  pet_details_upcoming_care: '即将护理',
  pet_details_delete: '删除宠物',
  pet_details_delete_confirm: '您确定要删除{name}吗？此操作无法撤销。',
  pet_details_no_reminders: '未设置提醒',
  pet_details_add_reminder: '添加提醒',
  pet_details_no_upcoming: '无即将护理项目',
  pet_details_vet_phone: '兽医电话',
  pet_details_enter_breed: '输入品种',
  pet_details_enter_weight: '输入体重',
  pet_details_enter_microchip: '输入芯片ID',
  pet_details_enter_allergies: '输入过敏症',
  pet_details_enter_vet_name: '输入兽医姓名',
  pet_details_enter_phone: '输入电话号码',
  pet_details_add_notes: '添加备注',
  pet_details_not_found: '未找到宠物',
  pet_species_dog: '狗',
  pet_species_cat: '猫',
  pet_species_other: '宠物',
  // Care Item Management
  care_add_item: '添加护理',
  care_edit_item: '编辑护理',
  care_delete_item: '删除护理',
  care_delete_confirm: '您确定要删除"{title}"吗？',
  care_pet_label: '宠物',
  care_type_label: '类型',
  care_title_label: '标题',
  care_due_date_label: '截止日期',
  care_notes_label: '备注（可选）',
  care_select_pet: '选择一个宠物',
  care_select_pets: '选择宠物',
  care_title_placeholder: '例如：年度接种',
  care_notes_placeholder: '添加备注...',
  care_reminder_title_placeholder: '例如：给药',
  care_message_placeholder: '其他详细信息...',
  // Care types
  care_vaccine: '疫苗',
  care_grooming: '美容',
  care_medication: '药物',
  care_vet_visit: '兽医就诊',
  // Paywall
  paywall_title: '解锁高级版',
  paywall_subtitle: '为您所有宠物提供无限护理',
  paywall_limit_reached: '您已达到2只免费宠物的限制',
  paywall_feature_unlimited: '无限宠物',
  paywall_feature_unlimited_desc: '注册您所有的毛茸茸的朋友',
  paywall_feature_support: '优先支持',
  paywall_feature_support_desc: '需要时获得帮助',
  paywall_feature_lifetime: '终身访问',
  paywall_feature_lifetime_desc: '一次付费，永久使用',
  paywall_buy_button: '获取高级版',
  paywall_restore: '恢复购买',
  paywall_one_time: '一次性付款',
  paywall_close: '以后再说',
  paywall_purchase_success: '欢迎使用高级版！',
  paywall_restore_success: '购买恢复成功！',
  paywall_restore_none: '未找到之前的购买记录',
  paywall_error: '出了点问题，请重试。',
  // Common
  common_today: '今天',
  common_tomorrow: '明天',
  common_yesterday: '昨天',
  common_days_ago: '天前',
  common_in_days: '{days}天后',
  common_delete: '删除',
  common_edit: '编辑',
  common_confirm: '确认',
  common_cancel: '取消',
  common_select_language: '选择语言',
  common_select_theme: '选择主题',
  common_system_default: '跟随系统',
  common_enter: '输入',
  common_saving: '保存中...',
  common_done: '完成',
  common_date: '日期',
  common_time: '时间',
  common_title: '标题',
  common_message: '消息',
  common_message_optional: '消息（可选）',
  common_date_time: '日期和时间',
  common_repeat: '重复',
  common_once: '一次',
  common_new_reminder: '新提醒',
  common_edit_reminder: '编辑提醒',
  common_delete_reminder: '删除提醒',
  common_delete_reminder_confirm: '您确定要删除此提醒吗？',
  common_add_reminder: '添加提醒',
  common_loading: '加载中...',
  common_due_date: '截止日期',
  onboarding_save_pet: '保存宠物',
  home_no_upcoming_items: '无即将到来的项目',
  home_no_upcoming_items_desc: '添加护理项目或提醒来追踪您的宠物',
  // Settings - Premium
  settings_premium: '高级版',
  settings_premium_active: '高级版已激活',
  settings_premium_upgrade: '升级到高级版',
  settings_premium_desc: '免费版：{current}/{limit} 个宠物。升级获得无限宠物。',
  settings_premium_desc_active: '您拥有无限宠物和所有高级功能。',
  settings_premium_badge: '已激活',
  // Settings - Developer
  settings_developer: '开发者',
  settings_admin_mode: '管理员测试模式',
  settings_admin_desc: '模拟高级版以测试购买。',
  // Permissions
  permission_camera_title: '需要权限',
  permission_camera_message: '请允许访问相机以拍摄宠物照片。',
  permission_photos_title: '需要权限',
  permission_photos_message: '请允许访问您的照片库以添加宠物照片。',
  // Photo actions
  photo_choose_library: '从图库选择',
  photo_take_photo: '拍照',
};

export const translations: Record<Exclude<SupportedLanguage, 'system'>, Translations> = {
  en,
  pt,
  es,
  fr,
  zh,
};

export type { TranslationKey };
