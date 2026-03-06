import { View } from 'react-native';

type BusynessBarProps = {
  players: number;
  max: number;
};

export function BusynessBar({ players, max }: BusynessBarProps) {
  const pct = max > 0 ? (players / max) * 100 : 0;
  const color = pct > 80 ? '#E74C3C' : pct > 40 ? '#F5C842' : '#2ECC71';

  return (
    <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-blue-pale">
      <View
        className="h-full rounded-full"
        style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
      />
    </View>
  );
}
