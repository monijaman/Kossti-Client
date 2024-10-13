export interface brandInt {
  id: number;
  name: string;
  slug: string;
  priority: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}

 

export interface Product {
  id: number;
  name: string;
  category_id: number;
  brand_id: number;
  slug: string;
  brand: string;
  category: string;
  model?: string | null;
  price: number; // or number
  status?: number; // or whatever type it is
  priority?: number; // or whatever type it is
  reviews?: Review[];
  translations?: ProductTranslation[]; // or whatever type it is
}

export interface ProductTranslation {
  id: number;
  product_id: number;
  locale: string;
  name: string;
  price: number;
}

export interface SidebarParams {
  dataset?: brandInt[];
  selectedBrands?: string; // Change from string[] to string
  activeCategory?: string; // Change from string[] to string
  activePriceRange?: string; // Change from string[] to string
  searchTerm?: string;
}

export interface ProductApiResponse {
  products: Product[];
  totalProducts: number;
}

export interface SidebarParams {
  dataset?: brandInt[];
  selectedBrands?: string; // Change from string[] to string
  activeCategory?: string; // Change from string[] to string
  activePriceRange?: string; // Change from string[] to string
}

export interface SearchBoxProps {
  initialSearchTerm?: string;
}

export interface SearchParams {
  page?: string;
  slug?: string;
  category?: string;
  brand?: string;
  price?: string;
  searchterm?: string;
  paginate?: string;
  locale?: string;
}

export interface SpecTranslation {
  id: number | null;
  locale: string;
  name: string;
  price: string;
  review: string;
  rating: string;
  product_review_id: string;
  additional_details: [];
}

export interface Review {
  id: number ;
  user_id: string;
  reviews: string;
  rating: string;
  additional_details: [];
  translations: ReviewTranslation[];
}

export interface ReviewTranslation {
  id?: number;
  user_id?: number;
  product_review_id?: string;
  locale: string;
  rating: number;
  review: string;
  price?: number;
  additional_details: AdditionalDetails[];
  created_at?: string;
  updated_at?: string;
}

export interface AdditionalDetails {
  youtubeUrl?: string;
  sourceUrl?: string;
}

export interface Category {
  id: number;
  name: string;
  slug?: string;
}
export interface Brand {
  id: number;
  name: string;
  slug?: string;
}

export interface ProductPhotos {
  id: number;
  name: string;
  product_id: number;
  default: number;
  path: string;
  status: string;
  media_type?: string;
  file_size?: number;
  asset_url: string;
}
