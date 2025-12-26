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
  | 'onboarding_species'
  | 'onboarding_species_dog'
  | 'onboarding_species_cat'
  | 'onboarding_species_other'
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
  | 'home_upcoming_care'
  | 'home_add_pet'
  | 'home_no_pets'
  | 'home_no_care'
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
  // Care types
  | 'care_vaccine'
  | 'care_grooming'
  | 'care_medication'
  | 'care_vet_visit'
  // Common
  | 'common_today'
  | 'common_tomorrow'
  | 'common_yesterday'
  | 'common_days_ago'
  | 'common_in_days'
  | 'common_delete'
  | 'common_edit'
  | 'common_confirm'
  | 'common_select_language';

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
  onboarding_species: 'Species',
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
  home_upcoming_care: 'Upcoming Care',
  home_add_pet: 'Add Pet',
  home_no_pets: 'No pets yet',
  home_no_care: 'No upcoming care items',
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
  // Care types
  care_vaccine: 'Vaccine',
  care_grooming: 'Grooming',
  care_medication: 'Medication',
  care_vet_visit: 'Vet Visit',
  // Common
  common_today: 'Today',
  common_tomorrow: 'Tomorrow',
  common_yesterday: 'Yesterday',
  common_days_ago: 'days ago',
  common_in_days: 'In {days} days',
  common_delete: 'Delete',
  common_edit: 'Edit',
  common_confirm: 'Confirm',
  common_select_language: 'Select Language',
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
  onboarding_species: 'Espécie',
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
  home_upcoming_care: 'Próximos Cuidados',
  home_add_pet: 'Adicionar Pet',
  home_no_pets: 'Nenhum pet ainda',
  home_no_care: 'Nenhum cuidado agendado',
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
  // Care types
  care_vaccine: 'Vacina',
  care_grooming: 'Banho/Tosa',
  care_medication: 'Medicação',
  care_vet_visit: 'Consulta Veterinária',
  // Common
  common_today: 'Hoje',
  common_tomorrow: 'Amanhã',
  common_yesterday: 'Ontem',
  common_days_ago: 'dias atrás',
  common_in_days: 'Em {days} dias',
  common_delete: 'Excluir',
  common_edit: 'Editar',
  common_confirm: 'Confirmar',
  common_select_language: 'Selecionar Idioma',
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
  onboarding_species: 'Especie',
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
  home_upcoming_care: 'Próximos Cuidados',
  home_add_pet: 'Agregar Mascota',
  home_no_pets: 'Sin mascotas aún',
  home_no_care: 'Sin cuidados programados',
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
  // Care types
  care_vaccine: 'Vacuna',
  care_grooming: 'Baño/Peluquería',
  care_medication: 'Medicación',
  care_vet_visit: 'Visita al Veterinario',
  // Common
  common_today: 'Hoy',
  common_tomorrow: 'Mañana',
  common_yesterday: 'Ayer',
  common_days_ago: 'días atrás',
  common_in_days: 'En {days} días',
  common_delete: 'Eliminar',
  common_edit: 'Editar',
  common_confirm: 'Confirmar',
  common_select_language: 'Seleccionar Idioma',
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
  onboarding_species: 'Espèce',
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
  home_upcoming_care: 'Soins à Venir',
  home_add_pet: 'Ajouter Animal',
  home_no_pets: 'Pas encore d\'animaux',
  home_no_care: 'Aucun soin prévu',
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
  // Care types
  care_vaccine: 'Vaccin',
  care_grooming: 'Toilettage',
  care_medication: 'Médicament',
  care_vet_visit: 'Visite Vétérinaire',
  // Common
  common_today: 'Aujourd\'hui',
  common_tomorrow: 'Demain',
  common_yesterday: 'Hier',
  common_days_ago: 'jours passés',
  common_in_days: 'Dans {days} jours',
  common_delete: 'Supprimer',
  common_edit: 'Modifier',
  common_confirm: 'Confirmer',
  common_select_language: 'Sélectionner la Langue',
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
  onboarding_species: '种类',
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
  home_upcoming_care: '即将到来的护理',
  home_add_pet: '添加宠物',
  home_no_pets: '还没有宠物',
  home_no_care: '没有安排的护理',
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
  // Care types
  care_vaccine: '疫苗',
  care_grooming: '美容',
  care_medication: '药物',
  care_vet_visit: '兽医就诊',
  // Common
  common_today: '今天',
  common_tomorrow: '明天',
  common_yesterday: '昨天',
  common_days_ago: '天前',
  common_in_days: '{days}天后',
  common_delete: '删除',
  common_edit: '编辑',
  common_confirm: '确认',
  common_select_language: '选择语言',
};

export const translations: Record<Exclude<SupportedLanguage, 'system'>, Translations> = {
  en,
  pt,
  es,
  fr,
  zh,
};

export type { TranslationKey };
