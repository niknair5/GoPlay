import { Pressable, Text, View } from 'react-native';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="rounded-3xl border border-dashed border-slate-300 bg-white p-5">
      <Text className="text-base font-semibold text-slate-900">{title}</Text>
      <Text className="mt-2 text-sm text-slate-500">{description}</Text>
      {actionLabel && onAction ? (
        <Pressable className="mt-4 self-start rounded-full bg-slate-900 px-4 py-2" onPress={onAction}>
          <Text className="font-semibold text-white">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
