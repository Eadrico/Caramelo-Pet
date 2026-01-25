// Core types for Caramelo app

export type Species = 'dog' | 'cat' | 'other';

export type CareType = 'vaccine' | 'grooming' | 'medication' | 'vet_visit';

export interface Pet {
  id: string;
  name: string;
  species: Species;
  birthdate?: string; // ISO date string
  weightKg?: number;
  photoUri?: string;
  createdAt: string; // ISO date string
  // Advanced info
  breed?: string;
  microchipId?: string;
  allergies?: string;
  vetName?: string;
  vetPhone?: string;
  notes?: string;
}

export interface Reminder {
  id: string;
  petId: string;
  title: string;
  message?: string;
  dateTime: string; // ISO date string with time
  repeatType: 'none' | 'daily' | 'weekly' | 'monthly';
  isEnabled: boolean;
  notificationId?: string;
  createdAt: string; // ISO date string
}

export interface CareItem {
  id: string;
  petId: string;
  type: CareType;
  title: string;
  dueDate: string; // ISO date string
  notes?: string;
  createdAt: string; // ISO date string
}

export interface OnboardingPetData {
  name: string;
  species: Species;
  birthdate?: string;
  weightKg?: number;
  photoUri?: string;
  careItems: Omit<CareItem, 'id' | 'petId' | 'createdAt'>[];
}

// Helper functions
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0 && diffDays <= 7) return `In ${diffDays} days`;
  if (diffDays < 0 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;

  return formatDate(dateString);
}

export function getCareTypeIcon(type: CareType): string {
  switch (type) {
    case 'vaccine': return 'Syringe';
    case 'grooming': return 'Scissors';
    case 'medication': return 'Pill';
    case 'vet_visit': return 'Stethoscope';
    default: return 'Calendar';
  }
}

export function getCareTypeLabel(type: CareType): string {
  switch (type) {
    case 'vaccine': return 'Vaccine';
    case 'grooming': return 'Grooming';
    case 'medication': return 'Medication';
    case 'vet_visit': return 'Vet Visit';
    default: return 'Care';
  }
}

export function getSpeciesEmoji(species: Species): string {
  switch (species) {
    case 'dog': return '🐕';
    case 'cat': return '🐈';
    case 'other': return '🐾';
  }
}

export function getRepeatLabel(repeatType: Reminder['repeatType'], t: (key: any) => string): string {
  switch (repeatType) {
    case 'none': return t('repeat_does_not_repeat');
    case 'daily': return t('repeat_every_day');
    case 'weekly': return t('repeat_every_week');
    case 'monthly': return t('repeat_every_month');
  }
}

export function calculateAge(birthdate: string): { years: number; months: number } {
  const birth = new Date(birthdate);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (now.getDate() < birth.getDate()) {
    months--;
    if (months < 0) {
      years--;
      months += 12;
    }
  }

  return { years, months };
}

export function formatAge(birthdate: string): string {
  const { years, months } = calculateAge(birthdate);
  if (years === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  if (months === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
  return `${years}y ${months}m`;
}
