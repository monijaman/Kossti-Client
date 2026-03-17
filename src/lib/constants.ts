export const LOCALES = ["en", "bn"];
export const DEFAULT_LOCALE = "bn"; // Changed to Bangla as default

// Site Configuration
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://kossti.com";
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Kossti";
export const OG_IMAGE_URL = `${SITE_URL}/og-image.png`;

export const apiEndpoints = {
  // Authentication endpoints
  register: "/api/register",
  login: "/api/login",
  refreshToken: "/api/refresh-token",
  registration: "/api/registration",
  loginV1: "/api/login",
  forgotPassword: "/api/forgot-password",
  resetPassword: "/api/reset-password",
  logout: "/api/v1/logout",
  checkToken: "/api/check-token",
  searchUsers: "/api/search_users",
  profile: "/api/profile",
  checkRole: "/api/checkrole",

  // User endpoints
  users: "/users",
  allUsers: "/users/all",
  searchUsersApi: "/users/search",
  userCount: "/users/count",
  getUserById: (id: number | string) => `/users/${id}`,

  // Product endpoints
  getProducts: "/products",
  createProduct: "/products",
  getProductById: (id: number | string) => `/products/${id}`,
  updateProduct: (id: number | string) => `/products/${id}`,
  getMarketProducts: "/market-products",
  getProductBySlug: (slug: string) => `/products-by-slug/${slug}`,
  getPopularProducts: "/popular-products",
  incrementProductViews: (id: number | string) =>
    `/products/${id}/increment-views`,

  // Category endpoints
  Categories: "/categories",
  getCategories: "/categories",
  createCategory: "/categories",
  getCategoryById: (id: number | string) => `/categories/${id}`,
  category: (id: number | string) => `/categories/${id}`,
  deleteCategory: (id: number | string) => `/categories/${id}`,
  getWideCategories: "/wide-categories",
  categoryTranslation: "/category-translation",
  categoryTranslationById: (categoryId: number | string) =>
    `/category-translation/${categoryId}`,
  getCategoryTranslation: (id: number | string) =>
    `/category-translation/${id}`,
  createCategoryBrands: "/category-brands",
  getCategoryBrands: "/category-brands",
  updateCategoryStatus: (id: number | string) => `/category-status/${id}`,

  // Brand endpoints

  getBrands: "/brands",
  createBrand: "/brands",
  brandTranslation: (brandId: number) => `/brand-translation/${brandId}`,
  brandTrans: () => `/brand-translation`,
  Brands: (brandId: number) => `/brands/${brandId}`,
  Brand: "/brands",
  getBrandById: (id: number | string) => `/brands/${id}`,
  updateBrand: (id: number | string) => `/brands/${id}`,
  deleteBrand: (id: number | string) => `/brands/${id}`,
  getPublicBrands: "/public-brands",
  BrandStatus: (brand_id: number) => `/brand-status/${brand_id}`, //post
  productTranslation: (productId: number, locale: string) =>
    `products/${productId}/translations?locale=${locale}}`, // get product translation for a locale
  // Specification endpoints
  getSpecificationById: (id: number | string) => `/specifications/${id}`,
  updateSpecification: (id: number | string) => `/specifications/${id}`,
  deleteSpecification: (id: number | string) => `/specifications/${id}`,
  searchSpecifications: "/specificationsearch",
  createSpecTranslation: "/spec_translation",
  updateSpecTranslationValues: "/spec_translation/values",
  getSpecTranslation: (id: number | string) => `/spec_translation/${id}`,
  getPublicSpecs: (productId: number) => `/get-public-spec/${productId}`,
  getSpecKeys: "/speckey",
  createSpecKey: "/speckey",
  getSpecKeyById: (id: number | string) => `/speckey/${id}`,
  removeSpec: (id: number | string) => `/specremove/${id}`,
  getSpecKeyTranslations: "/speckey-translation",
  createSpecKeyTranslation: "/speckey-translation",
  buckSpecUpdate: `/specifications/bulk`,
  // FormGenerator endpoints
  formGenerator: (categoryId: number) => `/formgenerator/${categoryId}`,
  getFormGenerator: () => "/formgenerator",
  getFormGeneratorById: (id: number | string) => `/formgenerator/${id}`,
  updateFormGenerator: (id: number | string) => `/formgenerator/${id}`,
  getCategorySpecs: (categoryId: number | string) =>
    `/category-specs/${categoryId}`,

  // Feedback endpoints
  getFeedbacks: "/feedbacks",
  createFeedback: "/feedbacks",
  getFeedbackById: (id: number | string) => `/feedbacks/${id}`,
  updateFeedback: (id: number | string) => `/feedbacks/${id}`,
  deleteFeedback: (id: number | string) => `/feedbacks/${id}`,
  getFeedbackTranslations: (id: number | string) =>
    `/feedbacks/${id}/translations`,

  // Health check
  health: "/health",

  // Comments endpoints
  createComment: () => `/comments`,
  getCommentsByProductId: (id: number | string) => `/comments/product/${id}`,
  createCommentTranslation: () => `/comment-translations`,

  // Review endpoints (existing)
  getPublicReviewsByProductId: (id: number | string, countryCode: string) =>
    `/public-reviews/${id}?locale=${countryCode}`,
  productReviews: (id: number | string, countryCode: string) =>
    `/product-reviews/${id}?locale=${countryCode}`,
  getReviews: `get`,
  submitBrands: (brandid: number) => `category-brands/${brandid}`,
  getAProductById: (id: number) => `/products/${id}`,
};

export const API_ROUTES = {
  categories: "wide-categories",
  brands: "wide-brands",
  products: "products",
  popularProducts: "popular-products",
};
