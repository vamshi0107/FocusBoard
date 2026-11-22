import { useState, useEffect } from 'react';

/**
 * useLocalStorage Hook
 * Handles browser-side persistence across page reloads for both arrays (tasks) and objects (profile).
 * 
 * Note: Initial default data is only injected on first visit.
 * Saved edits and empty states are strictly preserved on refresh.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        const parsed = JSON.parse(item);
        // Validates that parsed data exists (supports both arrays and profile objects)
        if (parsed !== null && parsed !== undefined) {
          return parsed;
        }
      }
    } catch (error) {
      console.warn(`[FocusBoard] Failed to read localStorage key "${key}":`, error);
    }
    return typeof initialValue === 'function' ? initialValue() : initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`[FocusBoard] Failed to write to localStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}
