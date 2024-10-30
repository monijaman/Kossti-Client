interface PageProps {
  params: {
    category: string; // Type for the slug
  };
}

const Page = async ({ params }: PageProps) => {

  const { category } = params
  return (
    <h2>This is {category}</h2>

  );
};

export default Page;
