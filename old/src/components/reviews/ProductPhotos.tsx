"use client"
import PhotoCarousel from '@/components/Photo/PhotoCarousel';
import { useProducts } from '@/hooks/useProducts';
import { ProductPhotos } from '@/lib/types';
import { useEffect, useState } from 'react';
interface PopularProductsProps {
    productId: number;
}

const ProductPhotosPage = ({ productId }: PopularProductsProps) => {
    const { getPhotosByProductId } = useProducts();
    const locale = 'bn';
    const [photos, setPhotos] = useState<ProductPhotos[]>([]);
    // Fetch specifications based on product ID and country code
    const fetchPhotos = async () => {
        const response = await getPhotosByProductId(productId);
        setPhotos(response.data);

    };

    // Await the fetch to get the actual data


    useEffect(() => {
        fetchPhotos();
    }, [])


    return (

        <div>
            {photos && photos.length > 0 ? (
                <PhotoCarousel photos={photos} />

            ) : (
                <p className="text-red-500">Error fetching specifications.</p>
            )}
        </div>

    );
};

export default ProductPhotosPage;
