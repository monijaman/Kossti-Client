'use client'
import { useEffect } from 'react';

interface AdditionalDetail {
    youtubeUrl?: string; // Optional YouTube URL
    sourceUrl?: string;  // Optional Source Link
}

interface FormProps {
    additionalDetails: AdditionalDetail[]; // Array type for additional details
    setAdditionalDetails: (details: AdditionalDetail[]) => void; // Callback function for updating details
    // Optional: parent-managed show flag for the transient message
    showMessage?: boolean;
    // Optional: parent-managed change handler. If provided, it's called on user edits/add/remove
    onDetailsChange?: (details: AdditionalDetail[]) => void;
}

const AdditionalDetailsForm = ({ additionalDetails = [], setAdditionalDetails, showMessage = false, onDetailsChange }: FormProps) => {

    // Note: message/timer logic is handled by the parent. If a parent handler is provided
    // we call it on user edits so the parent can decide whether to show a transient message.
    const handleDetailsChange = (index: number, field: 'youtubeUrl' | 'sourceUrl', value: string) => {
        const updatedDetails = [...additionalDetails];
        updatedDetails[index] = { ...updatedDetails[index], [field]: value }; // Update the specific field
        if (typeof onDetailsChange === 'function') {
            onDetailsChange(updatedDetails);
        } else {
            setAdditionalDetails(updatedDetails);
        }
    };

    // Remove a YouTube URL or Source Link by index
    const handleRemoveDetail = (index: number) => {
        const currentDetails: AdditionalDetail[] = Array.isArray(additionalDetails) ? additionalDetails : [];
        // Proceed to remove the detail if we have a valid array
        const updatedDetails = currentDetails.filter((_, i) => i !== index);
        if (typeof onDetailsChange === 'function') {
            onDetailsChange(updatedDetails);
        } else {
            setAdditionalDetails(updatedDetails);
        }
    };

    const handleURL = (): AdditionalDetail[] => {
        return Array.isArray(additionalDetails) ? additionalDetails : [];
    };

    // Reusable function to add new details (YouTube URL or Source Link)
    const addNewField = (field: 'youtubeUrl' | 'sourceUrl') => {
        const currentDetails = handleURL();
        const newDetail = field === 'youtubeUrl' ? { youtubeUrl: '' } : { sourceUrl: '' };
        const updatedDetails = [...currentDetails, newDetail];
        if (typeof onDetailsChange === 'function') {
            onDetailsChange(updatedDetails);
        } else {
            setAdditionalDetails(updatedDetails);
        }
    };

    // Add a new YouTube URL field
    const handleAddYouTube = () => addNewField('youtubeUrl');
    // Add a new Source Link field
    const handleAddSource = () => addNewField('sourceUrl');


    useEffect(() => {
        // Ensure additionalDetails is an array; if not, normalize to empty array
        const parsedAdditionalDetails: AdditionalDetail[] = Array.isArray(additionalDetails) ? additionalDetails : [];
        // Normalize once on mount/update (will be a no-op if already array)
        // Use direct setter to avoid triggering parent message on initial load
        setAdditionalDetails(parsedAdditionalDetails);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    // Return array of { detail, index } sorted so YouTube entries appear before source links
    const sortDetails = (details?: AdditionalDetail[]) => {
        const list = Array.isArray(details) ? details : [];
        // Map to objects with original index so we can update correctly
        const indexed = list.map((d, i) => ({ detail: d, index: i }));

        indexed.sort((a, b) => {
            const hasYoutubeA = 'youtubeUrl' in a.detail;
            const hasYoutubeB = 'youtubeUrl' in b.detail;
            const hasSourceA = 'sourceUrl' in a.detail;
            const hasSourceB = 'sourceUrl' in b.detail;

            if (hasYoutubeA && !hasYoutubeB) return -1;
            if (!hasYoutubeA && hasYoutubeB) return 1;

            if (hasSourceA && !hasSourceB) return 1;
            if (!hasSourceA && hasSourceB) return -1;

            return 0;
        });

        return indexed;
    }

    return (
        <div>
            {/* Render YouTube URLs */}

            {sortDetails(additionalDetails).map(({ detail, index }) => {
                const isYouTube = 'youtubeUrl' in detail;
                const value = isYouTube ? (detail.youtubeUrl ?? '') : (detail.sourceUrl ?? '');

                return (
                    <div key={`${isYouTube ? 'youtube' : 'source'}_${index}`} className="mb-4">
                        <label htmlFor={`details_${index}`} className="block mb-2">
                            {isYouTube ? `YouTube URL ${index + 1}` : `Source Link ${index + 1}`}
                        </label>
                        <input
                            type="url"
                            id={`details_${index}`}
                            value={value}
                            onChange={(e) => handleDetailsChange(index, isYouTube ? 'youtubeUrl' : 'sourceUrl', e.target.value)}
                            placeholder={isYouTube ? "Enter a YouTube URL" : "Enter a Source URL"}
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
            })}


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

            {/* Ephemeral confirmation message after edits — parent controls visibility via showMessage prop */}
            {showMessage && (
                <div className="mt-2 text-sm text-green-400">Additional details updated</div>
            )}
        </div>
    );
};

export default AdditionalDetailsForm;
