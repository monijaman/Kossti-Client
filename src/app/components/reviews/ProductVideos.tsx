"use client"
import { useProducts } from '@/hooks/useProducts';
import { VideoItem } from '@/lib/types';
import { useEffect, useState } from 'react';

interface ProductVideosProps {
    productId: number;
    locale?: string;
}

const ProductVideos = ({ productId, locale = 'en' }: ProductVideosProps) => {
    const { getVideosByProductId } = useProducts();
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Debug: Log the locale being received
    console.log(`[ProductVideos] Component rendered with productId=${productId}, locale=${locale}`);
    
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                setLoading(true);
                setError(null);
                                
                // Fetch videos based on locale
                let response = await getVideosByProductId(productId, locale);

                // ONLY fallback from bn → en, never from en → bn
                if (locale === 'bn' && (!response?.data || response.data.length === 0)) {
                    response = await getVideosByProductId(productId, 'en');
                }

                if (response?.data) {
                    const videosData = Array.isArray(response.data) ? response.data : [];
                    // Deduplicate videos by ID to prevent duplicate keys
                    const uniqueVideos = videosData.filter((video, index, self) =>
                        index === self.findIndex((v) => v.id === video.id)
                    );
                    setVideos(uniqueVideos);
                } else {
                    setVideos([]);
                }
            } catch (err) {
                console.error('Error fetching videos:', err);
                setError('Failed to load videos');
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchVideos();
        }
    }, [locale]);

    if (loading) {
        return (
            <div className="my-8 p-6 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    if (!videos || videos.length === 0) {
        return null;
    }

    return (
        <div className="my-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Videos</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, index) => {
                    const youtubeUrl = video.youtubeUrl || video.url;
                    
                    if (!youtubeUrl) return null;
                    
                    const videoId = extractYoutubeId(youtubeUrl);

                    if (!videoId) return null;

                    return (
                        <div key={`video-${video.id}`} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                            {/* Video Thumbnail */}
                            <div className="relative w-full bg-black aspect-video">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src={`https://www.youtube.com/embed/${videoId}`}
                                    title={video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0"
                                />
                            </div>

                            {/* Video Info */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                    {video.title}
                                </h3>
                                <a
                                    href={`https://www.youtube.com/watch?v=${videoId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                    Watch on YouTube
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Helper function to extract YouTube video ID from URL
function extractYoutubeId(url: string): string | null {
    if (!url) return null;

    // Handle youtube.com/watch?v=ID
    let match = url.match(/[?&]v=([^&]+)/);
    if (match) return match[1];

    // Handle youtu.be/ID
    match = url.match(/youtu\.be\/([^?&]+)/);
    if (match) return match[1];

    // Handle youtube.com/embed/ID
    match = url.match(/\/embed\/([^?&]+)/);
    if (match) return match[1];

    // If it's just an ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;

    return null;
}

export default ProductVideos;
