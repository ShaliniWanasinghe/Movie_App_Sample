// utils/storage.ts

export const storage = {
  set(key: string, value: any) {
    try {
      const json = JSON.stringify(value);
      localStorage.setItem(key, json);
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  },

  get<T>(key: string): T | null {
    try {
      const json = localStorage.getItem(key);
      return json ? JSON.parse(json) : null;
    } catch (e) {
      console.error("Error reading from localStorage:", e);
      return null;
    }
  },

  remove(key: string) {
    localStorage.removeItem(key);
  },

  clear() {
    localStorage.clear();
  },
};
