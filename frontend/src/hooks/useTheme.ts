"use client";

import { useSyncExternalStore } from "react";
import { getTheme, toggleTheme, setTheme, subscribeTheme, type ThemeMode } from "@/lib/theme";

export function useTheme() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getTheme,
    () => "light" as ThemeMode
  );

  const isDark = theme === "dark";

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme,
  };
}
