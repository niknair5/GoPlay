import { Pressable, Text, View } from 'react-native';
import { type Href, useRouter } from 'expo-router';

import { BusynessBar } from './BusynessBar';
import { StatusBadge } from './StatusBadge';

export type SpotStatus = 'Busy' | 'Open' | 'Empty' | 'Full';

export type SpotCardData = {
  id: string;
  name: string;
  sport: string;
  status: SpotStatus;
  players: number;
  max: number;
  distance: string;
  detail: string;
};

type SpotCardProps = {
  spot: SpotCardData;
};

export function SpotCard({ spot }: SpotCardProps) {
  const router = useRouter();

  return (
    <Pressable
      className="rounded-xl border border-border bg-white p-4"
      onPress={() => router.push(`/space/${spot.id}` as Href)}
    >
      <View className="mb-2.5 flex-row items-start justify-between">
        <View className="flex-row items-center gap-2.5">
          <View className="h-10 w-10 items-center justify-center rounded-lg bg-blue-pale">
            <Text className="text-xl">{spot.sport}</Text>
          </View>
          <View>
            <Text className="text-sm font-semibold text-ink">{spot.name}</Text>
            <Text className="mt-0.5 text-xs text-muted">{spot.detail}</Text>
          </View>
        </View>
        <View className="items-end gap-1">
          <StatusBadge status={spot.status} />
          <Text className="font-mono text-[11px] text-muted">{spot.distance}</Text>
        </View>
      </View>
      <View className="flex-row items-center gap-2.5">
        <BusynessBar players={spot.players} max={spot.max} />
        <Text className="font-mono text-[11px] text-muted" style={{ flexShrink: 0 }}>
          {spot.players}/{spot.max}
        </Text>
      </View>
    </Pressable>
  );
}
