export const LOCALES = ["en", "bn"];
export const DEFAULT_LOCALE = "en";

export const apiEndpoints = {
  getProducts: "products",
  getPublicReviewsByProductId: (id: number | string, countryCode: string) =>
    `public-reviews/${id}/${countryCode}`,
  updateBrandStatus: (brand_id: number) => `brand-status/${brand_id}`,
  getCategories: "categories",
  getWideCategories: "wide-categories",
  getPublicBrands: `public-brands`,
  // getPublicSpecs: (productId:number, countryCode:string)=> `get-public-spec/${productId}/}`,
  getPublicSpecs: (productId: number) => `get-public-spec/${productId}`,
  getReviews: `get`,
  submitBrands: (brandid: number) => `category-brands/${brandid}`,
  getAProductById: (id: number) => `product/${id}`,
};

export const API_ROUTES = {
  categories: "wide-categories",
  brands: "wide-brands",
  products: "products",
  popularProducts: "popular-products",
};
