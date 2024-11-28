import { useCategory } from "@/hooks/useCategory";
import { useTranslation } from "@/hooks/useLocale";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { categoryInt, SearchParams } from '@/lib/types';
import { cookies } from 'next/headers';
const Categories = async ({ category }: SearchParams) => {
  // const Categories: FC<{ searchParams?: SearchParams }> = async ({ searchParams = {} }) => {
  const { getCategories } = useCategory();
  const countryCode = cookies().get('country-code')?.value || DEFAULT_LOCALE; // Default to 'en' if not found
  const translation = useTranslation(countryCode);

  // Fetch the category data using the async function
  const response = await getCategories({
    perPage: 10,        // Number of items per page (optional)
    search: '',   // Search term (optional)
    paginate: 'false',   // 'true' or 'false' to enable/disable pagination
    locale: countryCode,        // Locale, e.g., 'en', 'bn', etc.
    categoryId: '',      // Category ID (optional, can be empty)
    status: 1            // Status filter (optional)
  });
  const dataset = response.success ? response.data.data : [];

  // Handle undefined searchParams with a default empty string
  const activeCategory = category || "";
  const clearCategoryUrl = `/`;
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">{translation.title}</h2>
      <div className="mb-4">
        <div className="mb-4">
          {dataset &&
            dataset.map((category: categoryInt, index: number) => {
              return (
                <a
                  key={category.id || index} // Fallback to index if category.id is undefined
                  href={`/${countryCode}?category=${category.slug}`}
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
        {translation.clear_Category}
      </a>
    </>
  );
};

export default Categories;
