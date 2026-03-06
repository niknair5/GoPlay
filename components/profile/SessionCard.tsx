import { Text, View } from 'react-native';

import { SPORTS } from '@/lib/sports';
import { formatDuration } from '@/lib/utils';
import type { Checkin } from '@/types';

type SessionCardProps = {
  session: Checkin;
};

export function SessionCard({ session }: SessionCardProps) {
  const sport = session.sport ? SPORTS[session.sport] : null;

  return (
    <View className="rounded-2xl border border-slate-200 bg-white p-4">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-slate-900">{session.facility?.name ?? 'Unknown facility'}</Text>
        <Text className="text-sm text-slate-500">{new Date(session.checked_in_at).toLocaleDateString()}</Text>
      </View>
      <Text className="mt-2 text-sm text-slate-600">
        {sport ? `${sport.emoji} ${sport.label}` : 'Unspecified sport'}
      </Text>
      <Text className="mt-1 text-sm text-slate-500">
        Duration: {formatDuration(session.duration_minutes ?? 0)}
      </Text>
    </View>
  );
}
