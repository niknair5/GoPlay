import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { type Href, useRouter } from 'expo-router';

import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';
import { StatusBadge } from '@/components/common/StatusBadge';
import { useProfile } from '@/hooks/useProfile';
import { SPORTS } from '@/lib/sports';
import { supabase } from '@/lib/supabase';
import { normalizeSessionRows } from '@/lib/checkins';
import type { Checkin } from '@/types';

export default function ProfileScreen() {
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);
  const { profile, loading } = useProfile();
  const [sessions, setSessions] = useState<Checkin[]>([]);

  useEffect(() => {
    const loadSessions = async () => {
      if (!profile?.id) return;
      const { data } = await supabase
        .from('checkins')
        .select('id,user_id,facility_id,sport,checkin_type,checked_in_at,checked_out_at,duration_minutes,court_number,facility:facilities(id,name,neighborhood,sports)')
        .eq('user_id', profile.id)
        .order('checked_in_at', { ascending: false })
        .limit(10);
      setSessions(normalizeSessionRows((data ?? []) as Array<Record<string, unknown>>));
    };
    void loadSessions();
  }, [profile?.id]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  const displaySessions =
    sessions.length > 0
      ? sessions.slice(0, 3).map((s) => ({
          park: s.facility?.name ?? 'Park',
          sport: s.sport ? SPORTS[s.sport].emoji : '🏀',
          ago: 'Recently',
          status: 'Open' as const,
        }))
      : [
          { park: 'Riverside Park', sport: '🏀', ago: 'Today', status: 'Busy' as const },
          { park: 'Lincoln Fields', sport: '⚽', ago: '2 days ago', status: 'Open' as const },
          { park: 'Sunset Courts', sport: '🎾', ago: 'Last week', status: 'Empty' as const },
        ];

  return (
    <SafeAreaView className="flex-1 bg-offWhite">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="bg-blue px-5 pt-12 pb-9 items-center">
          <View className="mb-3 h-[68px] w-[68px] items-center justify-center rounded-full border-2 border-gold-dark bg-gold">
            <Text className="text-[34px]">{(profile?.display_name ?? 'A').slice(0, 1).toUpperCase()}</Text>
          </View>
          <Text className="text-xl font-bold text-white">
            {profile?.display_name ?? 'Alex Rivera'}
          </Text>
          <Text className="mt-1 text-[13px] text-white/60">
            {profile?.sports?.length
              ? profile.sports.map((s) => SPORTS[s.sport].label).join(' · ')
              : 'Basketball · Soccer'}
          </Text>
        </View>

        <View className="px-4 pt-4">
          <View className="mb-4 flex-row gap-2.5">
            {[
              { label: 'Sessions', value: sessions.length > 0 ? sessions.length : '42' },
              { label: 'Parks', value: '14' },
              { label: 'Day streak', value: '6' },
            ].map((s, i) => (
              <View
                key={i}
                className="flex-1 items-center rounded-[10px] border border-border bg-white px-2.5 py-3.5"
              >
                <Text className="font-mono text-2xl font-medium text-blue">{s.value}</Text>
                <Text className="mt-1 text-[11px] text-muted">{s.label}</Text>
              </View>
            ))}
          </View>

          <View className="rounded-xl border border-border bg-white p-4">
            <Text className="mb-3.5 text-sm font-semibold text-ink">Recent sessions</Text>
            {displaySessions.map((s, i) => (
              <View
                key={i}
                className={`flex-row items-center justify-between py-2.5 ${
                  i < 2 ? 'border-b border-border' : ''
                }`}
              >
                <View className="flex-row items-center gap-2.5">
                  <View className="h-9 w-9 items-center justify-center rounded-lg bg-blue-pale">
                    <Text className="text-lg">{s.sport}</Text>
                  </View>
                  <View>
                    <Text className="text-[13px] font-semibold text-ink">{s.park}</Text>
                    <Text className="mt-0.5 text-[11px] text-muted">{s.ago}</Text>
                  </View>
                </View>
                <StatusBadge status={s.status} />
              </View>
            ))}
          </View>

          <Pressable
            className="mt-4 rounded-2xl bg-blue-pale px-4 py-3"
            onPress={() => router.push('/profile/edit' as Href)}
          >
            <Text className="text-center font-semibold text-ink">Edit profile</Text>
          </Pressable>
          <Pressable
            className="mt-2 rounded-2xl bg-blue-pale px-4 py-3"
            onPress={() => router.push('/profile/history' as Href)}
          >
            <Text className="text-center font-semibold text-ink">View all sessions</Text>
          </Pressable>
          <Pressable
            className="mt-2 rounded-full bg-blue px-5 py-4"
            onPress={() => void signOut()}
          >
            <Text className="text-center font-semibold text-white">Sign out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
