import { ProductPhotos } from '@/lib/types';
import Image from 'next/image';
import { useState } from 'react';


type PhotoCarouselProps = {
    photos: ProductPhotos[];
};

const PhotoCarousel = ({ photos }: PhotoCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Function to handle the previous photo
    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? photos.length - 1 : prevIndex - 1
        );
    };

    // Function to handle the next photo
    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === photos.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="p-4 bg-white border rounded shadow-md flex items-center justify-center min-h-[450px]">
            {/* Previous Button */}
            <button
                onClick={handlePrev}
                className="mr-4 bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
                aria-label="Previous Photo"
            >
                &larr;
            </button>

            {/* Display the current photo */}
            {photos.length > 0 && (
                <Image
                    src={photos[currentIndex]?.asset_url ?? ''}
                    alt={`Photo ${currentIndex + 1}`}
                    style={{
                        width: "auto",
                        height: "450px",
                    }}
                    width={400}
                    height={450}
                    className="rounded"
                />
            )}

            {/* Next Button */}
            <button
                onClick={handleNext}
                className="ml-4 bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
                aria-label="Next Photo"
            >
                &rarr;
            </button>
        </div>
    );
};

export default PhotoCarousel;
