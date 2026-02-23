"use client"
import { apiEndpoints, DEFAULT_LOCALE } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";
import { useEffect, useState } from "react";

interface PopularProductsProps {
  productId: number;
  countryCode?: string;
}
type SpecType = {
  specification_key_id: number;
  translated_key: string;
  translated_value: string;
};

type SpecsResponse = {
  dataset: SpecType[];
};

const SpecDetails = ({ productId, countryCode = DEFAULT_LOCALE }: PopularProductsProps) => {
  const [dataset, setDataset] = useState<SpecType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecifications = async (): Promise<void> => {
      try {
        setLoading(true);
        console.log('Fetching specifications for product ID:', apiEndpoints.getPublicSpecs(productId));
        const response = await fetchApi<SpecsResponse>(apiEndpoints.getPublicSpecs(productId), {
          queryParams: { locale: countryCode },
        });

        if (response.success && response.data?.dataset) {
          setDataset(response.data.dataset);
        } else {
          setDataset([]);
        }
      } catch (error) {
        console.error('Error fetching specifications:', error);
        setDataset([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecifications();
  }, [productId, countryCode]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
        <div className="text-center py-8 text-gray-500">
          <p>Loading specifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
      {dataset && dataset.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="divide-y divide-gray-200">
            {dataset.map((spec, index) => (
              <tr
                key={spec.specification_key_id}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
              >
                <td className="py-4 px-6 text-sm font-semibold text-gray-700 w-1/3">
                  {spec.translated_key}
                </td>
                <td className="py-4 px-6 text-sm text-gray-900">
                  {spec.translated_value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No specifications available for this product.</p>
        </div>
      )}
    </div>
  );
};

export default SpecDetails;
