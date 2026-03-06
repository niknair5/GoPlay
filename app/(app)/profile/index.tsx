import { useEffect, useMemo, useState } from 'react';
import { Linking, Pressable, SafeAreaView, ScrollView, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SessionCard } from '@/components/profile/SessionCard';
import { StatsWidget } from '@/components/profile/StatsWidget';
import { useBusyness } from '@/hooks/useBusyness';
import { useFacilities } from '@/hooks/useFacilities';
import { useLocation } from '@/hooks/useLocation';
import { useProfile } from '@/hooks/useProfile';
import { SPORTS } from '@/lib/sports';
import { supabase } from '@/lib/supabase';
import { formatDuration } from '@/lib/utils';
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

export default function ProfileScreen() {
  const router = useRouter();
  const signOut = useAuthStore((state) => state.signOut);
  const { profile, loading, updateProfile } = useProfile();
  const { allFacilities } = useFacilities();
  const { getFacilityCount } = useBusyness();
  const { foregroundStatus } = useLocation();
  const [sessions, setSessions] = useState<Checkin[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      if (!profile?.id) {
        setLoadingSessions(false);
        return;
      }
      const { data } = await supabase
        .from('checkins')
        .select('id,user_id,facility_id,sport,checkin_type,checked_in_at,checked_out_at,duration_minutes,court_number,facility:facilities(id,name,neighborhood,sports)')
        .eq('user_id', profile.id)
        .order('checked_in_at', { ascending: false })
        .limit(10);
              setSessions(normalizeSessionRows((data ?? []) as Array<Record<string, unknown>>));
      setLoadingSessions(false);
    };
    void loadSessions();
  }, [profile?.id]);

  const savedFacilities = useMemo(() => {
    return allFacilities.filter((facility) => profile?.saved_facility_ids.includes(facility.id));
  }, [allFacilities, profile?.saved_facility_ids]);

  const totalHours = sessions.reduce((sum, session) => sum + (session.duration_minutes ?? 0), 0);
  const thisWeekSessions = sessions.filter((session) => {
    const date = new Date(session.checked_in_at);
    const start = new Date();
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
    return date >= start;
  }).length;

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-5" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="mt-6 flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-slate-900">
              <Text className="text-lg font-semibold text-white">{(profile?.display_name ?? 'G').slice(0, 1).toUpperCase()}</Text>
            </View>
            <View>
              <Text className="text-2xl font-semibold text-slate-900">{profile?.display_name ?? 'GoPlay User'}</Text>
              <Text className="text-sm text-slate-500">{profile?.home_neighborhood ?? 'Seattle'}</Text>
            </View>
          </View>
          <Pressable className="rounded-full border border-slate-200 px-4 py-2" onPress={() => router.push('/(app)/profile/edit')}>
            <Text className="font-medium text-slate-900">Edit</Text>
          </Pressable>
        </View>

        <View className="mt-8 gap-3">
          <Text className="text-lg font-semibold text-slate-900">My Sports</Text>
          {profile?.sports.length ? profile.sports.map((sport) => (
            <View key={sport.sport} className="rounded-3xl border border-slate-200 bg-white p-4">
              <Text className="text-base font-semibold text-slate-900">{SPORTS[sport.sport].emoji} {SPORTS[sport.sport].label}</Text>
              <Text className="mt-1 text-sm text-slate-500">{sport.skill_level}</Text>
            </View>
          )) : <EmptyState title="No sports yet" description="Add the sports you play to personalize GoPlay." actionLabel="Edit profile" onAction={() => router.push('/(app)/profile/edit')} />}
        </View>

        <View className="mt-8 gap-3">
          <Text className="text-lg font-semibold text-slate-900">My Spots</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {savedFacilities.length ? savedFacilities.map((facility) => (
              <Pressable key={facility.id} className="w-64 rounded-3xl border border-slate-200 bg-white p-4" onPress={() => router.push(`/(app)/space/${facility.id}`)}>
                <Text className="text-base font-semibold text-slate-900">{facility.name}</Text>
                <Text className="mt-1 text-sm text-slate-500">{facility.neighborhood ?? 'Seattle'}</Text>
                <Text className="mt-3 text-sm text-slate-700">{facility.sports.map((sport) => SPORTS[sport].emoji).join(' ')}</Text>
                <Text className="mt-3 text-sm font-medium text-slate-900">{getFacilityCount(facility.id)} here now</Text>
              </Pressable>
            )) : <View className="w-72"><EmptyState title="No saved spots" description="Save your regular spots to see them here." /></View>}
          </ScrollView>
        </View>

        <View className="mt-8 gap-3">
          <Text className="text-lg font-semibold text-slate-900">Activity</Text>
          <View className="flex-row gap-3">
            <StatsWidget label="Total sessions" value={sessions.length} />
            <StatsWidget label="Total hours" value={formatDuration(totalHours)} />
            <StatsWidget label="This week" value={thisWeekSessions} />
          </View>
          <View className="gap-3">
            {loadingSessions ? <LoadingSpinner /> : sessions.map((session) => <SessionCard key={session.id} session={session} />)}
          </View>
          <Pressable onPress={() => router.push('/(app)/profile/history')}>
            <Text className="font-semibold text-slate-900">View all</Text>
          </Pressable>
        </View>

        <View className="mt-8 gap-4 rounded-3xl border border-slate-200 bg-white p-5">
          <Text className="text-lg font-semibold text-slate-900">Settings</Text>
          {profile ? (
            <>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-slate-700">Passive check-in</Text>
                <Switch value={profile.notification_prefs.passive_checkin} onValueChange={(value) => void updateProfile({ notification_prefs: { ...profile.notification_prefs, passive_checkin: value } })} />
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-slate-700">Active check-in prompt</Text>
                <Switch value={profile.notification_prefs.active_checkin_prompt} onValueChange={(value) => void updateProfile({ notification_prefs: { ...profile.notification_prefs, active_checkin_prompt: value } })} />
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-base text-slate-700">Home court alerts</Text>
                <Switch value={profile.notification_prefs.home_court_alerts} onValueChange={(value) => void updateProfile({ notification_prefs: { ...profile.notification_prefs, home_court_alerts: value } })} />
              </View>
            </>
          ) : null}
          <Pressable className="rounded-2xl bg-slate-100 px-4 py-3" onPress={() => void Linking.openSettings()}>
            <Text className="font-medium text-slate-900">Location permissions: {foregroundStatus ?? 'unknown'}</Text>
          </Pressable>
          <Pressable className="rounded-full bg-slate-900 px-5 py-4" onPress={() => void signOut()}>
            <Text className="text-center font-semibold text-white">Sign out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
