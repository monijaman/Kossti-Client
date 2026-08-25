interface PageProps {
  params: Promise<{
    category: string; // Type for the slug
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { category, locale } = await params;
  const label = category.replace(/-/g, ' ');
  const title = `${label.replace(/\b\w/g, (c) => c.toUpperCase())} Reviews & Comparisons | Kossti`;
  return {
    title,
    description: `Explore the best ${label} reviews, specifications, prices, and comparisons on Kossti.`,
    alternates: { canonical: `/${locale}/${category}` },
  };
}

const Page = async ({ params }: PageProps) => {
  const { category } = await params;
  return (
    <main>
      <h1 className="text-3xl font-bold">{category.replace(/-/g, ' ')} Reviews</h1>
    </main>

  );
};

export default Page;
