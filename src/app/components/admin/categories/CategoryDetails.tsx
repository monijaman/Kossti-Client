'use client';
import { useCategory } from '@/hooks/useCategory';
import { Category } from '@/lib/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PageProps {
  categories: Category[];
}

const CategoryDetails = ({ categories }: PageProps) => {
  // Always initialize with an array
  const [categoryList, setCategoryList] = useState<Category[]>(Array.isArray(categories) ? categories : []);

  const { categoryStatUpdate } = useCategory();

  const statusUpdate = async (category_id: number, status: number) => {
    const response = await categoryStatUpdate({ category_id, status });
    if (response?.success) {
      // Update category status in the state
      setCategoryList((prevCategories) =>
        prevCategories.map((category) =>
          category.id === category_id
            ? { ...category, status: !!status } // Convert status to boolean
            : category
        )
      );
    }
  };

  useEffect(() => {
    setCategoryList(Array.isArray(categories) ? categories : []);
  }, [categories]);

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6">
      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-3 px-4 text-lg font-medium text-gray-700">ID</th>
            <th className="py-3 px-4 text-lg font-medium text-gray-700">Name</th>
            <th className="py-3 px-4 text-lg font-medium text-gray-700">Status</th>
            <th className="py-3 px-4 text-lg font-medium text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categoryList?.map((category) => (
            <tr key={category.id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4 text-sm">{category.id}</td>
              <td className="py-2 px-4 text-sm">{category.name}</td>
              <td className="py-2 px-4 text-sm">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${category.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                >
                  {category.status ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="py-2 px-4">
                <Link
                  className="bg-blue-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-blue-600"
                  href={`/admin/categories/${category.id}`}
                >
                  Brands
                </Link>
                <Link
                  className="bg-yellow-500 text-white px-3 py-2 rounded-md mr-2 hover:bg-yellow-600"
                  href={`/admin/categories/manage/${category.id}`}
                >
                  Edit
                </Link>
                <button
                  className={`${category.status ? 'bg-green-500' : 'bg-red-500'
                    } text-white px-4 py-2 rounded-md hover:bg-opacity-80`}
                  onClick={() =>
                    statusUpdate(category.id, category.status ? 0 : 1)
                  }
                >
                  {category.status ? 'Deactivate' : 'Activate'}
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryDetails;
