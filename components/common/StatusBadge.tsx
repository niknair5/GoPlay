import { Text, View } from 'react-native';

type Status = 'Busy' | 'Open' | 'Empty' | 'Full';

const STATUS_COLORS: Record<Status, string> = {
  Busy: '#E74C3C',
  Open: '#2ECC71',
  Empty: '#6B7FA3',
  Full: '#E74C3C',
};

type StatusBadgeProps = {
  status: Status;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = STATUS_COLORS[status];

  return (
    <View
      className="rounded-md px-2 py-1"
      style={{ backgroundColor: `${color}18` }}
    >
      <Text
        className="text-[11px] font-semibold uppercase tracking-wide"
        style={{ color }}
      >
        {status}
      </Text>
    </View>
  );
}
