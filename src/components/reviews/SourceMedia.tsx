"use client"
import YouTubeModal from '@/components/reviews/YouTubeVideoPlayer';
import { useProducts } from '@/hooks/useProducts';
import Image from 'next/image';
import { useEffect, useState } from 'react';
interface VideoItem {
    youtubeUrl: string;
    sourceUrl?: string;
}

interface VideoGridProps {
    dataset: VideoItem[];
    productId: number;
}

const VideoGrid = ({ dataset, productId }: VideoGridProps) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>("");
    const { incrementViews } = useProducts()

    const incrementViewsFunc = async () => {
        try {
            const response = await incrementViews(productId);
            if (!response.ok) {
                console.error('Failed to increment views count');
            }
        } catch (error) {
            console.error('Error incrementing views count:', error);
        }
    };

    useEffect(() => {
        incrementViewsFunc();
    }, [])

    // Open the modal with the selected video URL
    const openModal = (url: string) => {
        setSelectedVideoUrl(url);
        setModalOpen(true);
    };

    // Close the modal
    const closeModal = () => {
        setModalOpen(false);
        setSelectedVideoUrl(""); // Reset the video URL
    };

    return (
        <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4 justify-items-center">
                {dataset?.filter((item) => item.youtubeUrl) // Only items with youtubeUrl
                    .map((item, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 shadow-md rounded-lg cursor-pointer hover:shadow-lg transition duration-200 flex justify-center items-center"
                            onClick={() => openModal(item.youtubeUrl)}
                        >
                            {/* YouTube Thumbnail */}
                            <div className="relative">

                                <Image
                                    className="total-files"
                                    src={`https://img.youtube.com/vi/${item.youtubeUrl.split("v=")[1]}/hqdefault.jpg`}
                                    alt="YouTube Thumbnail"
                                    title={""}
                                    sizes="100vw"
                                    style={{
                                        width: "400px",
                                        height: "450px",
                                    }}
                                    width={201}
                                    height={150}
                                    priority // Optional: Set priority for loading
                                />

                            </div>
                        </div>
                    ))}

                {/* Render YouTubeModal on clicking a video */}
                <YouTubeModal
                    videoUrl={selectedVideoUrl}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            </div>


            {/* Display Source URLs in a separate section */}
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Useful Links</h2>
                {dataset?.filter(item => item.sourceUrl) // Filter only items with sourceUrl
                    .map((item, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 shadow-md rounded-lg mt-4"
                        >
                            <h3 className="text-xl font-semibold mb-2">Source {index + 1}</h3>
                            <a
                                href={item.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {item.sourceUrl}
                            </a>
                        </div>
                    ))}
            </div>
        </>
    );
};

export default VideoGrid;
