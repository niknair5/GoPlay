import { useEffect } from 'react';

import * as Notifications from 'expo-notifications';
import { type Href, useRouter } from 'expo-router';
import { Platform } from 'react-native';

import { registerForPushNotificationsAsync } from '../lib/notifications';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';

export function useNotifications(enabled = true) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!enabled || !user?.id || Platform.OS === 'web') {
      return;
    }
    let mounted = true;
    const setup = async () => {
      try {
        const token = await registerForPushNotificationsAsync();
        if (!token || !mounted || !isSupabaseConfigured) {
          return;
        }
        await supabase.from('user_profiles').upsert({ id: user.id, expo_push_token: token });
      } catch {
        // Notification setup should not block app rendering.
      }
    };
    void setup();

    const received = Notifications.addNotificationReceivedListener(() => {});
    const response = Notifications.addNotificationResponseReceivedListener((event) => {
      const facilityId = event.notification.request.content.data?.facility_id;
      if (typeof facilityId === 'string') {
        router.push(`/(app)/space/${facilityId}?prompt=1` as Href);
      }
    });

    return () => {
      mounted = false;
      received.remove();
      response.remove();
    };
  }, [enabled, router, user?.id]);
}
