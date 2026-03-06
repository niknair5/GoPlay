export type SportKey = 'basketball' | 'pickleball' | 'tennis' | 'volleyball' | 'badminton' | 'soccer';

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type ProfileSport = {
  sport: SportKey;
  skill_level: SkillLevel;
};

export type NotificationPrefs = {
  passive_checkin: boolean;
  active_checkin_prompt: boolean;
  home_court_alerts: boolean;
};

export type Facility = {
  id: string;
  name: string;
  neighborhood: string | null;
  sports: SportKey[];
};

export type UserProfile = {
  id: string;
  display_name: string;
  home_neighborhood: string | null;
  saved_facility_ids: string[];
  sports: ProfileSport[];
  notification_prefs: NotificationPrefs;
};

export type Checkin = {
  id: string;
  user_id: string;
  facility_id: string;
  sport: SportKey | null;
  checkin_type: 'passive' | 'active' | 'manual';
  checked_in_at: string;
  checked_out_at: string | null;
  duration_minutes: number | null;
  court_number: number | null;
  facility?: Facility;
};
