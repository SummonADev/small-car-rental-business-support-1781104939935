const PREFIX = 'summon_';

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw) return JSON.parse(raw) as T;
  } catch {
    // ignore
  }
  return fallback;
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(data));
  } catch {
    // ignore
  }
}
