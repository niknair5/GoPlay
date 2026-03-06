import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, TextInput, View } from 'react-native';
import { type Href, useRouter } from 'expo-router';

import { SpotCard } from '@/components/common/SpotCard';
import { MOCK_SPOTS, MOCK_SPORTS } from '@/lib/mockData';
import { useProfile } from '@/hooks/useProfile';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useProfile();
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const spots = MOCK_SPOTS;

  return (
    <SafeAreaView className="flex-1 bg-offWhite">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="bg-blue px-5 pt-11 pb-6">
          <Text className="text-xs font-medium text-white/60">
            {getGreeting()}, {profile?.display_name ?? 'Alex'}
          </Text>
          <Text className="mt-0.5 text-[22px] font-bold text-white">
            What are you playing today?
          </Text>
          <View className="mt-4 flex-row items-center gap-2.5 rounded-[10px] border border-border bg-white px-3.5 py-2.5">
            <Text className="text-muted">🔍</Text>
            <TextInput
              className="flex-1 text-[13px] text-ink"
              placeholder="Search parks, courts, fields..."
              placeholderTextColor="#6B7FA3"
              editable={false}
            />
          </View>
        </View>

        <View className="px-5 pt-5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
          >
            {MOCK_SPORTS.map((s) => {
              const active = selectedSport === s.name;
              return (
                <Pressable
                  key={s.name}
                  onPress={() => setSelectedSport(active ? null : s.name)}
                  className={`flex-row items-center gap-1.5 rounded-lg border px-3 py-1.5 ${
                    active ? 'border-blue bg-blue' : 'border-border bg-white'
                  }`}
                >
                  <Text className="text-[13px] font-semibold">
                    {s.icon} {s.name}
                  </Text>
                  <View
                    className={`rounded-md px-1.5 py-0.5 ${
                      active ? 'bg-white/20' : 'bg-blue-pale'
                    }`}
                  >
                    <Text
                      className={`text-[11px] font-medium ${
                        active ? 'text-white' : 'text-blue'
                      }`}
                    >
                      {s.count}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          <View className="mt-5 flex-row items-center justify-between">
            <Text className="text-base font-bold text-ink">Near you</Text>
            <Pressable onPress={() => router.push('/explore' as Href)}>
              <Text className="text-[13px] font-semibold text-blue">View map</Text>
            </Pressable>
          </View>

          <View className="mt-3 gap-2.5">
            {spots.map((spot) => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
