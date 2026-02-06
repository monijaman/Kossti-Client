export interface brandInt {
  id: number;
  name: string;
  slug: string;
  priority: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}

export type SubmitSpecResponse = {
  success: boolean;
  error?: string;
  data?: {
    message: string;
    // other fields if any
  };
};

export interface categoryInt {
  id: number;
  name: string;
  category_slug: string;
  slug: string;
  status?: boolean;
  total?: number;
  priority: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  slug: string;
  review: string;
  price: number;
  category_id?: number;
  brand_id?: number;
  category_slug?: string;
  brand_slug?: string;
  model?: string;
  status?: boolean;
  priority?: number;
  translations?: ProductTranslation[];

  // Enhanced fields - full objects (like Laravel relationships)
  category?: {
    id: number;
    name: string;
    slug: string;
  };

  brand?: {
    id: number;
    name: string;
    slug: string;
  };

  photo?: string;
  views_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductTranslation {
  id: number;
  product_id: number;
  locale: string;
  translated_name: string; // Changed from 'name' to 'translated_name' to match Go API
  price: string; // Changed from number to string to match Go API
  created_at?: string;
  updated_at?: string;
}

export interface SidebarParams {
  dataset?: Brand[];
  selectedBrands?: string; // Change from string[] to string
  activeCategory?: string; // Change from string[] to string
  activePriceRange?: string; // Change from string[] to string
  searchTerm?: string;
  countryCode?: string;
  initialBrands?: Brand[];
}

export interface ProductApiResponse {
  products: Product[];
  totalProducts: number;
}

// export interface SidebarParams {
//   dataset?: brandInt[];
//   selectedBrands?: string; // Change from string[] to string
//   activeCategory?: string; // Change from string[] to string
//   activePriceRange?: string; // Change from string[] to string
// }
export interface MessageInfo {
  message: string;
  id: number;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T | null; // Data will be null if the request fails
  error?: string; // Error message if something goes wrong
  status?: number; // Server status code
}

export interface SearchBoxProps {
  initialSearchTerm?: string;
  searchUrl?: string;
  countryCode?: string;
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
  id: number;
  product_id: number;
  rating: number;
  reviews: string;
  additional_details: string | VideoItem[]; // Allow both string and VideoItem[]
  price: number;
  locale: string;
  created_at: string; // Added created_at field
  updated_at: string;
  translations?: ReviewTranslation[];
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
  status?: boolean;
}
export interface Brand {
  id: number | null;
  name: string | null;
  slug?: string;
  status?: boolean;
  total?: number;
}

export interface BrandTranslation {
  id: number;
  brand_id: number;
  locale: string;
  translated_name: string;
  created_at: string;
  updated_at: string;
}

export interface ProductPhotos {
  id: number;
  name?: string;
  product_id: number;
  defaultphoto?: number;
  path: string;
  status?: string;
  media_type?: string;
  file_size?: number;
  asset_url?: string; // Legacy field - kept for backwards compatibility
  url: string; // New field - presigned URL from S3
  created_at?: string;
  updated_at?: string;
}

export interface SpecificationInt {
  id?: number;
  product_id?: number;
  specification_key_id: string | number;
  specification_key?: string;
  value: string;
  created_at?: string;
  updated_at?: string;
}

export interface SpecKeyTranslation {
  id: null | number;
  locale: string;
  specification_key_id: number | null;
  translated_key: string;
  TranslatedKey?: string;
  translated_value?: string;
}

export interface SpecificationKey {
  id: number | null;
  specification_key: string;
  created_at?: string;
  updated_at?: string;
}

export interface country {
  query: string;
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
}
export type SupportedLocale = "en" | "bn";

export const supportedLocales: SupportedLocale[] = ["en", "bn"];

export interface Translations {
  [key: string]: string; // Optional: Allows additional keys
}

export interface CategoryTranslation {
  id: number;
  category_id: number;
  locale: string;
  translated_name: string;
  created_at: string;
  updated_at: string;
}

export interface CategoryTranslationResponse {
  category_id: number;
  count: number;
  translations: CategoryTranslation[];
}

export type LocaleKeys = "en" | "bn";

export interface VideoItem {
  id: number;
  url: string;
  title: string;
  youtubeUrl?: string; // Optional property to resolve the issue
}

export interface MarketProduct {
  name: string;
  description: string;
  type: string;
  // Add other fields as necessary for import
  price?: number;
  category_id?: number;
  brand_id?: number;
}
