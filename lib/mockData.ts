import type { SpotCardData } from '@/components/common/SpotCard';

export const MOCK_SPOTS: SpotCardData[] = [
  {
    id: '1',
    name: 'Riverside Park Courts',
    sport: '🏀',
    status: 'Busy',
    players: 8,
    max: 10,
    distance: '0.3 mi',
    detail: 'Pickup game running',
  },
  {
    id: '2',
    name: 'Sunset Soccer Fields',
    sport: '⚽',
    status: 'Open',
    players: 4,
    max: 22,
    distance: '0.7 mi',
    detail: 'Space available',
  },
  {
    id: '3',
    name: 'Lincoln Tennis Club',
    sport: '🎾',
    status: 'Empty',
    players: 0,
    max: 4,
    distance: '1.1 mi',
    detail: 'No one checked in',
  },
  {
    id: '4',
    name: 'The Cage',
    sport: '🏀',
    status: 'Full',
    players: 10,
    max: 10,
    distance: '1.4 mi',
    detail: 'Courts at capacity',
  },
];

export const MOCK_SPORTS = [
  { icon: '🏀', name: 'Basketball', count: 12 },
  { icon: '⚽', name: 'Soccer', count: 8 },
  { icon: '🎾', name: 'Tennis', count: 5 },
  { icon: '🏓', name: 'Pickleball', count: 7 },
  { icon: '🏐', name: 'Volleyball', count: 3 },
  { icon: '🛹', name: 'Skate', count: 2 },
];
