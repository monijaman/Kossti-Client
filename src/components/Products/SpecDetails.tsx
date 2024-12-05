import fetchPublicSpecs from '@/app/ServerCalls/fetchPublicSpecs';
import { cookies } from 'next/headers';

interface PopularProductsProps {
  productId: number;
}

const SpecDetails = async ({ productId }: PopularProductsProps) => {

  const countryCode = (await cookies()).get('country-code')?.value || 'en'; // Default to 'en' if not found

  const specs = await fetchPublicSpecs(productId, countryCode);


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
