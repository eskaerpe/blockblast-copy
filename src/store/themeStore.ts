import { create } from 'zustand';
import { loadJSON, saveJSON } from '../utils/storage';

interface ThemeState {
  dark: boolean;
  audio: boolean;
  init: () => void;
  toggleTheme: () => void;
  toggleAudio: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  dark: true,
  audio: true,

  init: () => {
    const dark = loadJSON('theme', true);
    const audio = loadJSON('audio', true);
    set({ dark, audio });
    if (dark) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  },

  toggleTheme: () =>
    set((s) => {
      const dark = !s.dark;
      saveJSON('theme', dark);
      if (dark) {
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
      }
      return { dark };
    }),

  toggleAudio: () =>
    set((s) => {
      const audio = !s.audio;
      saveJSON('audio', audio);
      return { audio };
    }),
}));
