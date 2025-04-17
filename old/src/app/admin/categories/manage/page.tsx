
import CategoryForm from "@/components/admin/categories/CategoryForm";


export default function CreateSpecification() {


    return (
        <div className="flex flex-row gap-4">
            <div className="w-1/2  bg-gray-100 border rounded">
                <CategoryForm />
            </div>
        </div>

    );
}
