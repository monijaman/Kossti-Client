import { FC } from "react";
import { useCategory } from "@/hooks/useCategory";

interface categoryInt {
  id: number;
  name: string;
  priority: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}
interface SearchParams {
  page?: string;
  category?: string;
  brand?: string;
  price?: string;
}

const Prices = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { getCategory } = useCategory();

  // Fetch the products data using the async function
  const response = await getCategory();
  // Handle the fetched data
  const dataset = response.success ? response.data : [];

  const activeCategory = searchParams.category || "";

  const clearCategoryUrl = `/?branch=${activeCategory || ""}${
    activeCategory ? `&price=${activeCategory}` : ""
  }`;

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <div className="mb-4">
        {dataset &&
          dataset.map((category: categoryInt) => {
            return (
              <a
                key={category.id}
                href={`/?category=${activeCategory}`}
                className={`block px-4 py-2 rounded-md ${
                  activeCategory === category.name
                    ? "bg-blue-100"
                    : "bg-gray-200"
                }`}
              >
                {category.name}
              </a>
            );
          })}
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

export default Prices;
