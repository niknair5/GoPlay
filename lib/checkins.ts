import type { Checkin, Facility } from '@/types';

export function normalizeSessionRows(rows: Array<Record<string, unknown>>): Checkin[] {
  return rows.map((row) => {
    const facilityValue = Array.isArray(row.facility) ? row.facility[0] : row.facility;
    const facility = facilityValue && typeof facilityValue === 'object'
      ? {
          id: String((facilityValue as Record<string, unknown>).id),
          name: String((facilityValue as Record<string, unknown>).name),
          neighborhood: (((facilityValue as Record<string, unknown>).neighborhood as string | null | undefined) ?? null),
          sports: ((((facilityValue as Record<string, unknown>).sports as string[] | null | undefined) ?? []) as Pick<Facility, 'sports'>['sports']),
        }
      : undefined;

    return {
      id: String(row.id),
      user_id: String(row.user_id),
      facility_id: String(row.facility_id),
      sport: (row.sport as Checkin['sport']) ?? null,
      checkin_type: row.checkin_type as Checkin['checkin_type'],
      checked_in_at: String(row.checked_in_at),
      checked_out_at: (row.checked_out_at as string | null | undefined) ?? null,
      duration_minutes: typeof row.duration_minutes === 'number' ? row.duration_minutes : null,
      court_number: typeof row.court_number === 'number' ? row.court_number : null,
      facility,
    };
  });
}
