import { useEffect } from 'react';

export function useGeofencing(enabled = true) {
  useEffect(() => {
    if (!enabled) {
      return;
    }
  }, [enabled]);
}
