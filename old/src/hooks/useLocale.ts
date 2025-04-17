import { DEFAULT_LOCALE, LOCALES } from "@/lib/constants";
import { SupportedLocale, Translations } from "@/lib/types";
import bn from "../locales/bn.json";
import en from "../locales/en.json";

// Define the locales object with explicit typing
const locales: Record<SupportedLocale, Translations> = { en, bn };

// Hook to fetch translations
export const useTranslation = (locale: string): Translations => {
  // Validate if the provided locale is supported
  const isValidLocale = (locale: string): locale is SupportedLocale =>
    LOCALES.includes(locale as SupportedLocale);

  // Ensure `locale` is valid; fallback to `DEFAULT_LOCALE` if not
  const selectedLocale: SupportedLocale = isValidLocale(locale)
    ? (locale as SupportedLocale)
    : DEFAULT_LOCALE;

  // Fetch translations using the validated locale
  return locales[selectedLocale];
};
