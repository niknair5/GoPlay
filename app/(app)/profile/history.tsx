import { useEffect, useMemo, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SessionCard } from '@/components/profile/SessionCard';
import { supabase } from '@/lib/supabase';
import { weekLabel } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import type { Checkin, Facility } from '@/types';

function normalizeSessionRows(rows: Array<Record<string, unknown>>): Checkin[] {
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

export default function SessionHistoryScreen() {
  const user = useAuthStore((state) => state.user);
  const [sessions, setSessions] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSessions = async () => {
    if (!user?.id) {
      setSessions([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('checkins')
      .select('id,user_id,facility_id,sport,checkin_type,checked_in_at,checked_out_at,duration_minutes,court_number,facility:facilities(id,name,neighborhood,sports)')
      .eq('user_id', user.id)
      .order('checked_in_at', { ascending: false });
            setSessions(normalizeSessionRows((data ?? []) as Array<Record<string, unknown>>));
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    void fetchSessions();
  }, [user?.id]);

  const grouped = useMemo(() => {
    return sessions.reduce<Record<string, Checkin[]>>((accumulator, session) => {
      const key = weekLabel(session.checked_in_at);
      accumulator[key] = accumulator[key] ?? [];
      accumulator[key].push(session);
      return accumulator;
    }, {});
  }, [sessions]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-5 py-6">
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void fetchSessions(); }} />}>
        <Text className="text-3xl font-semibold text-slate-900">Session history</Text>
        {!sessions.length ? <View className="mt-8"><EmptyState title="No sessions yet" description="Your check-ins will show up here once you start using GoPlay." /></View> : null}
        <View className="mt-6 gap-6">
          {Object.entries(grouped).map(([label, items]) => (
            <View key={label} className="gap-3">
              <Text className="text-sm font-semibold uppercase tracking-wide text-slate-500">{label}</Text>
              {items.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
