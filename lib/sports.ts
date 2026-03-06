import type { SportKey } from '@/types';

type SportMeta = {
  label: string;
  emoji: string;
};

export const SPORTS: Record<SportKey, SportMeta> = {
  basketball: { label: 'Basketball', emoji: '🏀' },
  pickleball: { label: 'Pickleball', emoji: '🏓' },
  tennis: { label: 'Tennis', emoji: '🎾' },
  volleyball: { label: 'Volleyball', emoji: '🏐' },
  badminton: { label: 'Badminton', emoji: '🏸' },
  soccer: { label: 'Soccer', emoji: '⚽' },
};
