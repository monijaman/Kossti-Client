interface PageProps {
  params: Promise<{
    category: string; // Type for the slug
  }>;
}

const Page = async (props: PageProps) => {
  const params = await props.params;

  const { category } = params
  return (
    <h2>This is {category}</h2>

  );
};

export default Page;
