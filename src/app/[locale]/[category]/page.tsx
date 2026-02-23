<<<<<<< HEAD:src/app/[lang]/[category]/page.tsx
 

const Page = async (  params: Promise<{ category: string }>
) => {

  const { category } = await params
=======
interface PageProps {
  params: Promise<{
    category: string; // Type for the slug
    locale: string;
  }>;
}

const Page = async ({ params }: PageProps) => {
  const { category } = await params;
>>>>>>> main:src/app/[locale]/[category]/page.tsx
  return (
    <h2>This is {category}</h2>

  );
};

export default Page;
