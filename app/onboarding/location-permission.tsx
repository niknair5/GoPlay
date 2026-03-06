import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { type Href, useRouter } from 'expo-router';

export default function LocationPermissionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white px-6 py-8">
      <View className="flex-1 items-center justify-center">
        <Text className="text-3xl font-semibold text-slate-900">Enable location</Text>
        <Text className="mt-3 text-center text-base text-slate-600">
          GoPlay uses your location to show nearby places and improve check-ins.
        </Text>
        <Pressable className="mt-8 rounded-full bg-slate-900 px-6 py-4" onPress={() => router.replace('/(app)/index' as Href)}>
          <Text className="font-semibold text-white">Continue</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
