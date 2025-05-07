 

const Page = async (  params: Promise<{ category: string }>
) => {

  const { category } = await params
  return (
    <h2>This is {category}</h2>

  );
};

export default Page;
