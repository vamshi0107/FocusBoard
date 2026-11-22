import { useState, useEffect } from 'react';

/**
 * useLocalStorage Hook
 * Handles browser-side task persistence across page reloads.
 * 
 * Note: Initial sample data is only injected on first visit.
 * If user deliberately empties the board, we preserve the empty state
 * rather than constantly overriding with sample data on refresh.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        const parsed = JSON.parse(item);
        // Ensure valid array format before using stored cache
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      // Gracefully fall back to initial value if localStorage is blocked or corrupted
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
