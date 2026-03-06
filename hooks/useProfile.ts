import { useMemo, useState } from 'react';

import type { UserProfile } from '@/types';

const DEFAULT_PROFILE: UserProfile = {
  id: 'demo-user',
  display_name: 'GoPlay User',
  home_neighborhood: 'Seattle',
  saved_facility_ids: [],
  sports: [],
  notification_prefs: {
    passive_checkin: true,
    active_checkin_prompt: true,
    home_court_alerts: true,
  },
};

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(DEFAULT_PROFILE);
  const loading = false;

  const updateProfile = async (patch: Partial<UserProfile>): Promise<void> => {
    setProfile((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        ...patch,
        notification_prefs: {
          ...current.notification_prefs,
          ...(patch.notification_prefs ?? {}),
        },
      };
    });
  };

  return useMemo(
    () => ({
      profile,
      loading,
      updateProfile,
    }),
    [profile],
  );
}
