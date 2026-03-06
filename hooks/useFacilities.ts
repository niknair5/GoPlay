import type { Facility } from '@/types';

export function useFacilities() {
  const allFacilities: Facility[] = [];
  return { allFacilities };
}
