import { FC } from 'react';

interface Product {
  id: number;
  name: string;
  category: string;
  branch: string;
  price: number;
  specifications: string; // This is the stringified JSON object
}

interface PopularProductsProps {
  products: Product[];
  
}

const PopularProducts = ({ products }: PopularProductsProps) => {

 
  return (

    
    <div className="grid grid-cols-1 gap-4">
      {products.map((product) => {
        // Parse the specifications JSON string into an object
        const specifications = JSON.parse(product.specifications);

        return (
          <div key={product.id} className="p-4 bg-gray-50 border rounded">
            <h3 className="font-semibold">{product.name}</h3>
            <h3 className="font-semibold">Category: {product.category}</h3>
            <h3 className="font-semibold">Price: ${product.price}</h3>

            {/* Example of rendering a few specifications */}
            <div className="mt-2">
              <h4 className="font-bold">Specifications:</h4>
              <ul className="list-disc ml-5">
                {specifications.Network && (
                  <li>Network Technology: {specifications.Network.Technology}</li>
                )}
                {specifications.Launch && (
                  <li>Launch Date: {specifications.Launch.Announced}</li>
                )}
                {specifications.Display && (
                  <li>Display Type: {specifications.Display.Type}</li>
                )}
                {specifications.Platform && (
                  <li>Operating System: {specifications.Platform.OS}</li>
                )}
                {specifications.Battery && (
                  <li>Battery Type: {specifications.Battery.Type}</li>
                )}
                {/* Add more specifications as needed */}
              </ul>
            </div>

            {/* <p className="mt-2">{product.description}</p> */}
          </div>
        );
      })}
    </div>
  );
};

export default PopularProducts;
