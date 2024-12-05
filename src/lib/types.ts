export interface brandInt {
  id: number;
  name: string;
  slug: string;
  priority: number;
  deleted_at: null;
  created_at: string;
  updated_at: string;
}

export interface categoryInt {
  id: number;
  name: string;
  category_slug: string;
  slug: string;
  status?: boolean;
  total?: number;
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
  category_slug: string;
  brand: string;
  category: string;
  model?: string | null;
  photo: string;
  price: number; // or number
  status?: number; // or whatever type it is
  priority?: number; // or whatever type it is
  reviews?: Review[];
  translations?: ProductTranslation[]; // or whatever type it is

  specifications?: SpecificationInt[]; // Ensure specifications is included here
}

export interface ProductTranslation {
  id: number;
  product_id: number;
  locale: string;
  name: string;
  price: number;
}

export interface SidebarParams {
  dataset?: Brand[];
  selectedBrands?: string; // Change from string[] to string
  activeCategory?: string; // Change from string[] to string
  activePriceRange?: string; // Change from string[] to string
  searchTerm?: string;
  countryCode?: string;
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

export interface SearchBoxProps {
  initialSearchTerm?: string;
  searchUrl?: string;
}

export interface SearchParams {
  page?: string;
  slug?: string;
  limit?: number;
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
  user_id: string;
  reviews: string;
  rating: string;
  price: number;
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
  status?: boolean;
}
export interface Brand {
  id: number | null;
  name: string | null;
  slug?: string;
  status?: boolean;
  total?: number;
}

export interface ProductPhotos {
  id: number;
  name: string;
  product_id: number;
  defaultphoto: number;
  path: string;
  status: string;
  media_type?: string;
  file_size?: number;
  asset_url: string;
}

export interface SpecificationInt {
  id?: number;
  specification_key_id: string;
  value: string;
}

export interface SpecKeyTranslation {
  id: null | number;
  locale: string;
  specification_id: number | null;
  translated_key: null | number;
  translated_value: string; // Allow undefined
}

export interface SpecificationKey {
  id: number | null;
  specification_key: string;
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

export type LocaleKeys = "en" | "bn";
