// import { useSpecifications } from '@/hooks/useSpecifications';
import fetchApi from "@/lib/fetchApi";
import { apiEndpoints, DEFAULT_LOCALE } from "@/lib/constants";
import { cookies } from 'next/headers';
import { ApiResponse } from "@/lib/types";
interface PopularProductsProps {
  productId: number;
}
type SpecType = {
  specification_key_id: number;
  translated_key: string;
  translated_value: string;
};

type SpecsResponse = {
  dataset: SpecType[];
};
const SpecDetails = async ({ productId }: PopularProductsProps) => {
  // const { getPublicSpecs } = useSpecifications();
  // const cookieStore = await cookies();
  const countryCode = (await cookies()).get('country-code')?.value || DEFAULT_LOCALE; // Default to 'en' if not found

  const fetchSpecifications = async (): Promise<ApiResponse<SpecsResponse>> => {

    const response = await fetchApi<SpecsResponse>(apiEndpoints.getPublicSpecs(productId), {
      queryParams: { locale: countryCode }, // Pass the locale as a query parameter
    });

    return response;
  };

  // Await the fetch to get the actual data
  const specsResponse = await fetchSpecifications();
  const dataset = specsResponse.success && specsResponse.data?.dataset
    ? specsResponse.data.dataset
    : [];


  return (
    <div>

      {dataset ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Specification</th>
              <th className="py-3 px-6 text-left">Value</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {dataset.map((spec) => (

              <tr key={spec.specification_key_id} className="border-b border-gray-300 hover:bg-gray-100">
                <td className="py-3 px-6">{spec.translated_key}</td>
                <td className="py-3 px-6">{spec.translated_value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Error fetching specifications.</p>
      )}
    </div>
  );
};

export default SpecDetails;
