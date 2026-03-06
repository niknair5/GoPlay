import { Pressable, SafeAreaView, Text, View } from 'react-native';
import { type Href, useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-blue">
      <View className="flex-1 items-center justify-center px-5">
        <View
          className="absolute top-[15%] h-[340px] w-[340px] rounded-full bg-blue-light opacity-40"
          style={{ left: '50%', marginLeft: -170 }}
        />
        <Text className="relative z-10 mb-3.5 text-4xl font-bold text-white">
          GoPlay
        </Text>
        <Text className="relative z-10 mb-12 text-center text-sm text-white/65">
          Find courts. See who's playing. Show up.
        </Text>
        <Pressable
          className="relative z-10 rounded-[10px] border-2 border-gold-dark bg-gold px-[52px] py-3.5"
          style={{ shadowColor: '#C49A1A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0 }}
          onPress={() => router.replace('/onboarding/location-permission' as Href)}
        >
          <Text className="text-base font-bold text-blue-dark">Get Started</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
