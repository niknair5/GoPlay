import { SafeAreaView, Text, View } from 'react-native';

export default function EditProfileScreen() {
  return (
    <SafeAreaView className="flex-1 bg-offWhite px-5 py-6">
      <View className="rounded-xl border border-border bg-white p-5">
        <Text className="text-2xl font-semibold text-ink">Edit profile</Text>
        <Text className="mt-2 text-sm text-muted">
          Profile editing UI will go here.
        </Text>
      </View>
    </SafeAreaView>
  );
}
