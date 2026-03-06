import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { BusynessBar } from '@/components/common/BusynessBar';
import { MOCK_SPOTS } from '@/lib/mockData';

export default function SpaceScreen() {
  const { facilityId } = useLocalSearchParams<{ facilityId?: string }>();
  const router = useRouter();

  const spot = MOCK_SPOTS.find((s) => s.id === facilityId) ?? MOCK_SPOTS[0];

  return (
    <SafeAreaView className="flex-1 bg-offWhite">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="relative bg-blue px-5 pt-11 pb-7">
          <Pressable
            className="absolute left-4 top-11 rounded-lg border-0 bg-white/10 px-3 py-1.5"
            onPress={() => router.back()}
          >
            <Text className="text-[13px] font-medium text-white">← Back</Text>
          </Pressable>
          <View className="items-center">
            <View className="mb-3 h-[60px] w-[60px] items-center justify-center rounded-xl bg-white/10">
              <Text className="text-[32px]">{spot.sport}</Text>
            </View>
            <Text className="text-xl font-bold text-white">{spot.name}</Text>
            <View className="mt-2 rounded-md border border-white/25 bg-white/10 px-3 py-1">
              <Text className="text-xs font-medium text-white">
                {spot.status} · {spot.players}/{spot.max} players
              </Text>
            </View>
          </View>
        </View>

        <View className="px-4 pt-4">
          <View className="mb-3.5 flex-row gap-2.5">
            {[
              { label: 'Players', value: `${spot.players} / ${spot.max}` },
              { label: 'Est. wait', value: '~5 min' },
              { label: 'Distance', value: spot.distance },
            ].map((s, i) => (
              <View
                key={i}
                className="flex-1 items-center rounded-[10px] border border-border bg-white px-2.5 py-3"
              >
                <Text className="font-mono text-base font-medium text-blue">{s.value}</Text>
                <Text className="mt-1 text-[11px] text-muted">{s.label}</Text>
              </View>
            ))}
          </View>

          <View className="mb-3 rounded-xl border border-border bg-white p-4">
            <View className="mb-2.5 flex-row items-center justify-between">
              <Text className="text-sm font-semibold text-ink">Court activity</Text>
              <View className="rounded-md bg-red/15 px-2 py-0.5">
                <Text className="text-[11px] font-semibold text-red">Busy</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-2.5">
              <BusynessBar players={spot.players} max={spot.max} />
              <Text className="font-mono text-xs text-ink">
                {Math.round((spot.players / spot.max) * 100)}%
              </Text>
            </View>
          </View>

          <View className="mb-4 rounded-xl border border-border bg-white p-4">
            <Text className="mb-3 text-sm font-semibold text-ink">Currently there</Text>
            <View className="mb-2 flex-row">
              {['🧑', '👩', '🧔', '👩', '🧑', '👨', '🧑', '👩'].map((emoji, i) => (
                <View
                  key={i}
                  className="h-8 w-8 items-center justify-center rounded-full border-2 border-white"
                  style={{
                    backgroundColor: ['#D6E4F7', '#E8F5E9', '#FFF8E1', '#FCE4EC', '#E8EAF6', '#D6E4F7', '#E8F5E9', '#FFF8E1'][i],
                    marginLeft: i > 0 ? -7 : 0,
                  }}
                >
                  <Text className="text-[17px]">{emoji}</Text>
                </View>
              ))}
            </View>
            <Text className="text-xs text-muted">
              {spot.players} players checked in · Pickup game in progress
            </Text>
          </View>

          <Pressable className="rounded-[10px] border-2 border-blue-dark bg-blue px-6 py-4">
            <Text className="text-center text-base font-bold text-white">
              I'm heading there
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
