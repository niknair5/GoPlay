import { useEffect, useMemo, useState } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SessionCard } from '@/components/profile/SessionCard';
import { normalizeSessionRows } from '@/lib/checkins';
import { supabase } from '@/lib/supabase';
import { weekLabel } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import type { Checkin } from '@/types';

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
    return sessions.reduce<Record<string, Checkin[]>>((acc, session) => {
      const key = weekLabel(session.checked_in_at);
      acc[key] = acc[key] ?? [];
      acc[key].push(session);
      return acc;
    }, {});
  }, [sessions]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-offWhite px-5 py-6">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              void fetchSessions();
            }}
          />
        }
      >
        <Text className="text-3xl font-semibold text-ink">Session history</Text>
        {!sessions.length ? (
          <View className="mt-8">
            <EmptyState
              title="No sessions yet"
              description="Your check-ins will show up here once you start using GoPlay."
            />
          </View>
        ) : null}
        <View className="mt-6 gap-6">
          {Object.entries(grouped).map(([label, items]) => (
            <View key={label} className="gap-3">
              <Text className="text-sm font-semibold uppercase tracking-wide text-muted">
                {label}
              </Text>
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
