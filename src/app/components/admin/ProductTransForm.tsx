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

// API translation response structure
interface ApiTranslationData {
    ID: number;
    ProductID: number;
    Locale: string;
    TranslatedName: string;
    price: string;
    CreatedAt: string;
    UpdatedAt: string;
}


const ProductTransForm = ({ product }: ProductFormProps) => {

    const [name, setName] = useState(''); // Don't initialize with product name - use translation data
    const [price, setPrice] = useState(0); // Don't initialize with product price - use translation data
    const { Translation, getProductTranslations } = useProducts();
    const id = product && product.id;
    const [submitStatus, setSubmitStatus] = useState('');
    const [selectedTranslation, setSelectedTranslation] = useState('');
    const [translations, setTranslations] = useState<(ProductTranslation | ApiTranslationData)[] | undefined>(product?.translations);

    // Helper function to populate form fields for a specific language
    const populateFormForLanguage = (locale: string, translationData?: (ProductTranslation | ApiTranslationData)[]) => {
        const availableTranslations = translationData || translations;

        // Always clear the form first
        setName('');
        setPrice(0);

        // If we have translations, try to find one for this locale
        if (availableTranslations && availableTranslations.length > 0) {
            // Check if it's API data or ProductTranslation data
            const item = availableTranslations.find((item: ProductTranslation | ApiTranslationData) => {
                // Handle both API format (Locale) and ProductTranslation format (locale)
                const itemLocale = (item as ApiTranslationData).Locale || (item as ProductTranslation).locale;
                return itemLocale === locale;
            });

            if (item) {
                // Handle API format vs ProductTranslation format
                const apiItem = item as ApiTranslationData;
                const translationItem = item as ProductTranslation;

                // Set name - try API format first, then ProductTranslation format
                const translatedName = apiItem.TranslatedName || translationItem.translated_name;
                setName(translatedName || '');

                // Handle price conversion more carefully
                let priceValue = 0;
                const itemPrice = apiItem.price || translationItem.price;
                if (typeof itemPrice === 'string') {
                    priceValue = parseFloat(itemPrice) || 0;
                } else if (typeof itemPrice === 'number') {
                    priceValue = itemPrice;
                }
                setPrice(priceValue);
            } else {
                // For 'bn' locale, use original product data as fallback
                if (locale === 'bn' && product) {
                    setName(product.name || '');
                    setPrice(product.price || 0);
                }
            }
        } else {
            // For 'bn' locale, use original product data as fallback even when no translations exist
            if (locale === 'bn' && product) {
                setName(product.name || '');
                setPrice(product.price || 0);
            }
        }
    };

    // Handle language switch
    const handleLanguageSwitch = (locale: string) => {
        const selectedLang = LOCALES.find((lang) => lang === locale);
        if (selectedLang) {
            setSelectedTranslation(locale);
        }

        populateFormForLanguage(locale);
    };


    // Load translations when product ID is available - HIGH PRIORITY for name and price setting
    const loadTranslations = async () => {
        if (id) {
            let nameSet = false;
            let priceSet = false;

            try {

                const result = await getProductTranslations(id);

                if (result.success && result.data) {
                    // result.data is an array of translations
                    if (Array.isArray(result.data)) {
                        setTranslations(result.data);

                        // HIGH PRIORITY: Find translation for current locale or 'bn' as fallback
                        const currentTranslation = result.data.find((t: ApiTranslationData) =>
                            t.Locale === selectedTranslation || t.Locale === 'bn'
                        );

                        if (currentTranslation) {
                            // Set name from API data
                            if (currentTranslation.TranslatedName) {
                                setName(currentTranslation.TranslatedName);
                                nameSet = true;
                            }

                            // Set price from API data
                            if (currentTranslation.price !== undefined && currentTranslation.price !== null) {
                                let priceValue = 0;
                                if (typeof currentTranslation.price === 'string') {
                                    priceValue = parseFloat(currentTranslation.price) || 0;
                                } else if (typeof currentTranslation.price === 'number') {
                                    priceValue = currentTranslation.price;
                                }

                                if (priceValue > 0) {
                                    setPrice(priceValue);
                                    priceSet = true;
                                }
                            }
                        }
                    }
                }
            } catch {
                // Silent error handling - will use fallback options below
            }

            // FALLBACK OPTIONS: If name or price still not set, use product data
            if ((!nameSet || !priceSet) && product) {
                if (!nameSet && product.name) {
                    setName(product.name);
                    nameSet = true;
                }

                if (!priceSet && product.price && product.price > 0) {
                    setPrice(product.price);
                    priceSet = true;
                }
            }

            // FINAL FALLBACK: If still no name or price, set empty/zero values
            if (!nameSet) {
                setName('');
            }
            if (!priceSet) {
                setPrice(0);
            }

            // Always try to set translations from product props as fallback
            if (!translations && product?.translations) {
                setTranslations(product.translations);
            }
        }
    };

    // Select 'bn' translation by default on mount
    useEffect(() => {
        setSelectedTranslation('bn');
        loadTranslations(); // API data takes priority
    }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

    // Only update translations if we don't already have API data loaded
    useEffect(() => {
        if (product?.translations && !translations) {
            setTranslations(product.translations);
        }
    }, [product?.translations, translations]); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle language switching - only populate if we have translations loaded
    useEffect(() => {
        if (selectedTranslation && translations && translations.length > 0) {
            populateFormForLanguage(selectedTranslation, translations);
        }
    }, [selectedTranslation, translations]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validation
        if (!selectedTranslation) {
            setSubmitStatus('Error: Please select a language');
            return;
        }

        const payload = {
            locale: selectedTranslation, // Go server expects lowercase
            translated_name: name?.trim() || '', // Go server expects snake_case, trim whitespace safely
            price: price.toString(), // Convert number to string for Go API
        };

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
                    setTranslations((prevTranslations: (ProductTranslation | ApiTranslationData)[] | undefined) => {
                        const updatedTranslations = prevTranslations || [];
                        const existingIndex = updatedTranslations.findIndex(
                            (t) => {
                                const locale = (t as ApiTranslationData).Locale || (t as ProductTranslation).locale;
                                return locale === selectedTranslation;
                            }
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
            }
        } catch (error) {
            setSubmitStatus('Error submitting form: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    };


    return (
        <>
            <div className="mb-4">
                {LOCALES.map((translation) => (
                    <button
                        key={translation}
                        onClick={() => handleLanguageSwitch(translation)}
                        className={`px-4 py-2 mr-2 ${selectedTranslation === translation ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}
                    >
                        {translation.toUpperCase()}
                        {translations?.find(t => {
                            const locale = (t as ApiTranslationData).Locale || (t as ProductTranslation).locale;
                            return locale === translation;
                        }) && (
                                <span className="ml-1 text-xs">✓</span>
                            )}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Translated Product Name ({selectedTranslation.toUpperCase()})
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                        id="name"
                        type="text"
                        placeholder={`Enter product name in ${selectedTranslation.toUpperCase()}`}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <p className="text-gray-600 text-xs mt-1">
                        Enter the product name as it should appear in {selectedTranslation.toUpperCase()}
                    </p>
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                        Translated Price ({selectedTranslation.toUpperCase()})
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
                    />
                    <p className="text-gray-600 text-xs mt-1">
                        Enter the price in the local currency for {selectedTranslation.toUpperCase()} market
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                        disabled={!selectedTranslation}
                    >
                        {translations?.find(t => {
                            const locale = (t as ApiTranslationData).Locale || (t as ProductTranslation).locale;
                            return locale === selectedTranslation;
                        })
                            ? `Update Translation (${selectedTranslation.toUpperCase()})`
                            : `Create Translation (${selectedTranslation.toUpperCase()})`}
                    </button>

                    {translations?.find(t => {
                        const locale = (t as ApiTranslationData).Locale || (t as ProductTranslation).locale;
                        return locale === selectedTranslation;
                    }) && (
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
