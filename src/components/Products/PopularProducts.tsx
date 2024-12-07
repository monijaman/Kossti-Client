
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
    const dataset = response.data.products;
    setDataSet(dataset);
    console.log('datasetdataset', dataset)
  };


  useEffect(() => {
    fetchProductData();
  }, [countryCode])
  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-gray-200 pb-2">
        {translation.popular_product}  </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">

        {dataset && dataset.map((product, i) => (
          <ProducShortDetails key={product.id} product={product} countryCode={countryCode} />
        ))}
      </div>
    </>
  );
};

export default PopularProducts;
