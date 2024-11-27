import { useLocale } from '@/hooks/useLocale';
import { DEFAULT_LOCALE, LOCALES } from '@/lib/constants';
import { LocaleKeys, Translations } from "@/lib/types";

interface PageProps {
  params: {
    lang: string; // Type for the slug
  };
}

// Define the type for valid locale keys

const Page = async ({ params }: PageProps) => {
  const { lang } = params;

  // Validate `lang` against LocaleKeys locale is
  //  LocaleKeys tells TypeScript that locale will be of 
  //  type LocaleKeys if the function returns true
  const isValidLocale = (locale: string): locale is LocaleKeys =>
    LOCALES.includes(locale);

  // Ensure `lang` is a valid LocaleKeys or fallback to DEFAULT_LOCALE
  const selectedLocale: LocaleKeys = isValidLocale(lang) ? lang : DEFAULT_LOCALE;

  // Fetch translations using the validated locale
  const messages: Translations = useLocale(selectedLocale);

  return (
    <>
      <h2>This is {selectedLocale}</h2>
      <h1>{messages.title}</h1>
      <p>{messages.welcome}</p>
    </>
  );
};

export default Page;
