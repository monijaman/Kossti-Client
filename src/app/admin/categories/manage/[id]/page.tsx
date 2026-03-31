'use client'
import CategoryForm from "@/app/components/admin/categories/CategoryForm";
import CategoryTransForm from "@/app/components/admin/categories/CategoryTransForm";
import { useCategory } from '@/hooks/useCategory';
import { apiEndpoints } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";
import { Category } from '@/lib/types'; // Assuming you have a Product type
import Link from 'next/link';
import { use, useCallback, useEffect, useState } from 'react';
interface PageProps {
  params: Promise<{
    id: number; // Type for the slug
  }>;
}

const CreateSpecificationKeys = ({ params }: PageProps) => {

  const { getCategoryById } = useCategory();
  const { id } = use(params);
  const [category, setCategory] = useState<Category | null>(null)


  const fetchKeys = useCallback(async () => {

    try {
      const response = await fetchApi(apiEndpoints.getCategoryById(id));

      if (response && response.success && response.data) {
        const apiResponse = response.data as { data?: Category; message?: string };
        setCategory(apiResponse.data || null);
      }
    } catch (error) {
      console.error("Error fetching category:", error);
    }

  }, [getCategoryById, id]);

  useEffect(() => {
    if (id) {
      fetchKeys();
    }
  }, []);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Link
          href={`/admin/categories/${id}`}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-200"
        >
          Manage Category Brands
        </Link>
      </div>

      <div className="flex flex-row gap-4">
        <div className="w-1/2  bg-gray-100 border rounded">
          <CategoryForm categoryData={category || undefined} />
        </div>

        <div className="w-1/2">
          {category && <CategoryTransForm categoryData={category} />}
        </div>
      </div>
    </>
  );
}

export default CreateSpecificationKeys;
