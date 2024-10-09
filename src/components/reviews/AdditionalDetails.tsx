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
        const parsedAdditionalDetails: AdditionalDetail[] = Array.isArray(additionalDetails) ? additionalDetails : [];

        // We map through the details and retain even empty fields
        const youtubeDetails = parsedAdditionalDetails.map(detail => ({
            youtubeUrl: detail.youtubeUrl || '' // Keep the empty values
        }));

        const sourceDetails = parsedAdditionalDetails.map(detail => ({
            sourceUrl: detail.sourceUrl || '' // Keep the empty values
        }));

        setYoutubeDetails(youtubeDetails);
        setSourceDetails(sourceDetails);
    }, [additionalDetails]);

    return (
        <div>
            {/* Render YouTube URLs */}
            {youtubeDetails.map((detail, index) => (
                <div key={`youtube_${index}`} className="mb-4">
                    <label htmlFor={`youtubeUrl_${index}`} className="block mb-2">
                        YouTube URL {index + 1}
                    </label>
                    <input
                        type="url"
                        id={`youtubeUrl_${index}`}
                        value={detail.youtubeUrl}
                        onChange={(e) => handleDetailsChange(index, 'youtubeUrl', e.target.value)}
                        placeholder="Enter a YouTube URL"
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
            ))}

            {/* Render Source Links */}
            {sourceDetails.map((detail, index) => (
                <div key={`source_${index}`} className="mb-4">
                    <label htmlFor={`sourceUrl_${index}`} className="block mb-2">
                        Source Link {index + 1}
                    </label>
                    <input
                        type="url"
                        id={`sourceUrl_${index}`}
                        value={detail.sourceUrl}
                        onChange={(e) => handleDetailsChange(index, 'sourceUrl', e.target.value)}
                        placeholder="Enter a Source URL"
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
            ))}

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
