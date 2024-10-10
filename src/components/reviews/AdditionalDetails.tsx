'use client'
import React, { useEffect, useState } from 'react';

interface AdditionalDetail {
    youtubeUrl?: string; // Optional YouTube URL
    sourceUrl?: string;  // Optional Source Link
}

interface FormProps {
    additionalDetails: AdditionalDetail[]; // Array type for additional details
    setAdditionalDetails: (details: AdditionalDetail[]) => void; // Callback function for updating details
}

const AdditionalDetailsForm = ({ additionalDetails = [], setAdditionalDetails }: FormProps) => {

    // Handle change for both YouTube and Source fields
    const handleDetailsChange = (index: number, field: 'youtubeUrl' | 'sourceUrl', value: string) => {
        const updatedDetails = [...additionalDetails];
        updatedDetails[index] = { ...updatedDetails[index], [field]: value }; // Update the specific field
        setAdditionalDetails(updatedDetails);
    };

    // Remove a YouTube URL or Source Link by index
    const handleRemoveDetail = (index: number) => {
        let currentDetails: AdditionalDetail[] = Array.isArray(additionalDetails) ? additionalDetails : [];
        // Proceed to remove the detail if we have a valid array
        const updatedDetails = currentDetails.filter((_, i) => i !== index);
        setAdditionalDetails(updatedDetails); // Update the state
    };

    const handleURL = (): AdditionalDetail[] => {
        return Array.isArray(additionalDetails) ? additionalDetails : [];
    };

    // Reusable function to add new details (YouTube URL or Source Link)
    const addNewField = (field: 'youtubeUrl' | 'sourceUrl') => {
        const currentDetails = handleURL();
        const newDetail = field === 'youtubeUrl' ? { youtubeUrl: '' } : { sourceUrl: '' };
        const updatedDetails = [...currentDetails, newDetail];
        setAdditionalDetails(updatedDetails); // Update the state
    };

    // Add a new YouTube URL field
    const handleAddYouTube = () => addNewField('youtubeUrl');

    // Add a new Source Link field
    const handleAddSource = () => addNewField('sourceUrl');

    // Filter and render Source Links after YouTube URLs
    const [youtubeDetails, setYoutubeDetails] = useState<AdditionalDetail[]>([]);
    const [sourceDetails, setSourceDetails] = useState<AdditionalDetail[]>([]);



    useEffect(() => {
        // Check if additionalDetails is an array; if not, use an empty array
        const parsedAdditionalDetails: AdditionalDetail[] = Array.isArray(additionalDetails) ? additionalDetails : [];

        // Update state with sorted details
        setAdditionalDetails(parsedAdditionalDetails);

    }, [additionalDetails]);



    const sortDetails = (details: AdditionalDetail[]) => {
        details.sort((a, b) => {
            const hasYoutubeA = 'youtubeUrl' in a;
            const hasYoutubeB = 'youtubeUrl' in b;
            const hasSourceA = 'sourceUrl' in a;
            const hasSourceB = 'sourceUrl' in b;

            // Sorting logic as per your requirements
            if (hasYoutubeA && !hasYoutubeB) return -1; // a comes first
            if (!hasYoutubeA && hasYoutubeB) return 1; // b comes first


            // If both have sourceUrl, maintain original order (0)
            if (hasSourceA && !hasSourceB) return 1; // b comes first
            if (!hasSourceA && hasSourceB) return -1; // a comes first

            return 0; // If both are the same type, keep original order
        })
        return additionalDetails;
    }

    return (
        <div>
            {/* Render YouTube URLs */}

            {sortDetails(additionalDetails)
                .map((detail, index) => {
                    return (
                        <div key={`${'youtubeUrl' in detail ? 'youtube' : 'source'}_${index}`} className="mb-4">
                            <label htmlFor={`details_${index}`} className="block mb-2">
                                {'youtubeUrl' in detail ? `YouTube URL ${index + 1}` : `Source Link ${index + 1}`}
                            </label>
                            <input
                                type="url"
                                id={`details_${index}`}
                                value={'youtubeUrl' in detail ? detail.youtubeUrl : detail.sourceUrl}
                                onChange={(e) => handleDetailsChange(index, 'youtubeUrl' in detail ? 'youtubeUrl' : 'sourceUrl', e.target.value)}
                                placeholder={'youtubeUrl' in detail ? "Enter a YouTube URL" : "Enter a Source URL"}
                                className="w-full p-2 mb-2 border rounded"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveDetail(index)}
                                className="text-red-500"
                            >
                                Remove
                            </button>
                        </div>
                    );
                })
            }




            {/* Buttons to add YouTube URL or Source Link */}
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={handleAddYouTube}
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                    Add YouTube URL
                </button>
                <button
                    type="button"
                    onClick={handleAddSource}
                    className="bg-green-500 text-white py-2 px-4 rounded"
                >
                    Add Source Link
                </button>
            </div>
        </div>
    );
};

export default AdditionalDetailsForm;
