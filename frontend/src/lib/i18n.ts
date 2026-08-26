import { dictionaries, localeMetadata, type SupportedLocale, type TranslationDictionary } from "@/locales";

// Active language default (can be dynamically wired to user preferences or cookies)
let currentLocale: SupportedLocale = "en";

export function setLocale(locale: SupportedLocale): void {
  currentLocale = locale;
}

export function getLocale(): SupportedLocale {
  return currentLocale;
}

export function getLocaleMeta(locale: SupportedLocale = currentLocale) {
  return localeMetadata[locale] || localeMetadata.en;
}

/**
 * Type-safe path helper for nested dictionary keys (e.g. "desk.activeChats", "common.send")
 */
type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string | number)]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : `${Key}`;
}[keyof ObjectType & (string | number)];

export type TranslationKey = NestedKeyOf<TranslationDictionary>;

/**
 * Translate helper: Fetches string by dot-notation key from active dictionary.
 * 
 * @example
 * t("desk.activeChats")
 * t("common.send")
 */
export function t(key: TranslationKey, locale: SupportedLocale = currentLocale): string {
  const dict = dictionaries[locale] || dictionaries.en;
  const keys = key.split(".");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = dict;
  for (const k of keys) {
    if (current && typeof current === "object" && k in current) {
      current = current[k];
    } else {
      return key; // Fallback to key string if not found
    }
  }

  return typeof current === "string" ? current : key;
}
