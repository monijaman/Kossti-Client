import { useCategory } from "@/hooks/useCategory";
import { categoryInt, SearchParams } from '@/lib/types';


const Categories = async ({ category }: SearchParams) => {
  // const Categories: FC<{ searchParams?: SearchParams }> = async ({ searchParams = {} }) => {
  const { getCategory } = useCategory();

  // Fetch the category data using the async function
  const response = await getCategory();
  const dataset = response.success ? response.data : [];

  // Handle undefined searchParams with a default empty string
  const activeCategory = category || "";
  const clearCategoryUrl = `/`;
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <div className="mb-4">
        <div className="mb-4">
          {dataset &&
            dataset.map((category: categoryInt, index: number) => {
              return (
                <a
                  key={category.id || index} // Fallback to index if category.id is undefined
                  href={`/?category=${category.slug}`}
                  className={`block px-4 py-2 rounded-md ${activeCategory === category.name
                      ? "bg-blue-100"
                      : "bg-gray-200"
                    }`}
                >
                  {category.name}
                </a>
              );
            })}
        </div>
      </div>
      <a
        href={clearCategoryUrl}
        className="text-blue-500 hover:underline mb-4 block"
      >
        Clear Categories
      </a>
    </>
  );
};

export default Categories;
