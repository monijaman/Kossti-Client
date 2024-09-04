const PopularProducts: React.FC = () => (
    <section className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Popular Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-50 border rounded">
          <h3 className="font-semibold">Popular Product 1</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam viverra...</p>
        </div>
        <div className="p-4 bg-gray-50 border rounded">
          <h3 className="font-semibold">Popular Product 2</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam viverra...</p>
        </div>
        <div className="p-4 bg-gray-50 border rounded">
          <h3 className="font-semibold">Popular Product 3</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam viverra...</p>
        </div>
      </div>
    </section>
  );
  
  export default PopularProducts;
  