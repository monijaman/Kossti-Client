import { useSpecifications } from '@/hooks/useSpecifications';
import { DEFAULT_LOCALE } from '@/lib/constants';
import { cookies } from 'next/headers';

interface PopularProductsProps {
  productId: number;
}

const SpecDetails = async ({ productId }: PopularProductsProps) => {
  const { getPublicSpecs } = useSpecifications();
  const cookieStore = await cookies();
  const countryCode = cookieStore.get('country-code')?.value || DEFAULT_LOCALE; // Default to 'en' if not found

  const fetchSpecifications = async () => {
    const response = await getPublicSpecs(productId, countryCode);



    return response;
  }

  // Await the fetch to get the actual data
  const specs = await fetchSpecifications();


  return (
    <div>

      {specs.success ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Specification</th>
              <th className="py-3 px-6 text-left">Value</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {specs.dataset.map((spec: any) => (
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
