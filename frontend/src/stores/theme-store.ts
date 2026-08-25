import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  soundAlertsEnabled: boolean;
  sidebarCollapsed: boolean;

  // Actions
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
  toggleSoundAlerts: () => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (val: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      soundAlertsEnabled: true,
      sidebarCollapsed: false,

      toggleTheme: () =>
        set((state) => {
          const next = !state.isDark;
          if (typeof document !== 'undefined') {
            if (next) {
              document.documentElement.classList.add('dark');
              document.documentElement.setAttribute('data-theme', 'dark');
            } else {
              document.documentElement.classList.remove('dark');
              document.documentElement.setAttribute('data-theme', 'light');
            }
          }
          return { isDark: next };
        }),

      setTheme: (isDark) =>
        set(() => {
          if (typeof document !== 'undefined') {
            if (isDark) {
              document.documentElement.classList.add('dark');
              document.documentElement.setAttribute('data-theme', 'dark');
            } else {
              document.documentElement.classList.remove('dark');
              document.documentElement.setAttribute('data-theme', 'light');
            }
          }
          return { isDark };
        }),

      toggleSoundAlerts: () =>
        set((state) => ({ soundAlertsEnabled: !state.soundAlertsEnabled })),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),
    }),
    {
      name: 'prime_one_theme',
    }
  )
);
