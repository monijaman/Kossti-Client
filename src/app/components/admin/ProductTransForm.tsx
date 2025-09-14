"use client";
import { useProducts } from "@/hooks/useProducts";
import { LOCALES } from '@/lib/constants';
import { Product, ProductTranslation } from '@/lib/types'; // Assuming you have a Product type
import { useEffect, useState } from 'react';

interface ProductFormProps {
    product?: Product; // Make it optional for the create case
}

// Go server response interface
interface GoServerTranslationResponse {
    message: string;
    translation: ProductTranslation;
    action: {
        created: boolean;
        updated: boolean;
    };
}


const ProductTransForm = ({ product }: ProductFormProps) => {

    // Debug: Log the product data to understand the structure
    console.log('ProductTransForm received product:', product);
    console.log('Product translations:', product?.translations);

    const [name, setName] = useState(''); // Don't initialize with product name - use translation data
    const [price, setPrice] = useState(0); // Don't initialize with product price - use translation data
    const { Translation, getProductTranslations } = useProducts();
    const id = product && product.id;
    const [submitStatus, setSubmitStatus] = useState('');
    const [selectedTranslation, setSelectedTranslation] = useState('');
    const [translations, setTranslations] = useState(product?.translations);

    // Handle language switch
    const handleLanguageSwitch = (locale: string) => {þþ
        const selectedLang = LOCALES.find((lang) => lang === locale);
        if (selectedLang) {
            setSelectedTranslation(locale);
        }

        console.log(`=== Language Switch to ${locale} ===`);
        console.log('Available translations:', translations);

        // Always clear the form first
        setName('');
        setPrice(0);

        // If we have translations, try to find one for this locale
        if (translations && translations.length > 0) {
            const item = translations.find((item: ProductTranslation) => {
                console.log(`Checking translation:`, item);
                console.log(`Comparing: item.locale(${item.locale}) === locale(${locale})`);
                return item.locale === locale;
            });

            if (item) {
                // Found a translation for this locale - populate the form
                console.log(`Found translation for ${locale}:`, item);
                console.log(`Setting name to: "${item.translated_name}"`);
                console.log(`Setting price to: "${item.price}"`);

                setName(item.translated_name || '');

                // Handle price conversion more carefully
                let priceValue = 0;
                if (typeof item.price === 'string') {
                    priceValue = parseFloat(item.price) || 0;
                } else if (typeof item.price === 'number') {
                    priceValue = item.price;
                }
                setPrice(priceValue);

                console.log(`Form state after update - name: "${item.translated_name}", price: ${priceValue}`);
            } else {
                console.log(`No translation found for locale: ${locale}, form will be empty for new translation`);
            }
        } else {
            console.log('No translations available, form will be empty for new translation');
        }

        // Force a small delay to ensure state updates
        setTimeout(() => {
            console.log(`Final form state - name: "${name}", price: ${price}`);
        }, 100);
    };


    // Load translations when product ID is available
    const loadTranslations = async () => {
        if (id) {
            console.log(`Loading translations for product ${id}`);
            try {
                // For now, we'll rely on translations passed through props
                // Later we can implement: const result = await getProductTranslations(id);
                console.log('Translations should be loaded from product props:', product?.translations);
            } catch (error) {
                console.error('Error loading translations:', error);
            }
        }
    };

    // Select 'bn' translation by default on mount
    useEffect(() => {
        loadTranslations();
        handleLanguageSwitch('bn');
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    // Update translations when product changes
    useEffect(() => {
        console.log('Product changed, updating translations:', product?.translations);
        setTranslations(product?.translations);
        // Re-apply the current language selection to update the form
        if (selectedTranslation) {
            handleLanguageSwitch(selectedTranslation);
        }
    }, [product?.translations]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation
        if (!selectedTranslation) {
            setSubmitStatus('Error: Please select a language');
            return;
        }

        if (!name.trim()) {
            setSubmitStatus('Error: Translated product name is required');
            return;
        }

        if (!price || price <= 0) {
            setSubmitStatus('Error: Valid price is required');
            return;
        }

        const payload = {
            locale: selectedTranslation, // Go server expects lowercase
            translated_name: name.trim(), // Go server expects snake_case, trim whitespace
            price: price.toString(), // Convert number to string for Go API
        };

        console.log('Translation payload:', payload);
        console.log('Selected locale:', selectedTranslation);

        try {
            if (!id) {
                setSubmitStatus('Error: Product ID is undefined');
                return;
            }

            // Call the Translation API
            const response = await Translation(payload, id);

            if (response.success) {
                const responseData = response.data as unknown as GoServerTranslationResponse;
                const actionType = responseData?.action?.created ? 'created' : 'updated';
                setSubmitStatus(`Translation ${actionType} successfully!`);

                // Update translations state with the new/updated translation
                if (responseData?.translation) {
                    setTranslations((prevTranslations: ProductTranslation[] | undefined) => {
                        const updatedTranslations = prevTranslations || [];
                        const existingIndex = updatedTranslations.findIndex(
                            (t) => t.locale === selectedTranslation
                        );

                        if (existingIndex >= 0) {
                            // Update existing translation
                            updatedTranslations[existingIndex] = responseData.translation;
                            return [...updatedTranslations];
                        } else {
                            // Add new translation
                            return [...updatedTranslations, responseData.translation];
                        }
                    });
                }

            } else {
                setSubmitStatus('Error submitting form: ' + (response.error || 'Unknown error'));
                console.error('Error submitting form', response);
            }
        } catch (error) {
            setSubmitStatus('Error submitting form: ' + (error instanceof Error ? error.message : 'Unknown error'));
            console.error('Error submitting form', error);
        }
    };


    return (
        <>
            {/* Debug info - remove in production */}
            <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
                <strong>Debug Info:</strong>
                <div>Product ID: {id}</div>
                <div>Selected Locale: {selectedTranslation}</div>
                <div>Available Translations: {translations?.length || 0}</div>
                <div>Current Form Values: name=&quot;{name}&quot;, price={price}</div>
                <div>Translations: {JSON.stringify(translations, null, 2)}</div>
                <button
                    onClick={() => loadTranslations()}
                    className="mt-2 bg-gray-500 text-white px-3 py-1 rounded text-xs"
                >
                    Refresh Translations
                </button>
            </div>

            <div className="mb-4">
                {LOCALES.map((translation) => (
                    <button
                        key={translation}
                        onClick={() => handleLanguageSwitch(translation)}
                        className={`px-4 py-2 mr-2 ${selectedTranslation === translation ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}
                    >
                        {translation.toUpperCase()}
                        {translations?.find(t => t.locale === translation) && (
                            <span className="ml-1 text-xs">✓</span>
                        )}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Translated Product Name ({selectedTranslation.toUpperCase()})
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                        id="name"
                        type="text"
                        placeholder={`Enter product name in ${selectedTranslation.toUpperCase()}`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <p className="text-gray-600 text-xs mt-1">
                        Enter the product name as it should appear in {selectedTranslation.toUpperCase()}
                    </p>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                        Translated Price ({selectedTranslation.toUpperCase()})
                        <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder={`Enter price in ${selectedTranslation.toUpperCase()} currency`}
                        value={price || ''}
                        onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                        required
                    />
                    <p className="text-gray-600 text-xs mt-1">
                        Enter the price in the local currency for {selectedTranslation.toUpperCase()} market
                    </p>
                </div>




                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={!name.trim() || !price || price <= 0 || !selectedTranslation}
                    >
                        {translations?.find(t => t.locale === selectedTranslation)
                            ? `Update Translation (${selectedTranslation.toUpperCase()})`
                            : `Create Translation (${selectedTranslation.toUpperCase()})`}
                    </button>

                    {translations?.find(t => t.locale === selectedTranslation) && (
                        <span className="text-sm text-gray-600">
                            ✓ Translation exists for {selectedTranslation.toUpperCase()}
                        </span>
                    )}
                </div>



                {submitStatus && (
                    <div
                        className={`p-4 mt-4 text-sm rounded-lg ${submitStatus.includes('successfully')
                            ? 'text-green-700 bg-green-100'
                            : 'text-red-700 bg-red-100'
                            }`}
                        role="alert"
                    >
                        {submitStatus}
                    </div>
                )}
            </form>
        </>
    );
};

export default ProductTransForm;
