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
