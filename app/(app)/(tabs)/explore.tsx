import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { type Href, useRouter } from 'expo-router';

import { BusynessBar } from '@/components/common/BusynessBar';
import { MOCK_SPOTS } from '@/lib/mockData';

export default function ExploreScreen() {
  const router = useRouter();
  const spots = MOCK_SPOTS.slice(0, 3);

  return (
    <View className="flex-1">
      <View className="flex-1 bg-[#C8DBA8]">
        <View
          className="absolute h-3.5 w-3.5 rounded-full border-2 border-white bg-blue"
          style={{ left: '50%', top: '50%', marginLeft: -7, marginTop: -7 }}
        />
      </View>

      <View className="absolute bottom-0 left-0 right-0 rounded-t-[18px] bg-white px-5 pb-[86px] pt-2.5 shadow-lg">
        <View className="mx-auto mb-3.5 h-1 w-8 rounded-full bg-border" />
        <Text className="mb-3 text-[15px] font-bold text-ink">5 spots nearby</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 10, paddingBottom: 4 }}
        >
          {spots.map((spot) => (
            <Pressable
              key={spot.id}
              onPress={() => router.push(`/space/${spot.id}` as Href)}
              className="min-w-[148px] flex-1 rounded-[10px] border border-border bg-offWhite px-3 py-2.5"
            >
              <Text className="mb-2 text-[13px] font-semibold text-ink">
                {spot.sport} {spot.name.split(' ')[0]}
              </Text>
              <View className="flex-row items-center gap-1.5">
                <BusynessBar players={spot.players} max={spot.max} />
                <Text className="font-mono text-[11px] text-muted">{spot.players}p</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
