import { apiEndpoints, DEFAULT_LOCALE } from "@/lib/constants";
import fetchApi from "@/lib/fetchApi";

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

const SpecDetails = async ({ productId, countryCode = DEFAULT_LOCALE }: PopularProductsProps) => {
  let dataset: SpecType[] = [];
  try {
    const response = await fetchApi<SpecsResponse>(apiEndpoints.getPublicSpecs(productId), {
      queryParams: { locale: countryCode },
      next: { revalidate: 60 },
    });
    if (response.success && response.data?.dataset) {
      dataset = response.data.dataset;
    }
  } catch {
    // ignore — render empty state below
  }

  return (
    <div className="bg-white rounded-lg overflow-x-auto border border-gray-200">
      {dataset && dataset.length > 0 ? (
        <table className="w-full divide-y divide-gray-200">
          <tbody className="divide-y divide-gray-200">
            {Array.from({ length: Math.ceil(dataset.length / 2) }).map((_, rowIndex) => {
              const leftSpec = dataset[rowIndex * 2];
              const rightSpec = dataset[rowIndex * 2 + 1];
              return (
                <tr key={rowIndex} className="divide-x divide-gray-200">
                  <td className="py-2 px-3 md:py-4 md:px-6 w-1/2 bg-white hover:bg-blue-50 transition-colors">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-4">
                      <span className="text-xs md:text-sm font-semibold text-gray-700">
                        {leftSpec.translated_key}
                      </span>
                      <span className="text-xs md:text-sm text-gray-900 md:text-right">
                        {leftSpec.translated_value}
                      </span>
                    </div>
                  </td>
                  {rightSpec ? (
                    <td className="py-2 px-3 md:py-4 md:px-6 w-1/2 bg-gray-50 hover:bg-blue-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-4">
                        <span className="text-xs md:text-sm font-semibold text-gray-700">
                          {rightSpec.translated_key}
                        </span>
                        <span className="text-xs md:text-sm text-gray-900 md:text-right">
                          {rightSpec.translated_value}
                        </span>
                      </div>
                    </td>
                  ) : (
                    <td className="py-2 px-3 md:py-4 md:px-6 w-1/2 bg-gray-50"></td>
                  )}
                </tr>
              );
            })}
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
