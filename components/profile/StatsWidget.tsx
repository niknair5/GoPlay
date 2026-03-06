import { Text, View } from 'react-native';

type StatsWidgetProps = {
  label: string;
  value: string | number;
};

export function StatsWidget({ label, value }: StatsWidgetProps) {
  return (
    <View className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <Text className="text-xl font-semibold text-slate-900">{value}</Text>
      <Text className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{label}</Text>
    </View>
  );
}
