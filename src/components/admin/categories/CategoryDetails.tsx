'use client';
import { useCategory } from '@/hooks/useCategory';
import { categoryInt } from '@/lib/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PageProps {
  categories: categoryInt[];
}

const CategoryDetails = ({ categories }: PageProps) => {
  // Initialize state with categories prop
  const [categoryList, setCategoryList] = useState<categoryInt[]>([]);

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
    setCategoryList(categories);
  }, [categories])


  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categoryList && categoryList.map((category) => (
            <tr key={category.id}>
              <td className="py-2 px-4 border">{category.id}</td>
              <td className="py-2 px-4 border">{category.name}</td>
              <td className="py-2 px-4 border">
                {category.status ? 'Active' : 'Inactive'}
              </td>
              <td className="py-2 px-4 border">
                <Link
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  href={`/admin/categories/${category.id}`}
                >
                  Brands
                </Link>
                <Link
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                  href={`/admin/categories/manage/${category.id}`}
                >
                  Edit
                </Link>
                <button
                  className={`${category.status ? 'bg-green-500' : 'bg-red-500'
                    } text-white px-2 py-1 rounded`}
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
