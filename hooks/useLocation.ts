type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export function useLocation() {
  return {
    foregroundStatus: 'undetermined' as PermissionStatus,
  };
}
