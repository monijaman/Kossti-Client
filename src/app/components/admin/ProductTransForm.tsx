"use client";

import { useProducts } from "@/hooks/useProducts";
import { LOCALES } from "@/lib/constants";
import { Product } from "@/lib/types";
import { useEffect, useState } from "react";

interface ProductFormProps {
    product?: Product;
}

interface TranslationItem {
    locale: string;
    translated_name: string;
    start_price?: string;
    end_price?: string;
}

const ProductTransForm = ({ product }: ProductFormProps) => {
    const { Translation, getProductTranslations, getAProductById } = useProducts();

    const id = product?.id;

    const [selectedLocale, setSelectedLocale] = useState("bn");
    const [translations, setTranslations] = useState<TranslationItem[]>([]);
    const [name, setName] = useState("");
    const [startPrice, setStartPrice] = useState("");
    const [endPrice, setEndPrice] = useState("");
    const [submitStatus, setSubmitStatus] = useState("");
    const [translateLoading, setTranslateLoading] = useState(false);
    const [translateStatus, setTranslateStatus] = useState("");

    // 🔥 Normalize ANY backend response format safely
    const normalizeTranslations = (data: any[]): TranslationItem[] => {
        return data.map((item) => ({
            locale: item.locale || item.Locale,
            translated_name:
                item.translated_name || item.TranslatedName || "",
            start_price:
                item.start_price ||
                item.StartPrice ||
                "",
            end_price:
                item.end_price ||
                item.EndPrice ||
                "",
        }));
    };


    const loadTranslations = async () => {
        if (!id) return;

        const result = await getProductTranslations(id, selectedLocale);

        if (!result?.success || !result.data) return;

        console.log("API RESPONSE:", result.data);

        // 🔥 HANDLE SINGLE OBJECT RESPONSE
        const translation = result.data;

        setName(translation.translated_name || "");
        setStartPrice(translation.start_price || "");
        setEndPrice(translation.end_price || "");

        // store as array for button check logic
        setTranslations([
            {
                locale: translation.locale,
                translated_name: translation.translated_name,
                start_price: translation.start_price,
                end_price: translation.end_price,
            },
        ]);
    };
    // Load translations when locale changes or product updates
    useEffect(() => {
        loadTranslations();
    }, [id, selectedLocale, product?.start_price, product?.end_price]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!id) return;

        const payload = {
            locale: selectedLocale,
            translated_name: name.trim(),
            start_price: startPrice || null,
            end_price: endPrice || null,
        };

        try {
            const response = await Translation(payload, id);

            if (response.success) {
                setSubmitStatus("Translation saved successfully");
            }
        } catch (error) {
            setSubmitStatus("Error saving translation");
        }
    };

    const translationExists = translations.some(
        (t) => t.locale === selectedLocale
    );


    const handleTranslate = async () => {
        if (!id) {
            setTranslateStatus("Product ID not available");
            return;
        }

        setTranslateLoading(true);
        setTranslateStatus("");

        try {
            // Always fetch the latest product data so we use up-to-date name/prices
            // even if the user just updated the product without refreshing the page.
            const productResult = await getAProductById(id);
            const freshProduct: Product | undefined =
                productResult?.data as Product | undefined;

            const productName = freshProduct?.name || product?.name;
            if (!productName) {
                setTranslateStatus("Product name not available");
                return;
            }

            const response = await fetch("/api/openai/translate-product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productName,
                    startPrice: freshProduct?.start_price ?? product?.start_price ?? "",
                    endPrice: freshProduct?.end_price ?? product?.end_price ?? "",
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                setTranslateStatus(`Translation failed: ${data.error}`);
                return;
            }

            setName(data.translated_name || "");
            if (data.start_price) setStartPrice(data.start_price);
            if (data.end_price) setEndPrice(data.end_price);
            setTranslateStatus("Translation complete! Review and submit.");
        } catch (error) {
            setTranslateStatus(
                `Error: ${error instanceof Error ? error.message : "Unknown error"}`
            );
        } finally {
            setTranslateLoading(false);
        }
    };

    return (
        <>
            <div className="mb-4">
                {LOCALES.map((locale) => (
                    <button
                        key={locale}
                        onClick={() => setSelectedLocale(locale)}
                        className={`px-4 py-2 mr-2 ${selectedLocale === locale
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200"
                            }`}
                    >
                        {locale.toUpperCase()}
                        {translations.find((t) => t.locale === locale) && (
                            <span className="ml-1 text-xs">✓</span>
                        )}
                    </button>
                ))}
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
                <div className="mb-6">
                    <label className="block text-sm font-bold mb-2">
                        Translated Product Name ({selectedLocale.toUpperCase()})
                    </label>
                    <input
                        className="border rounded w-full py-2 px-3"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-bold mb-2">
                        Start Price
                    </label>
                    <input
                        className="border rounded w-full py-2 px-3"
                        type="text"
                        value={startPrice}
                        onChange={(e) => setStartPrice(e.target.value)}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-bold mb-2">
                        End Price
                    </label>
                    <input
                        className="border rounded w-full py-2 px-3"
                        type="text"
                        value={endPrice}
                        onChange={(e) => setEndPrice(e.target.value)}
                    />
                </div>

                <div className="flex gap-3 mb-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                    >
                        {translationExists
                            ? `Update (${selectedLocale.toUpperCase()})`
                            : `Create (${selectedLocale.toUpperCase()})`}
                    </button>



                    {selectedLocale === "bn" && (id || product?.name) && (
                        <button
                            type="button"
                            onClick={handleTranslate}
                            disabled={translateLoading}
                            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                        >
                            {translateLoading ? "Translating..." : "🤖 Translate with AI"}
                        </button>
                    )}
                </div>

                {submitStatus && (
                    <div className="mt-4 text-sm text-green-600">
                        {submitStatus}
                    </div>
                )}

                {translateStatus && (
                    <div
                        className={`mt-4 text-sm ${translateStatus.includes("Error") ||
                            translateStatus.includes("failed")
                            ? "text-red-600"
                            : "text-green-600"
                            }`}
                    >
                        {translateStatus}
                    </div>
                )}
            </form>
        </>
    );
};

export default ProductTransForm;