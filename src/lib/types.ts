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
  slug: string;
  brand: string;
  category: string;
  model?: string | null;
  price: string; // or number
  specifications?: string[]; // or whatever type it is
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
  additional_details: string;
}