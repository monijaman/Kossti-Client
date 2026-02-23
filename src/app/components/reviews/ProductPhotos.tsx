"use client"
import PhotoCarousel from '@/app/components/Photo/PhotoCarousel';
import { useProducts } from '@/hooks/useProducts';
import { ProductPhotos } from '@/lib/types';
import { useEffect, useState } from 'react';
interface PopularProductsProps {
    productId: number;
}

const ProductPhotosPage = ({ productId }: PopularProductsProps) => {
    const { getPhotosByProductId } = useProducts();

    const [photos, setPhotos] = useState<ProductPhotos[]>([]);
    // Fetch specifications based on product ID and country code
    const fetchPhotos = async () => {
        const response = await getPhotosByProductId(productId);
        console.log('[ProductPhotos] Response:', response);
        setPhotos(response.data);

    };

    // Await the fetch to get the actual data


    useEffect(() => {
        fetchPhotos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [productId])


    return (

        <div>
            {photos && photos.length > 0 ? (
                <PhotoCarousel photos={photos} />

            ) : (
                <p className="text-red-500">No PHotos available</p>
            )}
        </div>

    );
};

export default ProductPhotosPage;
