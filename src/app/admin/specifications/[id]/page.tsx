"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import { useSpecifications } from "@/hooks/useSpecifications";
import { SpecificationInt, SpecificationKey, Product } from '@/lib/types';
import ReviewTransForm from '@/components/reviews/ReviewTranslations';

interface PageProps {
    params: {
        id: number;
    };
}

const Specification = ({ params }: PageProps) => {
    const { id } = params;
    const { getSpecifications, getSpecificationsKeys, submitSpecificationsKeys } = useSpecifications();

    const [specifications, setSpecifications] = useState<SpecificationInt[]>([]);

    const [specKeys, setSpecKeys] = useState<SpecificationKey[]>([]);
    const [productName, setProductName] = useState<string>('');


    // Function to handle input change
    const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const values = [...specifications];
        const { name, value } = event.target;

        // Type guard to ensure name is a key of SpecificationInt
        if (name === 'specification_key_id' || name === 'value') {
            values[index][name] = value; // Ensure key is valid
        }
        setSpecifications(values);
    };

    // Function to handle specification key selection from react-select
    const handleSelectChange = (index: number, selectedOption: SingleValue<{ value: number | null; label: string }>) => {
        const values = [...specifications];
        if (selectedOption) {
            values[index].specification_key_id = selectedOption.value !== undefined && selectedOption.value !== null ? selectedOption.value.toString() : "";
            setSpecifications(values);
        }
    };

    // Function to handle adding more specifications
    const addMoreSpecifications = () => {
        setSpecifications([...specifications, { specification_key_id: '', value: '' }]);
    };

    // Function to handle form submission
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

     
        // Call the submit function with the mapped data
        await submitSpecificationsKeys(id, specifications);

    };

    // Fetch the specification keys
    const fetchSpecificationKeys = async () => {
        try {
            const dataset = await getSpecificationsKeys();
            setSpecKeys(dataset.data);
            
        } catch (error) {
            console.error("Error fetching specifications:", error);
        }
    };


    // fetch all specificatiosn for dropdown option
    const fetchSpecifications = async () => {
        try {
            const response = await getSpecifications(id);

            if(response.dataset.specifications.length> 0){
               
                setSpecifications(response.dataset.specifications);
                
            }else{
                console.log('response+++++++++++++++', response.dataset)
                setSpecifications(response.dataset.formspecs);

            }

            setProductName(response.dataset.name)

            // setProduct();
        } catch (error) {
            console.error("Error fetching specifications:", error);
        }
    };

    useEffect(() => {
        fetchSpecificationKeys();
        fetchSpecifications();
    }, []);

    return (

        <div className="flex flex-row gap-4">
            <div className="w-1/2">

                <div className="bg-white shadow-md rounded-lg p-8">
                    <h1 className="text-2xl font-semibold mb-6">Add Specifications for {productName}</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {specifications.map((spec, index) => (
                            <div key={index} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <Select
                                        name="specification_key_id" // Match with SpecificationInt key
                                        value={specKeys
                                            .map((key) => ({
                                                value: key.id,
                                                label: key.specification_key,
                                            }))
                                            .find((option) => option.value === parseInt(spec.specification_key_id)) || null}
                                        onChange={(selectedOption) => handleSelectChange(index, selectedOption)}
                                        options={specKeys.map((key) => ({
                                            value: key.id,
                                            label: key.specification_key,
                                        }))}
                                        onInputChange={(inputValue) => {
                                            if (inputValue) {
                                                fetchSpecificationKeys(inputValue); // Call API to fetch dynamic data
                                            }
                                        }}
                                        className="mt-1 block w-full"
                                        placeholder="Search and select a specification key"
                                        isSearchable
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        name="value" // Ensure this matches the SpecificationInt key
                                        value={spec.value}
                                        onChange={(event) => handleInputChange(index, event)}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        required
                                    />
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={addMoreSpecifications}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Add More
                            </button>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="w-1/2">
                <ReviewTransForm productId={id} specKeys={specKeys && specKeys} specifications={specifications} />
            </div>
        </div>
    );
};

export default Specification;
