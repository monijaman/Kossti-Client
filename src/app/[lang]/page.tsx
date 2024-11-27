import { useLocale } from '@/hooks/useLocale';

interface PageProps {
  params: {
    lang: string; // Type for the slug
  };
}

const Page = async ({ params }: PageProps) => {
  const { lang } = params
  const messages = useLocale(lang || 'en'); // Default to English if locale is undefined

  return (
    <>
      <h2>This is {lang}</h2>
      <h1>{messages.title}</h1>
      <p>{messages.welcome}</p>
    </>
  );
};

export default Page;
