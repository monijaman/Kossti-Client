import bn from "../locales/bn.json";
import en from "../locales/en.json";

// Define the type for the locale keys
type LocaleKeys = "en" | "bn";

// Define the structure of the translations
type Translations = {
  title: string;
  content: string;
};

// Define the locales object with explicit typing
const locales: Record<LocaleKeys, Translations> = { en, bn };

export const useLocale = (lang: LocaleKeys): Translations => {
  return locales[lang] || locales["en"]; // Fallback to English if language not found
};
