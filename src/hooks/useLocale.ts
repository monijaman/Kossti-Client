import { SupportedLocale, Translations } from "@/lib/types";
import bn from "../locales/bn.json";
import en from "../locales/en.json";
// Define the type for the locale keys

// Define the locales object with explicit typing
const locales: Record<SupportedLocale, Translations> = { en, bn };

export const useLocale = (lang: SupportedLocale): Translations => {
  return locales[lang] || locales["en"]; // Fallback to English if language not found
};
