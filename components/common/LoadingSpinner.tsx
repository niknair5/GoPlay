import { ActivityIndicator, View } from 'react-native';

type LoadingSpinnerProps = {
  fullScreen?: boolean;
};

export function LoadingSpinner({ fullScreen = false }: LoadingSpinnerProps) {
  return (
    <View className={fullScreen ? 'flex-1 items-center justify-center bg-white' : 'items-center justify-center'}>
      <ActivityIndicator size="large" color="#0f172a" />
    </View>
  );
}
