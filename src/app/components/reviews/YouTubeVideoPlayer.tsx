"use client"
import React from 'react';

interface YouTubeModalProps {
    videoUrl: string;
    isOpen: boolean;
    onClose: () => void;
}

const YouTubeModal: React.FC<YouTubeModalProps> = ({ videoUrl, isOpen, onClose }) => {
    if (!isOpen) return null; // Don't render anything if modal is not open

    // Get the video URL and modify it for embedding (if necessary)
    const videoEmbedUrl = videoUrl.replace("watch?v=", "embed/") + "?autoplay=1"; // Autoplay on open

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50" onClick={onClose}>
            <div className="bg-white rounded-lg w-3/4 sm:w-1/2 md:w-1/3 p-4">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white bg-red-500 p-2 rounded-full"
                >
                    X
                </button>
                <iframe
                    width="100%"
                    height="515"
                    src={videoEmbedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-md"
                ></iframe>
            </div>
        </div>
    );
};

export default YouTubeModal;
