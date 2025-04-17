import ProductForm from "@/components/admin/ProductForm";
import ProductTransForm from "@/components/admin/ProductTransForm";


const CreateProduct = async () => {

    return (
    <div className="flex flex-row gap-4">
        
        <div className="w-1/2  bg-gray-100 border rounded">
            <ProductForm />
        </div>

        <div className="w-1/2">
            <ProductTransForm />
        </div>
    </div>
    )
};

export default CreateProduct;



