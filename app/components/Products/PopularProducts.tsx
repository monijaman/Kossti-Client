
"use client"
import { useTranslation } from "@/hooks/useLocale";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/lib/types";
import { useEffect, useState } from "react";
import ProducShortDetails from "./ProducShortDetails";
interface pageProps {
  countryCode: string
}

const PopularProducts = ({ countryCode }: pageProps) => {
  const translation = useTranslation(countryCode);
  const { getProducts } = useProducts();
  const [dataset, setDataSet] = useState<Product[]>();
  const page = 1;
  const limit = 16;

  // Retrieve the 'country-code' cookie directly in a server component
  const fetchProductData = async () => {
    const response = await getProducts(page, limit, '', '', '', '', countryCode, 'popular');
    if (response.success && response.data && typeof response.data === 'object' && 'products' in response.data) {
      const dataset = response.data.products;
      setDataSet(dataset);
      console.log('datasetdataset', dataset)
    } else {
      setDataSet([]);
    }
  };


  useEffect(() => {
    fetchProductData();
  }, [countryCode])
  return (
    <>
      <h2 className="page-title text-2xl font-bold text-gray-800 mb-6 mt-8">
        {translation.popupar_product}</h2>

      <div className="product-grid">
        {dataset && dataset.map((product) => (
          <ProducShortDetails key={product.id} product={product} countryCode={countryCode} />
        ))}
      </div>
    </>
  );
};

export default PopularProducts;
