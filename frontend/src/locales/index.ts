/**
 * Centralized Internationalization Registry
 * 
 * To add a new language in the future:
 * 1. Create a dictionary file (e.g., `src/locales/ur.ts`, `src/locales/ar.ts`) matching TranslationDictionary.
 * 2. Register it in `locales` below with its metadata (name, nativeName, dir).
 */

import { en, type TranslationDictionary } from "./en";

export type SupportedLocale = "en"; // Add new language keys here (e.g., | "ur" | "ar")

export interface LocaleMeta {
  code: string;
  name: string;
  nativeName: string;
  dir: "ltr" | "rtl";
}

export const localeMetadata: Record<SupportedLocale, LocaleMeta> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    dir: "ltr",
  },
};

export const dictionaries: Record<SupportedLocale, TranslationDictionary> = {
  en,
};

export type { TranslationDictionary };
