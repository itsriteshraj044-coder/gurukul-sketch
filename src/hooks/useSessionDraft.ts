import { useEffect, useState } from 'react';

/**
 * useState that is mirrored to sessionStorage, so a half-finished enquiry
 * survives a refresh or a quick look at another page. Never used for files.
 */
export function useSessionDraft<T extends object>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? { ...initial, ...(JSON.parse(raw) as Partial<T>) } : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable: the draft simply isn't kept */
    }
  }, [key, value]);

  const clear = () => {
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    setValue(initial);
  };

  return [value, setValue, clear] as const;
}
