'use client'
import React, { useEffect, useState } from 'react';

interface AdditionalDetail {
    youtubeUrl?: string; // Optional YouTube URL
    sourceUrl?: string;  // Optional Source Link
}

interface AdditionalDetailsFormProps {
    additionalDetails?: AdditionalDetail[];
    setAdditionalDetails: React.Dispatch<React.SetStateAction<AdditionalDetail[]>>;
}

const AdditionalDetailsForm: React.FC<AdditionalDetailsFormProps> = ({ additionalDetails = [], setAdditionalDetails }) => {
    // Handle change for both YouTube and Source fields
    const handleAdditionalDetailsChange = (index: number, field: 'youtubeUrl' | 'sourceUrl', value: string) => {
        const updatedDetails = [...additionalDetails];
        updatedDetails[index] = { ...updatedDetails[index], [field]: value }; // Update the specific field
        setAdditionalDetails(updatedDetails);
    };

    // Remove a YouTube URL or Source Link by index
    const handleRemoveDetail = (index: number) => {
        const updatedDetails = additionalDetails.filter((_, i) => i !== index);
        setAdditionalDetails(updatedDetails);
    };

    // Add a new YouTube URL field
    const handleAddYouTube = () => {

        setAdditionalDetails([...additionalDetails, { youtubeUrl: '' }]);

        console.log('ddddddddddddd', { youtubeUrl: '' })

    };

    // Add a new Source Link field
    const handleAddSource = () => {
        setAdditionalDetails([...additionalDetails, { sourceUrl: '' }]);
    };

    // Filter and render Source Links after YouTube URLs
    const [youtubeDetails, setYoutubeDetails] = useState<AdditionalDetail[]>([]);
    const [sourceDetails, setSourceDetails] = useState<AdditionalDetail[]>([]);

    useEffect(() => {
        // Ensure additionalDetails is a stringified JSON array and parse it if necessary
        let parsedAdditionalDetails: AdditionalDetail[] = [];
    
        if (typeof additionalDetails === 'string') {
            try {
                // Parse the string into a JSON array
                parsedAdditionalDetails = JSON.parse(additionalDetails);
            } catch (error) {
                console.error('Failed to parse additionalDetails JSON:', error);
            }
        } else if (Array.isArray(additionalDetails)) {
            // If additionalDetails is already an array, use it directly
            parsedAdditionalDetails = additionalDetails;
        }
    
        if (parsedAdditionalDetails.length > 0) {
            // Filter and extract YouTube URLs
            const youtubeDetails = parsedAdditionalDetails.filter(detail => detail.youtubeUrl && detail.youtubeUrl.trim() !== '');
            // Filter and extract Source Links
            const sourceDetails = parsedAdditionalDetails.filter(detail => detail.sourceUrl && detail.sourceUrl.trim() !== '');
    
            setYoutubeDetails(youtubeDetails);
            setSourceDetails(sourceDetails);
        }
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
                        onChange={(e) => handleAdditionalDetailsChange(index, 'youtubeUrl', e.target.value)}
                        placeholder="Enter a YouTube URL"
                        className="w-full p-2 mb-2 border rounded"
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
                        onChange={(e) => handleAdditionalDetailsChange(index, 'sourceUrl', e.target.value)}
                        placeholder="Enter a Source URL"
                        className="w-full p-2 mb-2 border rounded"
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
