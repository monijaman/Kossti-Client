interface PageProps {
  params: Promise<{
    category: string; // Type for the slug
    locale: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { category } = await params;
  return (
    <h2>This is {category}</h2>

  );
};

export default Page;
