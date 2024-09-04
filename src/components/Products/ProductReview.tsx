export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  branch: string;
  price: number;
}
  
  const ProductReview: React.FC<{ products: Product[] }> = ({ products }) => (
    <div>
      <h2 className="text-lg font-semibold mb-4">Product Review</h2>
      <div className="space-y-4">
        {products.map(product => (
          <div key={product.id} className="p-4 bg-gray-50 border rounded">
            <h3 className="font-semibold">{product.name}</h3>
            <h3 className="font-semibold">{product.category}</h3>
            <h3 className="font-semibold">{product.branch}</h3>
            <h3 className="font-semibold">{product.price}</h3>
            <p>{product.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
  
  export default ProductReview;
  