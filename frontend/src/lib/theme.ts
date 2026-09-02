"use client";

/* ================================================================
   PRIME ONE TELECOM OS — ZERO-LATENCY INSTANT THEME ENGINE
   Suppresses transitions during DOM class mutation to ensure
   0.00ms instantaneous repainting across the entire DOM tree.
   ================================================================ */

export type ThemeMode = "light" | "dark";

const THEME_CHANGE_EVENT = "prime-theme-change";

/**
 * Get current active theme from document or localStorage
 */
export function getTheme(): ThemeMode {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/**
 * Instantly toggle between Light Mode and Dark Mode with zero transition lag
 */
export function toggleTheme(): ThemeMode {
  const current = getTheme();
  const next: ThemeMode = current === "dark" ? "light" : "dark";
  setTheme(next);
  return next;
}

/**
 * Set theme instantly with transition suppression barrier
 */
export function setTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;

  // 1. Inject temporary transition blocker into <head>
  const css = document.createElement("style");
  css.type = "text/css";
  css.appendChild(
    document.createTextNode(
      `*, *::before, *::after {
        -webkit-transition: none !important;
        -moz-transition: none !important;
        -o-transition: none !important;
        -ms-transition: none !important;
        transition: none !important;
      }`
    )
  );
  document.head.appendChild(css);

  // 2. Synchronously mutate DOM class
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // 3. Persist to localStorage
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
    // ignore quota/private browsing errors
  }

  // 4. Force synchronous style recalculation
  (() => window.getComputedStyle(document.body))();

  // 5. Notify all listeners across components and tabs
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: { theme } }));
  window.dispatchEvent(new Event("theme-change")); // backwards compatibility

  // 6. Remove transition blocker in next animation frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (document.head.contains(css)) {
        document.head.removeChild(css);
      }
    });
  });
}

/**
 * Subscribe to theme changes
 */
export function subscribeTheme(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = () => callback();
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === "theme") {
      const newTheme = (e.newValue as ThemeMode) || "light";
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      callback();
    }
  };

  window.addEventListener(THEME_CHANGE_EVENT, handleCustomEvent);
  window.addEventListener("theme-change", handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, handleCustomEvent);
    window.removeEventListener("theme-change", handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}
