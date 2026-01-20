"use client"
import { useTranslation } from "@/hooks/useLocale";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/lib/types";
import { useEffect, useState } from "react";
import ProducShortDetails from "./ProducShortDetails";

interface pageProps {
  countryCode: string;
  activeCategory?: string;
  currentPage?: number;
}

const PopularProducts = ({ countryCode, activeCategory = '', currentPage = 1 }: pageProps) => {
  const translation = useTranslation(countryCode);
  const { getProducts } = useProducts();
  const [dataset, setDataSet] = useState<Product[]>();
  const limit = 16;

  // Retrieve the 'country-code' cookie directly in a server component
  const fetchProductData = async () => {

    const response = await getProducts(currentPage, limit, activeCategory, '', '', '', countryCode, 'popular');

    if (response.success && response.data && typeof response.data === 'object' && 'products' in response.data) {
      const dataset = response.data.products;
      setDataSet(dataset);
      console.log('activeCategory', activeCategory)
    } else {
      setDataSet([]);
    }
  };


  useEffect(() => {
    fetchProductData();
  }, [countryCode, activeCategory, currentPage])
  return (
    <>
      <h2 className="page-title text-2xl font-bold text-gray-800 mb-6 mt-8">
        {translation.popupar_product}
        {activeCategory && (
          <span className="text-base font-normal text-gray-600 block mt-2">
            Category: {activeCategory}
          </span>
        )}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dataset && dataset.map((product) => (
          <ProducShortDetails key={product.id} product={product} countryCode={countryCode} />
        ))}
      </div>
    </>
  );
};

export default PopularProducts;
