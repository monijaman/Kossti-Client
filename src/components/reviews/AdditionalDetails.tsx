import React from 'react';

interface AdditionalDetail {
    youtubeUrl?: string; // Optional YouTube URL
    sourceUrl?: string;  // Optional Source Link
}

interface AdditionalDetailsFormProps {
    additionalDetails: AdditionalDetail[];
    setAdditionalDetails: React.Dispatch<React.SetStateAction<AdditionalDetail[]>>;
}

const AdditionalDetailsForm: React.FC<AdditionalDetailsFormProps> = ({ additionalDetails, setAdditionalDetails }) => {
    // Add a new YouTube URL field
    const handleAddYouTube = () => {
        setAdditionalDetails([...additionalDetails, { youtubeUrl: '' }]);
    };

    // Add a new Source Link field
    const handleAddSource = () => {
        setAdditionalDetails([...additionalDetails, { sourceUrl: '' }]);
    };

    // Handle change for both YouTube and Source fields
    const handleAdditionalDetailsChange = (index: number, field: 'youtubeUrl' | 'sourceUrl', value: string) => {
        const updatedDetails = [...additionalDetails];
        updatedDetails[index][field] = value;
        setAdditionalDetails(updatedDetails);
    };

    // Remove a YouTube URL or Source Link by index
    const handleRemoveDetail = (index: number) => {
        const updatedDetails = additionalDetails.filter((_, i) => i !== index);
        setAdditionalDetails(updatedDetails);
    };

    // Filter and render YouTube URLs first
    const youtubeDetails = additionalDetails.filter(detail => detail.youtubeUrl !== undefined);

    // Filter and render Source Links after YouTube URLs
    const sourceDetails = additionalDetails.filter(detail => detail.sourceUrl !== undefined);

    return (
        <div>
            {/* Render YouTube URLs first */}
            {/* <h3 className="font-semibold mb-2">YouTube URLs</h3> */}
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

            {/* Render Source Links second */}
            {/* <h3 className="font-semibold mb-2">Source Links</h3> */}
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
