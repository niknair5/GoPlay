import { create } from 'zustand';

type AuthUser = {
  id: string;
  email: string | null;
};

type AuthState = {
  hydrated: boolean;
  session: { user: AuthUser } | null;
  user: AuthUser | null;
  onboardingComplete: boolean;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
};

const MOCK_USER: AuthUser = {
  id: 'demo-user',
  email: null,
};

export const useAuthStore = create<AuthState>((set) => ({
  hydrated: false,
  session: null,
  user: null,
  onboardingComplete: false,
  initialize: async () => {
    set({
      hydrated: true,
      session: { user: MOCK_USER },
      user: MOCK_USER,
      onboardingComplete: true,
    });
  },
  signOut: async () => {
    set({
      session: null,
      user: null,
      onboardingComplete: false,
    });
  },
}));
